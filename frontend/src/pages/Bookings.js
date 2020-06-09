import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/auth-context'
import Spinner from '../components/Spinner/Spinner'

const Bookings = () => {
    const context = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(false)
    const [bookings, setBookings] = useState([])

    useEffect(() => {
        fetchBookings()
    }, [])

    const fetchBookings = () => {
        setIsLoading(true)
        let requestBody = {
            query: `
                    query {
                        bookings {
                            _id
                            createdAt
                            event {
                                _id
                                title
                                date
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
                const allBookings = resData.data.bookings
                setBookings(allBookings)
                setIsLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setIsLoading(false)
            })
    }

    return (
        <React.Fragment>
            {isLoading ? (
                <Spinner />
            ) : (
                <ul>
                    {bookings.map((booking) => (
                        <li key={booking._id}>
                            {booking.event.title} -{' '}
                            {new Date(booking.createdAt).toLocaleDateString()}
                        </li>
                    ))}
                </ul>
            )}
        </React.Fragment>
    )
}

export default Bookings
