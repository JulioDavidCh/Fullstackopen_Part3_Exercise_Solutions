const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

let persons =   [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
]

app.get('/api/persons/:id', (req, res) =>{
  const id = Number(req.params.id)
  const phoneNumber = persons.find(personData => personData.id === id)

  if(phoneNumber){
    return res.json(phoneNumber)
  }
  res.status(404).end()
})

app.get('/api/persons', (req, res) =>{
  res.json(persons) 
})

app.get('/info', (req, res) =>{
  res.send(`
  <div>
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${(new Date()).toString()}</p>
  </div>
  `)
})

app.delete('/api/persons/:id', (req, res) =>{
  const id = Number(req.params.id)

  persons = persons.filter(entry => entry.id !== id)
  
  res.status(204).end()
})

const generateId = () =>{
  const randomNumber = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  return randomNumber
}

app.post('/api/persons', (req, res) =>{
  const body = req.body

  if(!body.number){
    //if request was sent without a number
    return res.status(400).json({error: "phone number is mandatory, add one to your request"})
  }else if(persons.find(entry => entry.name === body.name)){
    //if name already exists in our phonebook
    return res.status(400).json({error: 'name must be unique'})
  }else if(!body.name){
    //if request was sent without a name
    return res.status(400).json({error: "name is mandatory, add one to your request"})
  }

  const id = generateId()

  const newNumber = {
    name: body.name,
    number: body.number,
    id: id
  }

  persons = [...persons, newNumber]

  res.json(newNumber)
})
  
  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })