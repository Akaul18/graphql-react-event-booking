import React, { useState, useRef, useContext, useEffect } from 'react'
import './Events.css'
import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop'
import { AuthContext } from '../context/auth-context'
import EventList from '../components/Events/EventList/EventList'
import Spinner from '../components/Spinner/Spinner'

const Events = () => {
    const context = useContext(AuthContext)

    const [creating, setCreating] = useState(false)
    const [events, setEvents] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const isMountedRef = useRef(null)

    useEffect(() => {
        isMountedRef.current = true
        fetchEvents() // eslint-disable-next-line
        return () => {
            isMountedRef.current = false
        }
    }, [])

    const titleElRef = useRef('')
    const descElRef = useRef('')
    const priceElRef = useRef('')
    const dateElRef = useRef('')

    const startCreateEventHandler = () => {
        setCreating(true)
    }

    const modalCancelHandler = () => {
        setCreating(false)
        setSelectedEvent(null)
    }

    const showDetailHandler = (eventId) => {
        setSelectedEvent((prevState) => {
            return events.find((event) => event._id === eventId)
        })
    }

    const bookEventHandler = () => {
        if (!context.token) {
            setSelectedEvent(null)
            return
        }
        let requestBody = {
            query: `
                    mutation {
                        bookEvent(eventId:"${selectedEvent._id}") {
                            _id
                            createdAt
                            updatedAt
                        }
                    }
                `,
        }
        setIsLoading(true)
        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${context.token}`,
            },
        })
            .then((res) => {
                if (res.status !== 200) {
                    throw new Error('Failed')
                }
                return res.json()
            })
            .then((resData) => {
                console.log(resData)

                setSelectedEvent(null)
                setIsLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setIsLoading(false)
            })
    }

    const fetchEvents = () => {
        let requestBody = {
            query: `
                    query {
                        events {
                            _id
                            title
                            desc
                            price
                            date
                            creator{
                                _id
                            }
                        }
                    }
                `,
        }
        if (isMountedRef.current) {
            setIsLoading(true)
        }
        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => {
                if (res.status !== 200) {
                    throw new Error('Failed')
                }
                return res.json()
            })
            .then((resData) => {
                const newEvents = resData.data.events
                if (isMountedRef.current) {
                    setEvents(newEvents)
                    setIsLoading(false)
                }
            })
            .catch((err) => {
                console.log(err)
                if (isMountedRef.current) {
                    setIsLoading(false)
                }
            })
    }

    const modalConfirmHandler = () => {
        setCreating(false)
        const title = titleElRef.current.value
        const desc = descElRef.current.value
        const price = +priceElRef.current.value
        const date = dateElRef.current.value

        if (
            title.trim().length === 0 ||
            desc.trim().length === 0 ||
            price <= 0 ||
            date.trim().length === 0
        ) {
            return
        }

        // const event = { title, desc, price, date }
        let requestBody = {
            query: `
                    mutation {
                        createEvent(eventInput: {title:"${title}",desc:"${desc}",price:${price},date:"${date}"}) {
                            _id
                            title
                            desc
                            price
                            date
                            creator{
                                _id
                                email
                            }
                        }
                    }
                `,
        }
        setIsLoading(true)
        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${context.token}`,
            },
        })
            .then((res) => {
                if (res.status !== 200) {
                    throw new Error('Failed')
                }
                return res.json()
            })
            .then((resData) => {
                // console.log(resData.data)
                // fetchEvents()
                // console.log(events)

                setEvents((prevState) => {
                    const updatedEvents = [...prevState]
                    updatedEvents.push({
                        _id: resData.data.createEvent._id,
                        title: resData.data.createEvent.title,
                        desc: resData.data.createEvent.desc,
                        price: resData.data.createEvent.price,
                        date: resData.data.createEvent.date,
                        creator: {
                            _id: context.userId,
                        },
                    })
                    setIsLoading(false)
                    return updatedEvents
                })
            })
            .catch((err) => {
                console.log(err)

                setIsLoading(false)
            })
    }

    return (
        <React.Fragment>
            {(creating || selectedEvent) && <Backdrop />}
            {creating && (
                <Modal
                    title="Add Event"
                    canCancel
                    canConfirm
                    onCancel={modalCancelHandler}
                    onConfirm={modalConfirmHandler}
                    confirmText="Confirm"
                >
                    <p>Modal Content</p>
                    <form>
                        <div className="form-control">
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" ref={titleElRef} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="price">Price</label>
                            <input type="number" id="price" ref={priceElRef} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="date">Date</label>
                            <input
                                type="datetime-local"
                                id="date"
                                ref={dateElRef}
                            />
                        </div>
                        <div className="form-control">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                rows="4"
                                ref={descElRef}
                            />
                        </div>
                    </form>
                </Modal>
            )}
            {selectedEvent && (
                <Modal
                    title={selectedEvent.title}
                    canCancel
                    canConfirm
                    onCancel={modalCancelHandler}
                    onConfirm={bookEventHandler}
                    confirmText={context.token ? 'Book' : 'Confirm'}
                >
                    <p>Modal Content</p>
                    <h1>{selectedEvent.title}</h1>
                    <h2>
                        ${selectedEvent.price} -{' '}
                        {new Date(selectedEvent.date).toLocaleDateString()}
                    </h2>
                    <p>{selectedEvent.desc}</p>
                </Modal>
            )}
            {context.token && (
                <div className="events-control">
                    <p>Share your own Events!</p>
                    <button className="btn" onClick={startCreateEventHandler}>
                        Create Event
                    </button>
                </div>
            )}
            {isLoading ? (
                <Spinner />
            ) : (
                <EventList
                    authUserId={context.userId}
                    events={events}
                    onViewDetail={showDetailHandler}
                />
            )}
        </React.Fragment>
    )
}

export default Events
