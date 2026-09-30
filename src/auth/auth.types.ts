export interface AuthUser {
  sub: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
}
