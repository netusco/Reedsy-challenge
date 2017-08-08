import Conversion from '../models/conversion.model'


// getting all conversions from db
export function getAll (req, res, next) {
  
  Conversion.find().exec()
    .then((conversions) => {
      res.status(200).json(conversions);
    })
    .catch((err) => res.status(400).send('Error retrieving conversions'))
}


// create a conversion and adds a convert job to the queue
export function convert(req, res, next) {

  if(!req.body.type) return res.status(400).send('Error no file type given to convert')
  const type = req.body.type.toUpperCase() || false;
  const conversionLength = (type === 'PDF') ? 100000 : 10000; 

  let conversion = new Conversion({
    name: type,
    type: type.toLowerCase()
  })

  // saving conversion to db
  return conversion.save()
    .then((conversion) => {
      return Conversion.find().exec()
        .then((conversions) => {
          // @TODO: adding convert file job to queue
          res.status(200).json(conversions);
        })
        .catch((err) => res.status(400).send('Error retrieving conversions'))
    })
    .catch((err) => res.status(400).send('Error saving the conversion to db'))
}


export default { 
  getAll,
  convert
}

