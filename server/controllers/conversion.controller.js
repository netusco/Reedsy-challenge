import Conversion from '../models/conversion.model';
import { updateConversionList } from '../../config/socket';
import { addToQueue } from '../../config/queue';


// getting all conversions from db
export function getAll (req, res, next) {
  
  Conversion.find().exec()
    .then((conversions) => {
      res.status(200).json(conversions);
    })
    .catch((err) => res.status(400).send('Error retrieving conversions'));
}


// create a conversion and adds a convert job to the queue
export function convert(req, res, next) {

  const type = req.body.type.toUpperCase() || false;
  if(!type) return res.status(400).json( { message: 'No file type given to convert' });

  const conversionLength = (type === 'PDF') ? 100000 : 10000; 

  let conversion = new Conversion({
    name: req.body.name,
    type: type.toLowerCase()
  });

  // saving conversion to db
  return conversion.save()
    .then((conversion) => {
      return Conversion.find().exec()
        .then((conversions) => {
          // adding convert file job to queue
          addToQueue('convert ' + req.body.type + ' file', conversion.toObject());
          res.status(200).json(conversions);
        })
        .catch((err) => res.status(400).send('Error retrieving conversions'));
    })
    .catch((err) => res.status(400).send('Error saving the conversion to db'))
}


// logic to convert files
export function convertFile(type, conversionObj, cb) {

  const fileType = type.toUpperCase() || false;
  const conversionLength = (fileType === 'PDF') ? 100000 : 10000; 
  let conversion = Conversion.hydrate(conversionObj);

  if(!fileType || !conversion) return cb(new Error('Missing params to convertFile'));

  // change the state of the conversion
  conversion.state = 'Processing';
  return conversion.save()
    .then((conversion) => {
      // socket signal to refresh the list of conversions on the browser page
      updateConversionList(conversion);

      // fake timeout as conversion (10s for html / 100s for pdf)
      // @TODO implement real conversion
      setTimeout(() => { 
        // change the state of the conversion
        conversion.state = 'Processed';
        return conversion.save()
          .then((conversion) => {
            // socket signal to refresh the list of conversions on the browser page
            updateConversionList(conversion);
            return cb();
          });
      }, conversionLength);
    })
    .catch((err) => cb(err))
}


export default { 
  getAll,
  convert,
  convertFile,
}
