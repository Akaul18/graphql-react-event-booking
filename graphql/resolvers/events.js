const Event = require('../../models/event')
const User = require('../../models/user')
const { transformedEvent } = require('./resolverHelper')

module.exports = {
    events: async () => {
        try {
            const allEvents = await Event.find()
            return allEvents.map((event) => {
                return transformedEvent(event)
            })
        } catch (err) {
            throw err
        }
    },
    createEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthorized')
        }
        const event = new Event({
            title: args.eventInput.title,
            desc: args.eventInput.desc,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: req.userId,
        })
        let createdEvent
        try {
            const result = await event.save()
            createdEvent = transformedEvent(result)
            const user = await User.findById(req.userId)
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
