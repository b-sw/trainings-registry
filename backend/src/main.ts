import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import { AppModule } from './app.module';
import { envConfig } from './shared/env.config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log'],
    });
    app.enableCors({ origin: '*' });

    app.use(
        /^\/docs/,
        basicAuth({
            users: {
                [envConfig.swagger.username]: envConfig.swagger.password,
            },
            challenge: true,
            realm: 'API docs',
        }),
    );

    const config = new DocumentBuilder().addBearerAuth().setTitle('API docs').build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, documentFactory);

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }),
    );

    await app.init();
    await app.listen(envConfig.port);
}
bootstrap();
