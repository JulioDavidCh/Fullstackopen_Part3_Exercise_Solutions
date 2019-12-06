const express = require('express')
const app = express()

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

//   app.get('/', (req, res) => {
//     res.send('<h1>Hello World!</h1>')
//   })
  
//   app.get('/notes', (req, res) => {
//     res.json(notes)
//   })

//   app.get('/notes/:id', (request, response) => {
//     const id = Number(request.params.id)
//     const note = notes.find(note => note.id === id)

//     if (note) {
//       response.json(note)
//     } else {
//       response.status(404).end()
//     }
//   })

//   app.delete('/notes/:id', (request, response) => {
//     const id = Number(request.params.id)
//     notes = notes.filter(note => note.id !== id)
  
//     response.status(204).end()
//   })

// const generateId = () => {
//   const maxId = notes.length > 0
//     ? Math.max(...notes.map(n => n.id))
//     : 0
//   return maxId + 1
// }

// app.post('/notes', (request, response) => {
//   const body = request.body

//   if (!body.content) {
//     return response.status(400).json({ 
//       error: 'content missing' 
//     })
//   }

//   const note = {
//     content: body.content,
//     important: body.important || false,
//     date: new Date(),
//     id: generateId(),
//   }

//   notes = notes.concat(note)

//   response.json(note)
// })
  
  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })