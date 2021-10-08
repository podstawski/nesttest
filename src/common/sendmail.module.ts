import { Module } from '@nestjs/common';
import { SendmailService } from "./sendmail.service";
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        HttpModule
    ],
    controllers: [],
    providers: [SendmailService],
})
export class SendmailModule {}