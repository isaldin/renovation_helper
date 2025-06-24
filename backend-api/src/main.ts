import 'reflect-metadata';
import './register-paths';

import Fastify, { FastifyHttpsOptions, FastifyHttpOptions } from 'fastify';
import { app } from './app/app';
import { initContainer } from './app/di/initContainer';
import * as fs from 'node:fs';
import * as http from 'node:http';
import * as https from 'node:https';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const useHttps = process.env.BACKEND_HTTPS === 'true';

// Instantiate Fastify with some config
const fastifyOptions: FastifyHttpsOptions<https.Server> | FastifyHttpOptions<http.Server> = {
  logger: true,
};

if (process.env.NODE_ENV === 'development' && useHttps) {
  (fastifyOptions as FastifyHttpsOptions<https.Server>).https = {
    key: fs.readFileSync('./backend-api/cert/localhost-key.pem'),
    cert: fs.readFileSync('./backend-api/cert/localhost.pem'),
  };
}

const server = Fastify(fastifyOptions);

// Register your application as a normal plugin.
server.register(app);

initContainer();

// Start listening.
server.listen({ port, host }, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  } else {
    console.log(`[ ready ] http${useHttps ? 's' : ''}://${host}:${port}`);
  }
});
