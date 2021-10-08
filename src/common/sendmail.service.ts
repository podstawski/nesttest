import { Injectable, Inject } from '@nestjs/common';
import {extend} from 'lodash';
import {HttpService} from '@nestjs/axios';
import {SENDMAIL_CONFIG_TOKEN, SendmailModuleOptions} from './sendmail.module'


@Injectable()
export class SendmailService {
    constructor (
        private httpService: HttpService,
        @Inject(SENDMAIL_CONFIG_TOKEN) private sendmailOptions: SendmailModuleOptions
    ) {}

    private data2qs(obj,dest,prefix) {
        if (!prefix)
            prefix='';
        else
            prefix+='.';

        for (let k in obj) {
            if (k==='app')
                continue;
            if (typeof obj[k]==='object' && obj[k]!==null)
                this.data2qs(obj[k],dest,prefix+k);
            else if (obj[k]!==null)
                dest.push(encodeURIComponent(prefix+k)+'='+encodeURIComponent(obj[k])) ;

        }
    }



    private clone(obj:object) {
        return JSON.parse(JSON.stringify(obj));
    }

    async send(to: string, doc: string, data:object): Promise<object> {
        const queryString=[];
        const formData = extend({},this.clone(data),{to, doc});
        delete formData.app;

        this.data2qs(formData,queryString,undefined);

        return this.httpService.post(this.sendmailOptions.app,queryString.join('&')).toPromise();
    }
}

export const VERIFICATION_DOCUMENT = '134PBD6jBtJlexDX8lvzW4ZIGyimbpni2dG3p0viSG4Q';