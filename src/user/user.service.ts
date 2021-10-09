import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'src/common/base-model';
import {CloudDatastoreService} from "../common/cloud-datastore.service";
import {SendmailService, VERIFICATION_DOCUMENT} from "../common/sendmail.service";
import {UserModel} from "./user.model";

@Injectable()
export class UserService {
    constructor (
        private readonly dbService: CloudDatastoreService,
        private sendMail: SendmailService,
        @Inject('USER_MODEL') private UserModel: Model<UserModel>
        ) {
            const newUser = new UserModel();
            const result = newUser.find().then((res)=>{
                console.log(res);
            });
        }


    async sendVerificationEmail(email:string): Promise <object> {

        email=email.toLowerCase().trim();

        const filter = {where:{email}};
        let user=await this.dbService.findOne('User',filter);
        if (!user) {
            user=await this.dbService.create('User',filter.where);
        }
        
        user.pin=Date.now().toString().substr(-4);
        await this.dbService.update('User',{id:user.id},user);

        this.sendMail.send(email,VERIFICATION_DOCUMENT,{pin:user.pin});

        return {
            email,
            result:'check your mailbox'
        };
    }
}
