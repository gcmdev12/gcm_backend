import {
  BadRequestException,
  Controller,
  Delete,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
  UnauthorizedException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { MediaService } from './media.service';
import { AuthUser } from '../auth/auth.types';


@Controller('admin/media')
export class MediaController {
  constructor(private readonly media: MediaService, private readonly jwt: JwtService) {}

  @Delete('image')
  async delete(@Req() req: Request) {
    const header = req.headers.authorization;
    const token =
      typeof header === 'string' && header.startsWith('Bearer ')
        ? header.slice(7)
        : undefined;

    if (!token) throw new UnauthorizedException('Authentication required.');

    let user: AuthUser;
    try {
      user = this.jwt.verify<AuthUser>(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired admin session.');
    }

    if (!user?.sub || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      throw new UnauthorizedException('Administrator access required.');
    }

    const path = typeof req.body?.path === 'string' ? req.body.path : '';
    const sha = typeof req.body?.sha === 'string' ? req.body.sha : '';

    return this.media.deleteImage(path, sha);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1,
      },
      fileFilter: (_req, file, callback) => {
        const allowed = new Set(['image/jpeg', 'image/jpg', 'image/png']);
        if (!allowed.has(file.mimetype.toLowerCase())) {
          return callback(new BadRequestException('Only JPG and PNG images are allowed.') as any, false);
        }
        callback(null, true);
      },
    }),
  )
  async upload(@UploadedFile() file: any, @Req() req: Request) {
    const header = req.headers.authorization;
    const token =
      typeof header === 'string' && header.startsWith('Bearer ')
        ? header.slice(7)
        : undefined;

    if (!token) throw new UnauthorizedException('Authentication required.');

    let user: AuthUser;
    try {
      user = this.jwt.verify<AuthUser>(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired admin session.');
    }

    if (!user?.sub || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      throw new UnauthorizedException('Administrator access required.');
    }

    if (!file) {
      throw new BadRequestException(
        'No image file was received. Please choose an image and try again.',
      );
    }

    const folder =
      typeof req.body?.folder === 'string' ? req.body.folder : 'uploads';

    return this.media.uploadImage(file, folder);
  }
}
