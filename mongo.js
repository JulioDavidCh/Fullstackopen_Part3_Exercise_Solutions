const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
    console.log('give password as argument')
    process.exit(1)
}

const name = process.argv[3]
const number = process.argv[4]

const password = process.argv[2]

const url =`mongodb+srv://fullstack:${password}@cluster0-yyab4.mongodb.net/Phonebook-3-12?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const noteSchema = new mongoose.Schema({
    name: String,
    number: String,
})
  
const Person = mongoose.model('PersonNumber', noteSchema)

console.log(process.argv)

if(process.argv.length === 3){
    Person.find({}).then(Phonebook =>{
        const message = Phonebook.reduce((acummulator, nextVal) =>
        `${acummulator} \n ${nextVal.name} ${nextVal.number}`
        ,"")
        console.log(message)
        mongoose.connection.close()
        process.exit(1)
    })
}

const person = new Person({
    name: name,
    number: number,
})

person.save().then(response =>{
    console.log(`added ${name} number: ${number} to phonebook`)
    mongoose.connection.close()
    process.exit(1)
})