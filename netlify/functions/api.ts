import serverless from 'serverless-http';
import { createApi } from '../../api.ts';

const api = serverless(createApi());
const functionPrefix = '/.netlify/functions/api';

export function handler(event: { path: string; requestPath?: string }, context: object) {
  const path = event.requestPath || event.path;
  const route = path.startsWith(functionPrefix + '/')
    ? '/api' + path.slice(functionPrefix.length)
    : path;
  return api({ ...event, path: route, requestPath: route }, context);
}
