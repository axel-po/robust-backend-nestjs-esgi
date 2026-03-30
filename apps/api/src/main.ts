import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import swaggerUi from 'swagger-ui-express';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const swaggerPath = join(process.cwd(), 'swagger.json');
  if (existsSync(swaggerPath)) {
    const swaggerDocument = JSON.parse(
      readFileSync(swaggerPath, 'utf-8'),
    ) as swaggerUi.JsonObject;
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  await app.listen(process.env.PORT ?? 8080);
}
void bootstrap();
