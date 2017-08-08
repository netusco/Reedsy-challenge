import http from 'http';
import Promise from 'bluebird';
import mongoose from 'mongoose';
import config from './config/env';
import app from './config/express';
import loadQueue from './config/queue';
import initSocketIO from './config/socket';
import Conversion from './server/models/conversion.model';

const server = http.createServer(app);

Promise.promisifyAll(mongoose);

mongoose.connect(config.db, { useMongoClient: true })
.then(() => {
  // emptying db from conversions
  Conversion.remove({}, (err) => {
    if(err) console.log('Error while emptying Conversion collection on db');
    console.log('Removed any pre-existent Conversions on db');
  })

    // initiating the queue system
    let agenda = loadQueue(config.db);
    // socket.io setup
    initSocketIO(server, agenda);
});

mongoose.connection.on('error', () => {
  throw new Error(`Unable to connect to database: ${config.db}`);
});

server.listen(config.port, () => {
  // Logging initialization
  console.log('\n_________________________________________________________________________________________\n');
  console.log(`\t🚀  REEDSY CHALLENGE APP STARTED\n`);
  console.log(`\tEnvironment:\t\t ${config.env}`);
  console.log(`\tListening on port:\t ${config.port}`);
  console.log(`\tDatabase:\t\t ${config.db}`);
  console.log('\n_________________________________________________________________________________________\n');
});

export default app;
