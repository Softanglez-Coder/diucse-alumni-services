import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-auth0';
import * as process from 'node:process';
import { UserService } from '../../user/user.service';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
  constructor(
    private readonly userService: UserService,
  ) {
    super({
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: process.env.AUTH0_CALLBACK_URL,
      state: false,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    extraParams: any,
    profile: any,
  ) {
    let user = await this.userService.findByAuth0Id(profile.id);

    if (user) {
      // Update user information
      user = await this.userService.update(user.id, {
        name: profile.displayName,
        email: profile.emails[0]?.value,
        picture: profile.photos[0]?.value,
      });
    } else {
      // Create a new user
      user = await this.userService.create({
        auth0Id: profile.id,
        name: profile.displayName,
        email: profile.emails[0]?.value,
        picture: profile.photos[0]?.value,
      });
    }

    return {
      user,
      accessToken,
      refreshToken,
      extraParams,
    };
  }
}
