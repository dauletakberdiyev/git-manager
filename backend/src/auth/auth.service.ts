import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login(user: User): { token: string } {
    const payload = { sub: user.id, username: user.username };
    return { token: this.jwtService.sign(payload) };
  }
}
