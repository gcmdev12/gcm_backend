import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { AuthUser } from './auth.types';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context).getContext<{ req: { headers: Record<string, string | string[] | undefined>; user?: AuthUser } }>();
    const header = ctx.req?.headers?.['authorization'];
    const token = typeof header === 'string' && header.startsWith('Bearer ')
      ? header.slice(7)
      : undefined;

    if (!token) throw new UnauthorizedException('Authentication required');

    try {
      ctx.req.user = this.jwt.verify<AuthUser>(token);
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
