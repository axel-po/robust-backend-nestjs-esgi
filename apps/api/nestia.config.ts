import type { INestiaConfig } from '@nestia/sdk';

const config: INestiaConfig = {
  input: ['src/**/*.controller.ts'],
  swagger: {
    output: 'swagger.json',
    info: {
      title: 'Mentor ESGI API',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:8080' }],
    security: {
      bearer: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    beautify: true,
  },
};

export default config;
