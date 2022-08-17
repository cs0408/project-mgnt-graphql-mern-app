const express = require('express')
const colors = require('colors')
const cors = require('cors')
require('dotenv').config()
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema/schema')
const connectDB = require('./config/db')

const port = process.env.PORT || 5000
const app = express()

// Connect to DB
connectDB()

app.use(cors())

// Use GraphQL endPoint
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'developement', // used in development only
  })
)

app.listen(port, console.log(`Server running at: http://localhost:${port}`))
