require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const PersonNumber = require('./models/PersonNumber')

app.use(cors())

app.use(express.static('build'))

app.use(bodyParser.json())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.body(req,res)
  ].join(' ')
}))


//       ----------------ROUTES----------------

// app.get('/api/persons/:id', (req, res) =>{
//   const id = Number(req.params.id)
//   const phoneNumber = persons.find(personData => personData.id === id)

//   if(phoneNumber){
//     return res.json(phoneNumber)
//   }
//   res.status(404).end()
// })

app.get('/api/persons', (req, res) =>{
  PersonNumber.find({})
    .then(phoneBook =>{
      res.json(phoneBook.map(phoneNumber => phoneNumber.toJSON()))
    })
})

app.delete('/api/persons/:id', (req, res) =>{
  const id = req.params.id
  PersonNumber.findByIdAndDelete(id)
  .then(response =>{
    res.status(204).end()
  })
  .catch(error=>{
    res.json({error: error})
  })
})

app.post('/api/persons', (req, res) =>{
  const body = req.body

  if(!body.number){
    //if request was sent without a number
    return res.status(400).json({error: "phone number is mandatory, add one to your request"})
  }else if(!body.name){
    //if request was sent without a name
    return res.status(400).json({error: "name is mandatory, add one to your request"})
  }

  const newNumber = new PersonNumber({
    name: body.name,
    number: body.number
  })

  newNumber.save()
    .then(savedNumber =>{
      res.json(savedNumber.toJSON())
    })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

  
const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})