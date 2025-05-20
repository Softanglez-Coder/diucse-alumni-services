import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Get('login')
  @UseGuards(AuthGuard('auth0'))
  login() {
    // Initiates the Auth0 login process
    // The AuthGuard will redirect to Auth0's login page
  }

  @Get('callback')
  @UseGuards(AuthGuard('auth0'))
  callback(@Req() req, @Res() res) {
    const user = req.user;
    res.redirect(`/profile?user=${JSON.stringify(user)}`);
  }
}
