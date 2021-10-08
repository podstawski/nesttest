import { DynamicModule, Module } from '@nestjs/common';
import { SendmailService } from "./sendmail.service";
import { HttpModule } from '@nestjs/axios';

export type SendmailModuleOptions = {
    app?: string;
    name?: string;
    noReply?: boolean;
};

export const SENDMAIL_CONFIG_TOKEN = 'SENDMAIL_CONFIG_TOKEN';


@Module({
    imports: [
        HttpModule
    ],
    controllers: [],
    providers: [SendmailService],
})
export class SendmailModule {
    static forRoot(options: SendmailModuleOptions): DynamicModule {
        return {
            module: SendmailModule,
            providers: [
                {
                    provide: SENDMAIL_CONFIG_TOKEN,
                    useValue: options,
                },
            ],
        };
    }

}