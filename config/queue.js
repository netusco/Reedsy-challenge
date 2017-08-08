import Agenda from 'agenda';
import { convertFile } from '../server/controllers/conversion.controller';

let globalAgenda;

export const addToQueue = (jobType, attrs) => {

  // creating job instance
  let job = globalAgenda.create(jobType, attrs);

  // saving job to db
  job.save(function(err) {
    if(err) console.log('Error saving a job type ' + jobType, err);
  });
}


export default (db) => {

  let agenda = new Agenda({db: {address: db, collection: 'queue'}});

  agenda.on('ready', () => {
    console.log('Queue system ready to work');
    agenda.maxConcurrency(3);
    agenda.start();
    globalAgenda = agenda;
  });

  agenda.on('error', (err) => {
    console.log('Error on agenda', err);
  });

  agenda.on('start', (job) => {
    console.log('Job %s starting', job.attrs.data._id);
  });

  agenda.on('success', (job) => {
    console.log('Job %s finished', job.attrs.data._id);
  });

  agenda.on('fail', (err) => {
    console.log('Job failed', err);
  });

  agenda.define('convert pdf file', { priority: 'low' }, (job, done) => {
    let data = job.attrs.data;

    convertFile('pdf', data, (err) => {
      if(err) return done(err);
      return done();
    });
  });

  agenda.define('convert html file', { priority: 'high' }, (job, done) => {
    let data = job.attrs.data;

    convertFile('html', data, (err) => {
      if(err) return done(err);
      return done();
    });
  });

  function graceful() {
    console.log('Unlocking queue jobs and closing gracefully');
    agenda.stop(function() {
      process.exit(0);
    });
  }

  process.on('SIGTERM', graceful);
  process.on('SIGINT' , graceful);

  return agenda;
}
