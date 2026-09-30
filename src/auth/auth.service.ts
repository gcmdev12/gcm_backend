import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordInput, LoginInput, UpdateProfileInput } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  async login(input: LoginInput) {
    const admin = await this.prisma.adminUser.findUnique({ where: { email: input.email.toLowerCase() } });
    if (!admin || !admin.isActive || !(await bcrypt.compare(input.password, admin.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.prisma.adminUser.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });
    const accessToken = await this.jwt.signAsync({ sub: admin.id, email: admin.email, role: admin.role });
    return { accessToken, admin };
  }

  profile(id: string) {
    return this.prisma.adminUser.findUniqueOrThrow({ where: { id } });
  }

  async updateProfile(id: string, input: UpdateProfileInput) {
    return this.prisma.adminUser.update({
      where: { id },
      data: {
        ...(input.firstName !== undefined ? { firstName: input.firstName } : {}),
        ...(input.lastName !== undefined ? { lastName: input.lastName } : {}),
        ...(input.email !== undefined ? { email: input.email.toLowerCase() } : {}),
      },
    });
  }

  async changePassword(id: string, input: ChangePasswordInput) {
    const admin = await this.prisma.adminUser.findUniqueOrThrow({ where: { id } });
    if (!(await bcrypt.compare(input.currentPassword, admin.passwordHash))) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    const passwordHash = await bcrypt.hash(input.newPassword, 12);
    await this.prisma.adminUser.update({ where: { id }, data: { passwordHash } });
    return true;
  }
}
