import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { SendmailModule} from "./common/sendmail.module";
import { SendmailService} from "./common/sendmail.service";
import { ServeStaticModule } from '@nestjs/serve-static';
import { CloudDatastoreModule } from "./common/cloud-datastore.module";
import { HttpModule } from '@nestjs/axios';
import { join } from 'path';

@Module({
  imports: [
      ServeStaticModule.forRoot({
          rootPath: join(__dirname, '..', 'public'),
      }),

      CloudDatastoreModule.forRoot({
          keyFile: join(__dirname, '..', 'config','asystentos-f3c8a2d93711.json'),
          projectId: 'asystentos',
          namespace: process.env.NODE_ENV || 'stage'
      }),

      HttpModule.register({
          timeout: 60000,
          maxRedirects: 5,
      }),

      UserModule,
      SendmailModule
  ],
  controllers: [],
  providers: [
      {
          provide: 'SENDMAIL_OPTIONS',
          useValue: {
              app: 'https://script.google.com/macros/s/AKfycbzXGiEq6zD2yF6WqQh0ug4fm2D6I8nc97usO6BL7Nmz7FT20XSLHY03T1mwqNuBVRDXVw/exec',
              name: 'AsystentOS',
              noReply: false,
          },
      }
  ],
})
export class AppModule {}
