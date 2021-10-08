import { Controller, Get, Post, Body, Req } from '@nestjs/common';
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
    return await this.userService.sendVerificationEmail(login.email);
  }
}
