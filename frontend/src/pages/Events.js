import React, { useState } from 'react'
import './Events.css'
import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop'

const Events = () => {
    const [creating, setCreating] = useState(false)

    const startCreateEventHandler = () => {
        setCreating(true)
    }

    const modalCancelHandler = () => {
        setCreating(false)
    }

    const modalConfirmHandler = () => {
        setCreating(false)
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
                </Modal>
            )}
            <div className="events-control">
                <p>Share your own Events!</p>
                <button className="btn" onClick={startCreateEventHandler}>
                    Create Event
                </button>
            </div>
        </React.Fragment>
    )
}

export default Events
