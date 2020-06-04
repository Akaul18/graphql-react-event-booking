const express = require('express')
const bodyParser = require('body-parser')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')
const bcrypt = require('bcryptjs')

const startDb = require('./db')
const Event = require('./models/event')
const User = require('./models/user')

const PORT = process.env.PORT || 4000
const app = express()

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

            type User {
                _id: ID!
                email: String!
                password: String
            }

            input UserInput {
                email: String!
                password: String!
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
                createUser(userInput: UserInput): User
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `), //will point to graphql schema
        rootValue: {
            events: () => {
                return Event.find()
                    .then((events) => {
                        return events.map((event) => {
                            return { ...event._doc }
                        })
                    })
                    .catch()
            },
            createUser: (args) => {
                return User.findOne({ email: args.userInput.email })
                    .then((user) => {
                        if (user) {
                            throw new Error('User exists already..!!')
                        }
                        return bcrypt.hash(args.userInput.password, 12)
                    })
                    .then((hashedPass) => {
                        const user = new User({
                            email: args.userInput.email,
                            password: hashedPass,
                        })
                        return user
                            .save()
                            .then((result) => {
                                return { ...result._doc, password: null }
                            })
                            .catch((err) => {
                                console.log(err)
                                throw err
                            })
                    })
            },
            createEvent: (args) => {
                const event = new Event({
                    title: args.eventInput.title,
                    desc: args.eventInput.desc,
                    price: +args.eventInput.price,
                    date: new Date(args.eventInput.date),
                    creator: '5ed8940ff6c4794ea7557353',
                })
                let createdEvent
                return event
                    .save()
                    .then((result) => {
                        createdEvent = { ...result._doc }
                        return User.findById('5ed8940ff6c4794ea7557353')
                    })
                    .then((user) => {
                        if (!user) {
                            throw new Error('User not found..!!')
                        }
                        user.createdEvents.push(event)
                        return user.save()
                    })
                    .then((result) => {
                        return createdEvent
                    })
                    .catch((err) => {
                        console.log(err)
                        throw err
                    })
            },
        }, // all resolvers. resolvers have same name as the schema
        graphiql: true,
    })
)
startDb().once('open', () => {
    app.listen(PORT, () => console.log(`Server running on ${PORT}`))
})
