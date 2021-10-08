import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CloudDatastoreModule } from "../common/cloud-datastore.module";
import { SendmailModule } from "../common/sendmail.module";

@Module({
  imports: [
      CloudDatastoreModule,
      SendmailModule
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
