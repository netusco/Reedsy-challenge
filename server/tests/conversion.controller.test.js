import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiAsPromised from 'chai-as-promised'
import mongoose from 'mongoose'
import Conversion from '../models/conversion.model'
import config from '../../config/env'

const should = chai.should()
const expect = chai.expect

chai.use(chaiAsPromised)
chai.use(chaiHttp)
const agent = chai.request.agent('http://localhost:' + config.port)

describe('CONVERSION CONTROLLER INTEGRATION TESTS'.title,() => {

  let conversion
  let conversion2
  let rawConversion =  {
    name: 'The Mythical Man Month',
    type: 'pdf'
  }
  let rawConversion2 = {
    name: 'The Mythical Man Month',
    type: 'html'
  }
  let date = Date.now()

  beforeEach(() => {
    conversion = new Conversion(rawConversion)
    conversion2 = new Conversion(rawConversion2)
    return conversion.save()
    .then(() => conversion2.save())
    .catch((err) => { throw err })
  })

	afterEach(() => Conversion.remove().exec())

  describe('Api calls'.subtitle, () => {
    it('should return a list of conversions on GET /api/conversions call'.it, () => {
      return agent
        .get('/api/conversions')
        .then((res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array').to.have.length.of.at.least(2)
        })
        .catch((err) => { throw err })
    })

    it('should return a list of conversions on POST /api/conversion call'.it, () => {
      return agent
        .post('/api/conversion')
        .send({ type: 'pdf' })
        .then((res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array').to.have.length.of.at.least(3)
        })
        .catch((err) => { throw err })
    })

    it('should fail to return a list of conversions on POST /api/conversion call if type does not validate'.it, () => {
      return agent
        .post('/api/conversion')
        .send({ type: 'whatever' })
        .then((res) => { throw Error('should fail to return a list of conversions on POST /api/conversion call if type does not validate') })
        .catch((err) => {
          expect(err).to.have.status(400)
          expect(err.response.text).to.equal('Error saving the conversion to db')
        })
    })

    it('should fail to return a list of conversions on POST /api/conversion call if type is falsy'.it, () => {
      return agent
        .post('/api/conversion')
        .send({ type: undefined })
        .then((res) => { throw Error('should fail to return a list of conversions on POST /api/conversion call if type does not validate') })
        .catch((err) => {
          expect(err).to.have.status(400)
          expect(err.response.text).to.equal('Error no file type given to convert')
        })
    })

    // @TODO: add tests to verify the queue
  })
})
