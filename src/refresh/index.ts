import log from 'loglevel';
import { IncomingMessage, ServerResponse } from 'http';
import { MongoClient } from 'mongodb';
import got from 'got';
import { getConfig } from '../shared/config';
import { connect } from '../shared/mongodb';
import { allRepositories } from './mongodb';
import { getRepositoriesState } from '../shared/repositories';
import { callIftttWebhook } from '../shared/ifttt';

log.enableAll();

export default async function(_req: IncomingMessage, res: ServerResponse) {
  const config = getConfig();
  const mongoClient = await connect(
    MongoClient,
    config.mongoDbUri,
  );
  log.info('Reading all repositories from MongoDB');
  const repositories = await allRepositories(mongoClient);
  const overallState = getRepositoriesState(repositories);
  log.info(`Calling IFTTT webhook with "${overallState}" state`);
  const hookResponse = await callIftttWebhook(overallState, config, got);
  log.info(hookResponse);
  mongoClient.close();
  res.statusCode = 204;
  res.end();
}
