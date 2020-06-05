const express = require('express')
const bodyParser = require('body-parser')
const graphqlHTTP = require('express-graphql')
const startDb = require('./db')

const graphqlSchema = require('./graphql/schema')
const graphqlResolvers = require('./graphql/resolvers')

const PORT = process.env.PORT || 4000
const app = express()

app.use(bodyParser.json())
app.use(
    '/graphql',
    graphqlHTTP({
        schema: graphqlSchema, //will point to graphql schema
        rootValue: graphqlResolvers, // all resolvers. resolvers have same name as the schema
        graphiql: true,
    })
)
startDb().once('open', () => {
    app.listen(PORT, () => console.log(`Server running on ${PORT}`))
})
