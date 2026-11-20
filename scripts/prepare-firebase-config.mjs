import { existsSync, writeFileSync } from 'node:fs';

const configPath = new URL('../firebase-applet-config.json', import.meta.url);

if (process.env.FIREBASE_WEB_CONFIG) {
  const config = JSON.parse(process.env.FIREBASE_WEB_CONFIG);
  const fields = [
    'apiKey', 'authDomain', 'projectId', 'appId', 'storageBucket',
    'messagingSenderId', 'measurementId', 'databaseURL', 'firestoreDatabaseId',
  ];
  for (const field of ['apiKey', 'authDomain', 'projectId', 'appId']) {
    if (typeof config?.[field] !== 'string' || !config[field].trim()) {
      throw new Error(`FIREBASE_WEB_CONFIG is missing the Firebase web app setting "${field}".`);
    }
  }
  const webConfig = Object.fromEntries(
    fields.filter((field) => typeof config[field] === 'string').map((field) => [field, config[field]]),
  );
  writeFileSync(configPath, JSON.stringify(webConfig, null, 2) + '\n');
} else if (!existsSync(configPath)) {
  throw new Error('Set FIREBASE_WEB_CONFIG to the original Firebase web app JSON or supply firebase-applet-config.json at the project root.');
}
