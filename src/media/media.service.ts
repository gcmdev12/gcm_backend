import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { randomUUID } from 'crypto';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

@Injectable()
export class MediaService {
  async uploadImage(file: { buffer: Buffer; mimetype: string; originalname: string }, folder: string) {
    if (!file?.buffer || !file.mimetype) throw new BadRequestException('An image file is required.');
    if (!ALLOWED_TYPES[file.mimetype]) throw new BadRequestException('Only JPG, PNG, WEBP and GIF images are allowed.');
    if (file.buffer.length > MAX_FILE_SIZE) throw new BadRequestException('Image must be 5 MB or smaller.');

    const token = process.env.GITHUB_TOKEN;
    const repository = process.env.GITHUB_REPOSITORY ?? 'gcmdev12/gcm_website';
    const branch = process.env.GITHUB_BRANCH ?? 'main';
    if (!token) throw new InternalServerErrorException('Image storage is not configured on the server.');

    const safeFolder = folder === 'news' || folder === 'gallery' ? folder : 'uploads';
    const extension = ALLOWED_TYPES[file.mimetype];
    const baseName = file.originalname.replace(/\\.[^/.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 70) || 'image';
    const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}-${baseName}.${extension}`;
    const path = `public/images/uploads/${safeFolder}/${fileName}`;
    const encoded = file.buffer.toString('base64');

    const response = await fetch(`https://api.github.com/repos/${repository}/contents/${path}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
        'User-Agent': 'glory-children-ministry-backend',
      },
      body: JSON.stringify({
        message: `Upload ${safeFolder} image: ${fileName}`,
        content: encoded,
        branch,
      }),
    });

    const payload = await response.json() as { content?: { path?: string }; commit?: { sha?: string }; message?: string };
    if (!response.ok) {
      throw new InternalServerErrorException(payload.message || 'GitHub image upload failed.');
    }

    const publicPath = `/images/uploads/${safeFolder}/${fileName}`;
    return {
      imageUrl: publicPath,
      path: payload.content?.path ?? path,
      commitSha: payload.commit?.sha ?? '',
    };
  }

  async deleteImage(path: string, sha: string) {
    const token = process.env.GITHUB_TOKEN;
    const repository = process.env.GITHUB_REPOSITORY ?? 'gcmdev12/gcm_website';
    const branch = process.env.GITHUB_BRANCH ?? 'main';
    if (!token) throw new InternalServerErrorException('Image storage is not configured on the server.');
    if (!path || !path.startsWith('public/images/uploads/')) throw new BadRequestException('Only uploaded website images can be deleted.');
    let revisionSha = sha;
    if (!revisionSha) {
      const lookup = await fetch(`https://api.github.com/repos/${repository}/contents/${path}?ref=${branch}`, { headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'glory-children-ministry-backend' } });
      const lookupPayload = await lookup.json() as { sha?: string; message?: string };
      if (!lookup.ok || !lookupPayload.sha) throw new BadRequestException(lookupPayload.message || 'Could not find the uploaded image on GitHub.');
      revisionSha = lookupPayload.sha;
    }
    const response = await fetch(`https://api.github.com/repos/${repository}/contents/${path}`, {
      method: 'DELETE',
      headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json', 'User-Agent': 'glory-children-ministry-backend' },
      body: JSON.stringify({ message: `Delete uploaded website image: ${path.split('/').pop()}`, revisionSha, branch }),
    });
    const payload = await response.json() as { message?: string; commit?: { sha?: string } };
    if (!response.ok) throw new InternalServerErrorException(payload.message || 'GitHub image deletion failed.');
    return { deleted: true, commitSha: payload.commit?.sha ?? '' };
  }
}
