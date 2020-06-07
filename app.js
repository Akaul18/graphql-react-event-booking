const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const graphqlHTTP = require('express-graphql')
const startDb = require('./db')
const isAuth = require('./middleware/isAuth')

const graphqlSchema = require('./graphql/schema')
const graphqlResolvers = require('./graphql/resolvers')

const PORT = process.env.PORT || 4000
const app = express()

app.use(cors())
app.use(bodyParser.json())
// app.use((req, res, next) => {
//     req.setHeaders('Allow-Control-Access-Origin', '*')
//     req.setHeaders('Allow-Control-Access-Methods', 'POST,GET,OPTIONS')
//     req.setHeaders(
//         'Allow-Control-Access-Headers',
//         'Content-Type: Authorization'
//     )
//     if (req.method === 'OPTIONS') {
//         return res.sendStatus(200)
//     }
//     next()
// })
app.use(isAuth)
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
