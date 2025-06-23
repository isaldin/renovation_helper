import 'reflect-metadata';
import './register-paths';

import Fastify from 'fastify';
import { app } from './app/app';
// import * as fs from 'node:fs';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

// Instantiate Fastify with some config
const server = Fastify({
  logger: true,
  // @todo: prod: use only for development
  // https: {
  //   key: fs.readFileSync('./backend-api/cert/localhost-key.pem'),
  //   cert: fs.readFileSync('./backend-api/cert/localhost.pem'),
  // },
});

// Register your application as a normal plugin.
server.register(app);

// Start listening.
server.listen({ port, host }, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  } else {
    console.log(`[ ready ] http://${host}:${port}`);
  }
});
