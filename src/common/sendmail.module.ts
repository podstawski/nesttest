import { DynamicModule, Module } from '@nestjs/common';
import { SendmailService, SENDMAIL_CONFIG_TOKEN } from "./sendmail.service";
import { HttpModule } from '@nestjs/axios';


export type SendmailModuleOptions = {
    app?: string;
    name?: string;
    noReply?: boolean;
};

@Module({
    imports: [
        HttpModule.register({
            timeout: 60000,
            maxRedirects: 5,
        }),
        SendmailService
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