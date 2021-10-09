import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CloudDatastoreModule } from "../common/cloud-datastore.module";
import { SendmailModule } from "../common/sendmail.module";
import { CloudDatastoreService } from 'src/common/cloud-datastore.service';
import { UserModel } from './user.model';

@Module({
  imports: [
    CloudDatastoreModule,
    SendmailModule.forFeature()
  ],
  controllers: [UserController],
  providers: [UserService, {
    provide: 'USER_MODEL',
    useFactory: (cloudDatastoreService: CloudDatastoreService) => {
      UserModel.cloudDatastoreService = cloudDatastoreService;
      return UserModel;
    },
    inject: [CloudDatastoreService]
  }],
})
export class UserModule { }
