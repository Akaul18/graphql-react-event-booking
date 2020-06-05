const bcrypt = require('bcryptjs')
const Event = require('../../models/event')
const User = require('../../models/user')

const events = async (eventIds) => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } })
        // .then((events) => {
        return events.map((event) => {
            return {
                ...event._doc,
                date: new Date(event._doc.date).toISOString(),
                creator: () => users(event.creator),
            }
        })
    } catch (err) {
        throw err
    }
}

const users = async (userId) => {
    try {
        const users = await User.findOne(userId)
        // .then((user) => {
        return {
            ...users._doc,
            createdEvents: () => events(users.createdEvents),
        }
    } catch (err) {
        throw err
    }
}

module.exports = {
    events: async () => {
        try {
            const allEvents = await Event.find()
            return allEvents.map((event) => {
                return {
                    ...event._doc,
                    date: new Date(event._doc.date).toISOString(),
                    creator: () => users(event._doc.creator),
                }
            })
        } catch (err) {
            throw err
        }
    },
    createUser: async (args) => {
        try {
            const existingUser = await User.findOne({
                email: args.userInput.email,
            })
            if (existingUser) {
                throw new Error('User exists already..!!')
            }
            const hashedPassword = await bcrypt.hash(
                args.userInput.password,
                12
            )
            const newUser = new User({
                email: args.userInput.email,
                password: hashedPassword,
            })
            const result = await newUser.save()

            return { ...result._doc, password: null }
        } catch (err) {
            console.log(err)
            throw err
        }
    },
    createEvent: async (args) => {
        const event = new Event({
            title: args.eventInput.title,
            desc: args.eventInput.desc,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '5ed9752a1ff6ab583baf0b0e',
        })
        let createdEvent
        try {
            const result = await event.save()
            createdEvent = {
                ...result._doc,
                date: new Date(result._doc.date).toISOString(),
                creator: () => users(result._doc.creator),
            }
            const user = await User.findById('5ed9752a1ff6ab583baf0b0e')
            if (!user) {
                throw new Error('User not found..!!')
            }
            user.createdEvents.push(event)
            await user.save()
            return createdEvent
        } catch (err) {
            throw err
        }
    },
}
