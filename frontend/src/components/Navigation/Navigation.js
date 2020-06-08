import React, { useContext } from 'react'
import './Navigation.css'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../context/auth-context'

const Navigation = (props) => {
    const context = useContext(AuthContext)
    return (
        <header className="main-navigation">
            <div className="main-navigation__logo">
                <h1>Event Shop</h1>
            </div>
            <nav className="main-navigation__items">
                <ul>
                    {!context.token && (
                        <li>
                            <NavLink to="/auth">Login</NavLink>
                        </li>
                    )}

                    <li>
                        <NavLink to="/events">Events</NavLink>
                    </li>
                    {context.token && (
                        <React.Fragment>
                            <li>
                                <NavLink to="/bookings">Bookings</NavLink>
                            </li>
                            <li>
                                <button onClick={context.logout}>Logout</button>
                            </li>
                        </React.Fragment>
                    )}
                </ul>
            </nav>
        </header>
    )
}

export default Navigation
