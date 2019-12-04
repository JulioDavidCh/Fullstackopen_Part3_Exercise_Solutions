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

app.get('/info', (req, res) =>{
  res.send(
    `<div>
      <p>Welcome to the phonebook database! these are the end points:</p>
      <p>/api/persons</p>
      <p>/api/persons/:id where ":id" is a the id of the person's id</p>
    </div>`)
})

app.get('/api/persons/:id', (req, res, next) =>{
  const id = req.params.id

  PersonNumber.findById(id)
  .then(phoneNumber =>{
    if(phoneNumber){
      return res.json(phoneNumber)
    }else{
      return res.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.get('/api/persons', (req, res, next) =>{
  PersonNumber.find({})
    .then(phoneBook =>{
      res.json(phoneBook.map(phoneNumber => phoneNumber.toJSON()))
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) =>{
  const id = req.params.id
  const body = req.body

  const personReplace = {
    name: body.name,
    number: body.number
  }

  PersonNumber.findByIdAndUpdate(id, personReplace, { new: true })
    .then(updatedPerson =>{
      res.json(updatedPerson.toJSON).end()
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) =>{
  const id = req.params.id
  PersonNumber.findByIdAndDelete(id)
  .then(response =>{
    res.status(204).end()
  })
  .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) =>{
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
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) =>{
  console.log(error.message)

  if(error.name === 'CastError' && error.kind === 'ObjectId'){
    return res.status(400).send({error: 'malformatted id'})
  }

  next(error)
}

app.use(errorHandler)
  
const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})