const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI

console.log('connection to database ...', url)

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true  })
    .then(result =>{
        console.log('connected to MongoDB')
    })
    .catch(error =>{
        console.log('connection error to MongoDB', error)
})

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) =>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('PersonNumber', personSchema)