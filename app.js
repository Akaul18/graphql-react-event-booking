const express = require('express')
const bodyParser = require('body-parser')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')
const startDb = require('./db')
const Event = require('./models/event')

const PORT = process.env.PORT || 4000
const app = express()

const events = []
app.use(bodyParser.json())
app.use(
    '/graphql',
    graphqlHTTP({
        schema: buildSchema(`

            type Event {
                _id: ID!
                title: String!
                desc: String
                price: Float!
                date: String!
            }

            input EventInput {
                title: String!
                desc: String
                price: Float!
                date: String!
            }

            type RootQuery {
                events: [Event!]!
            }

            type RootMutation {
                createEvent(eventInput:  EventInput): Event
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `), //will point to graphql schema
        rootValue: {
            events: () => {
                return events
            },
            createEvent: (args) => {
                const event = {
                    _id: Math.random().toString().toString,
                    title: args.eventInput.title,
                    desc: args.eventInput.desc,
                    price: +args.eventInput.price,
                    date: args.eventInput.date,
                    // date: new Date().toISOString(),
                }
                events.push(event)
                return event
            },
        }, // all resolvers. resolvers have same name as the schema
        graphiql: true,
    })
)
startDb().once('open', () => {
    app.listen(PORT, () => console.log(`Server running on ${PORT}`))
})
