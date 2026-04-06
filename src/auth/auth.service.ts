import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
import { User, UserDocument } from 'src/schemas/user.schema';
import { TokenService } from 'src/token/token.service';
import { AuthDto, ResetPasswordDto, VerifyDto } from './dto/auth.dto';
import bcrypt from 'bcrypt'
import { randomBytes } from 'crypto';
import { ForgotPassword, ForgotPasswordDocument } from 'src/schemas/forgot-password.schema';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(ForgotPassword.name) private forgotPasswordModel: Model<ForgotPasswordDocument>,
        private tokenService: TokenService,
        private mailService: MailService,
    ) { }

    async register(body: AuthDto) {
        const alreadyExists = await this.userModel.findOne({ email: body.email })
        if (alreadyExists) {
            throw new BadRequestException('User already registered')
        }
        const code = Math.floor(100000 + Math.random() * 900000)
        const hashed = await bcrypt.hash(body.password, 10)
        await this.userModel.create({
            email: body.email,
            password: hashed,
            isVerified: false,
            verificationCode: code
        })
        await this.mailService.sendVerificationCode(body.email, code)
        return { message: 'Verification code is send to your email' }
    }

    async verify(body: VerifyDto) {
        const user = await this.userModel.findOne({ email: body.email })
        if (!user) throw new NotFoundException('User not found')
        if (user.verificationCode !== body.verificationCode) {
            throw new BadRequestException('Wrong verification code')
        }
        user.isVerified = true
        user.verificationCode = ""
        await user.save()
        return this.generateTokens(user)
    }

    async login(body: AuthDto) {
        const user = await this.userModel.findOne({ email: body.email })
        if (!user) throw new NotFoundException('User not found')
        if (!user.isVerified) throw new BadRequestException('You are not verified')
        const passwordTrue = await bcrypt.compare(body.password, user.password)
        if (!passwordTrue) throw new BadRequestException('Wrong password')
        return this.generateTokens(user)
    }

    async logout(refreshToken: string) {
        return this.tokenService.removeToken(refreshToken)
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) throw new UnauthorizedException()
        const payload = this.tokenService.validateRefreshToken(refreshToken)
        const tokenDb = await this.tokenService.findToken(refreshToken)
        if (!payload || !tokenDb) throw new UnauthorizedException()
        const user = await this.userModel.findById(payload.id)
        return this.generateTokens(user)
    }

    async resetLink(email: string) {
        const user = await this.userModel.findOne({ email })
        if (!user) throw new NotFoundException('User not found')
        const token = randomBytes(16).toString('hex')
        await this.forgotPasswordModel.create({ userId: user._id, token })
        await this.mailService.sendResetToken(email, token)
        return { message: 'Password reset link is sent to your email' }
    }

    async resetPassword(body: ResetPasswordDto) {
        const record = await this.forgotPasswordModel.findOne({ token: body.token })
        const hashed = await bcrypt.hash(body.password, 10)
        await this.userModel.findByIdAndUpdate(record?.userId, {
            password: hashed
        })
        await this.forgotPasswordModel.findByIdAndDelete({ _id: record?._id })
        return { message: 'Your password is reset successfully' }
    }

    private async generateTokens(user: any) {
        const payload = { id: user._id }
        const tokens = this.tokenService.generateToken(payload)
        await this.tokenService.saveToken(user._id, tokens.refreshToken)
        return { user, ...tokens }
    }
}
