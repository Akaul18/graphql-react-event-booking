import React, { useState, useRef, useContext, useEffect } from 'react'
import './Events.css'
import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop'
import { AuthContext } from '../context/auth-context'

const Events = () => {
    const context = useContext(AuthContext)

    useEffect(() => {
        fetchEvents() // eslint-disable-next-line
    }, [])

    const [creating, setCreating] = useState(false)
    const [events, setEvents] = useState([])
    const titleElRef = useRef('')
    const descElRef = useRef('')
    const priceElRef = useRef('')
    const dateElRef = useRef('')

    const startCreateEventHandler = () => {
        setCreating(true)
    }

    const modalCancelHandler = () => {
        setCreating(false)
    }

    const eventList = events.map((event) => {
        return (
            <li key={event._id} className="events__list-item">
                {event.title}
            </li>
        )
    })

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
                                email
                            }
                        }
                    }
                `,
        }

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
                const events = resData.data.events
                setEvents(events)
            })
            .catch((err) => {
                console.log(err)
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

        const event = { title, desc, price, date }
        console.log(event)

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
                fetchEvents()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <React.Fragment>
            {creating && <Backdrop />}
            {creating && (
                <Modal
                    title="Add Event"
                    canCancel
                    canConfirm
                    onCancel={modalCancelHandler}
                    onConfirm={modalConfirmHandler}
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
            {context.token && (
                <div className="events-control">
                    <p>Share your own Events!</p>
                    <button className="btn" onClick={startCreateEventHandler}>
                        Create Event
                    </button>
                </div>
            )}
            <ul className="events__list">{eventList}</ul>
        </React.Fragment>
    )
}

export default Events
