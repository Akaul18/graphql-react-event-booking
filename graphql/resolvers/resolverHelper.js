const Event = require('../../models/event')
const User = require('../../models/user')
const { dateToString } = require('../../helpers/date')

const events = async (eventIds) => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } })
        // .then((events) => {
        return events.map((event) => {
            return transformedEvent(event)
        })
    } catch (err) {
        throw err
    }
}

const singleEvent = async (eventId) => {
    try {
        const event = await Event.findOne({ _id: eventId })
        return transformedEvent(event)
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

const transformBooking = (event) => {
    return {
        ...event._doc,
        user: () => users(event._doc.user),
        event: () => singleEvent(event._doc.event),
        createdAt: dateToString(event._doc.createdAt),
        updatedAt: dateToString(event._doc.updatedAt),
    }
}
const transformedEvent = (event) => {
    return {
        ...event._doc,
        date: dateToString(event._doc.date),
        creator: () => users(event.creator),
    }
}

// exports.user = user
// exports.events = events
// exports.singleEvent = singleEvent
exports.transformBooking = transformBooking
exports.transformedEvent = transformedEvent
