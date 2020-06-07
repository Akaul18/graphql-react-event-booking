import React from 'react'
import './Navigation.css'
import { NavLink } from 'react-router-dom'

const Navigation = (props) => {
    return (
        <header className="main-navigation">
            <div className="main-navigation__logo">
                <h1>Event Shop</h1>
            </div>
            <nav className="main-navigation__items">
                <ul>
                    <li>
                        <NavLink to="/auth">Login</NavLink>
                    </li>
                    <li>
                        <NavLink to="/events">Events</NavLink>
                    </li>
                    <li>
                        <NavLink to="/bookings">Bookings</NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Navigation