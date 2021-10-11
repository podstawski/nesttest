import { Inject, Injectable, Optional } from '@nestjs/common';
import { Model } from 'src/common/base-model';
import {SendmailService, VERIFICATION_DOCUMENT} from "../common/sendmail.service";
import {UserModel} from "./user.model";
import {UserTokenModel} from "./user-token.model";

@Injectable()
export class UserService {
    private user: UserModel;
    private userToken: UserTokenModel;
    constructor (
        private sendMail: SendmailService,
        @Inject('USER_MODEL') private UserModel: Model<UserModel>,
        @Inject('USER_TOKEN_MODEL') private UserTokenModel: Model<UserTokenModel>
        ) {
            this.user=new UserModel();
            this.userToken=new UserTokenModel();
        }


    async sendVerificationEmail(email:string): Promise <object> {

        email=email.toLowerCase().trim();

        const filter = {where:{email}};
        let user=await this.user.findOne(filter);
        if (!user) {
            user=await this.user.create(filter.where);
        }

        const userToken=await this.userToken.create({
            userId: user.id,
            pin: Date.now().toString().substr(-6)
        });


        userToken.user = user;
        this.sendMail.send(email,VERIFICATION_DOCUMENT,userToken);


        return {
            email,
            user: user.id,
            result:'check your mailbox'
        };
    }
}
