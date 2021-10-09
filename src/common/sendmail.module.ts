import { DynamicModule, Module } from '@nestjs/common';
import { SendmailService, SENDMAIL_CONFIG_TOKEN } from "./sendmail.service";
import { HttpModule } from '@nestjs/axios';


export type SendmailModuleOptions = {
    app?: string;
    name?: string;
    noReply?: boolean;
};

@Module({})
export class SendmailModule {
    static forRoot(options: SendmailModuleOptions): DynamicModule {
        const providers = [
            {
                provide: SENDMAIL_CONFIG_TOKEN,
                useValue: options,
            },
        ];
        return {
            global:true,
            module: SendmailModule,
            providers: providers,
            exports: providers
        };
    }
    static forFeature(): DynamicModule {
        const providers = [
            SendmailService
        ];
        return {
            imports: [HttpModule.register({
                timeout: 60000,
                maxRedirects: 5,
            })],
            module: SendmailModule,
            providers: providers,
            exports: providers
        };
    }


}