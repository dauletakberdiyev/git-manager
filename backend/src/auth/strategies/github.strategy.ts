import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    config: ConfigService,
    private users: UsersService,
  ) {
    super({
      clientID: config.get<string>('GITHUB_CLIENT_ID') as string,
      clientSecret: config.get<string>('GITHUB_CLIENT_SECRET') as string,
      callbackURL: config.get<string>('GITHUB_CALLBACK_URL') as string,
      scope: ['user', 'repo'],
    });
  }

  async validate(
    accessToken: string,
    _refreshToken: string,
    profile: any,
  ): Promise<any> {
    return this.users.findOrCreate(
      String(profile.id),
      profile.username,
      accessToken,
    );
  }
}
