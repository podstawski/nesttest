import { Controller, Get, Post, Body, Req, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from "express";
import { UserService } from './user.service';
import { ApiProperty } from '@nestjs/swagger'


export class LoginDto {
    @ApiProperty({ required: true })
    email: string;
}


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Post('login')
  async login(@Body() login: LoginDto): Promise<object> {
      if (!login || !login.email || !login.email.indexOf || login.email.indexOf('@')===-1)
          throw new HttpException('Wrong email format', HttpStatus.CONFLICT);
    return await this.userService.sendVerificationEmail(login.email);
  }
}
