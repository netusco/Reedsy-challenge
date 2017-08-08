import mongoose from 'mongoose'

// Conversion schema
let ConversionSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: 'Name cannot be blank'
    },
    type: {
        type: String,
        required: 'Type cannot be blank',
        enum: ['pdf', 'html']
    },
    state: {
        type: String,
        default: 'In Queue',
        enum: ['In Queue', 'Processing', 'Processed']
    }
});

module.exports = mongoose.model('Conversion', ConversionSchema);
