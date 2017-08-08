import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import mongoose from 'mongoose'
import Conversion from '../models/conversion.model'

const should = chai.should()
const expect = chai.expect

chai.use(chaiAsPromised)

describe('CONVERSION MODEL UNIT TESTS'.title,() => {

  let conversion
  let rawConversion =  {
    name: 'The Mythical Man Month',
    type: 'pdf'
  }
  let date = Date.now()

  beforeEach((done) => {
    conversion = new Conversion(rawConversion)
    done()
  })

	afterEach(() => Conversion.remove().exec())

  describe('Method Save'.subtitle, () => {
    it('should begin with no conversions'.it, () => {
      return Conversion.find({}).exec()
      .then((result) => { result.should.have.lengthOf(0) })
      .catch((err) => { throw err })
    })

    it('should be able to save without problems'.it, () => {
      return conversion.save()
      .then((result) => {
        expect(result).to.not.be.undefined
        return Conversion.findById(result.id).exec().should.eventually.have.property('name', rawConversion.name)
      })
      .catch((err) => { throw err })
    })
  })

  describe('Default checks'.subsubtitle, () => {
    const tenMin = 600000

    it('should save conversion with created value default to now if not specified'.it, () => {
      return conversion.save()
      .then((result) => {
        expect(result).to.not.be.undefined
        return Conversion.findById(result.id).exec()
        .then((result) => {
          let created = result.created
          expect(created > date-tenMin && created < date+tenMin).to.be.true
        })
      })
      .catch((err) => { throw err })
    })

    it('should save conversion with state value default to \'In Queue\' if not specified'.it, () => {
      return conversion.save()
      .then((result) => {
        expect(result).to.not.be.undefined
        return Conversion.findById(result.id).exec().should.eventually.have.property('state', 'In Queue')
      })
      .catch((err) => { throw err })
    })
  })

  describe('Enum checks'.subsubtitle, () => {

    it('should fail to save conversion with type value different than pdf or html'.it, () => {
      conversion.type = 'other'

      expect(conversion.save()).to.be.rejectedWith('Conversion validation failed')
      .then((err) => {
        expect(err.name).to.equal('ValidationError')
      })
      .catch((err) => { throw err })
    })

    it('should fail to save conversion with state value different than In Queue, Processing or Processed'.it, () => {
      conversion.state= 'other'

      expect(conversion.save()).to.be.rejectedWith('Conversion validation failed')
      .then((err) => {
        expect(err.name).to.equal('ValidationError')
      })
      .catch((err) => { throw err })
    })
  })

  describe('Required checks'.subsubtitle, () => {

    it('should fail to save a conversion without a name'.it, () => {
      conversion.name = undefined

      expect(conversion.save()).to.be.rejectedWith('Conversion validation failed')
      .then((err) => {
        expect(err.name).to.equal('ValidationError')
      })
      .catch((err) => { throw err })
    })
  })
})
