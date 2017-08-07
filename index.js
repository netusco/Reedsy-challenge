import Promise from 'bluebird';
import mongoose from 'mongoose';
import config from './config/env';
import app from './config/express';

Promise.promisifyAll(mongoose);

mongoose.connect(config.db, {
  useMongoClient: true
});

mongoose.connection.on('error', () => {
  throw new Error(`Unable to connect to database: ${config.db}`);
});

app.listen(config.port, () => {
  // Logging initialization
  console.log('\n_________________________________________________________________________________________\n')
  console.log(`\t🚀  REEDSY CHALLENGE APP STARTED\n`)
  console.log(`\tEnvironment:\t\t ${config.env}`)
  console.log(`\tListening on port:\t ${config.port}`)
  console.log(`\tDatabase:\t\t ${config.db}`)
  console.log('\n_________________________________________________________________________________________\n')
});

export default app;
