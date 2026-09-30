import { BadRequestException, Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { MediaService } from './media.service';
import { AuthUser } from '../auth/auth.types';

@Controller('admin/media')
export class MediaController {
  constructor(private readonly media: MediaService, private readonly jwt: JwtService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  async upload(@UploadedFile() file: any, @Req() req: Request) {
    const header = req.headers.authorization;
    const token = typeof header === 'string' && header.startsWith('Bearer ') ? header.slice(7) : undefined;
    if (!token) throw new BadRequestException('Authentication required.');

    let user: AuthUser;
    try {
      user = this.jwt.verify<AuthUser>(token);
    } catch {
      throw new BadRequestException('Invalid or expired admin session.');
    }
    if (!user?.sub || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      throw new BadRequestException('Administrator access required.');
    }

    const folder = typeof req.body?.folder === 'string' ? req.body.folder : 'uploads';
    return this.media.uploadImage(file, folder);
  }
}
