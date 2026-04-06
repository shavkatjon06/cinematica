import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, ResetLinkDto, ResetPasswordDto, VerifyDto } from './dto/auth.dto';
import type { Request, Response } from 'express';
import setAuthCookie from 'src/utils/set-auth.cookie';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() dto: AuthDto) {
    return await this.authService.register(dto)
  }

  @Post('verify')
  async verify(@Body() dto: VerifyDto, @Res() res: Response) {
    const data = await this.authService.verify(dto)
    setAuthCookie(res, data.refreshToken)
    return res.json(data)
  }

  @Post('login')
  async login(@Body() dto: AuthDto, @Res() res: Response) {
    const data = await this.authService.login(dto)
    setAuthCookie(res, data.refreshToken)
    return res.json(data)
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    await this.authService.logout(req.cookies.refreshToken)
    res.clearCookie('refreshToken')
    return res.json({ message: 'ok' })
  }

  @Post('reset-link')
  async resetLink(@Body() body: ResetLinkDto, @Res() res: Response) {
    const data = await this.authService.resetLink(body.email)
    return res.json(data)
  }

  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto, @Res() res: Response) {
    const data = await this.authService.resetPassword(body)
    return res.json(data)
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const data = await this.authService.refresh(req.cookies.refreshToken)
    setAuthCookie(res, data.refreshToken)
    return res.json(data)
  }
}
