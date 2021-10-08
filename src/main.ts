import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const options = new DocumentBuilder()
        .setTitle('AsystentOS')
        .setDescription('The API description')
        .setVersion('1.0')
        .addTag('AsystentOS')
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('explorer', app, document);

    await app.listen(+process.env.PORT || 3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
