import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { verify } from 'argon2';
import { Response } from 'express'
import { getDOMAIN } from 'src/config/app.config';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
    EXPIRE_DAY_REFRESH_TOKEN = 1
    REFRESH_TOKEN_NAME = 'refreshToken'

    constructor(
        private jwt: JwtService,
        private userService:  UserService,
        private configService: ConfigService
    ) {}

    async login(dto: AuthDto) {
        const { password, ...user } = await this._validateUser(dto)
        const tokens = this._issueTokens(user.id)

        return { 
            user,
            ...tokens
        }
    }

    async register(dto: AuthDto) {
        const oldUser = await this.userService.getByEmail(dto.email);
        if (oldUser) throw new BadRequestException('User already exists')

        const { password, ...user } = await this.userService.create(dto)
        const tokens = this._issueTokens(user.id)

        return { 
            user,
            ...tokens
        }
    }


    private _issueTokens(userId:string){
        const data = {id: userId}

        const accessToken = this.jwt.sign(data, {
            expiresIn: '1h'
        })

        const refreshToken = this.jwt.sign(data, {
            expiresIn: '7d'
        })

        return {accessToken, refreshToken}
    }

    private async _validateUser(dto: AuthDto) {
        const user = await this.userService.getByEmail(dto.email)

        if (!user) throw new NotFoundException('User not found')

        const isValid = await verify(user.password, dto.password)

        if (!isValid) throw new UnauthorizedException("Invalid password")

        return user
    }

    async addRefreshTokenToResponse(res: Response, refreshToken: string) { 
        const expiresIn = new Date()
        expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

        const domain = await getDOMAIN(this.configService) || "localhost"

        res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
            httpOnly: true,
            domain: domain,
            expires: expiresIn,
            secure: true,   
            sameSite: 'none' // 'lax' for prod
        })
    }

    async removeRefreshTokenFromResponse(res: Response){

        const domain = await getDOMAIN(this.configService) || "localhost"

        res.cookie(this.REFRESH_TOKEN_NAME, '', {
            httpOnly: true,
            domain: domain,
            expires: new Date(0),
            secure: true,
            sameSite: 'none' // 'lax' for prod
        })
    }

    async getNewTokens(refreshToken: string) {
        const result = await this.jwt.verifyAsync(refreshToken)
        if (!result) throw new UnauthorizedException('Invalid refresh token')

        const getUser = await this.userService.getById(result.id)
        if (!getUser) throw new UnauthorizedException('no user')
            
        const { password, ...user } = getUser

        const tokens = this._issueTokens(user.id)
        return {
            user,
            ...tokens
        }
    }
}
