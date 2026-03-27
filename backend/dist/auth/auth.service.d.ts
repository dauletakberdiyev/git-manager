import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
export declare class AuthService {
    private jwtService;
    constructor(jwtService: JwtService);
    login(user: User): {
        token: string;
    };
}
