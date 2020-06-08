import React, { useState, Fragment } from 'react'
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch,
} from 'react-router-dom'
import './App.css'
import AuthPage from './pages/AuthPage'
import Bookings from './pages/Bookings'
import Events from './pages/Events'
import Navigation from './components/Navigation/Navigation'
import { AuthContext } from './context/auth-context'

function App() {
    const [token, setToken] = useState(null)
    const [userId, setUserId] = useState(null)
    const login = (token, userId) => {
        setToken(token)
        setUserId(userId)
    }

    const logout = () => {
        setToken(null)
        setUserId(null)
    }

    return (
        <Router>
            <Fragment>
                <AuthContext.Provider
                    value={{
                        token: token,
                        userId: userId,
                        login: login,
                        logout: logout,
                    }}
                >
                    <Navigation />
                    <main className="main-content">
                        <Switch>
                            {/* {!token && (
                                <Redirect from="/events" to="/auth" exact />
                            )} */}
                            {!token && (
                                <Redirect from="/bookings" to="/auth" exact />
                            )}
                            {token && <Redirect from="/" to="/events" exact />}
                            {token && (
                                <Redirect from="/auth" to="/events" exact />
                            )}
                            {!token && (
                                <Route path="/auth" component={AuthPage} />
                            )}
                            <Route path="/events" component={Events} />
                            {token && (
                                <Route path="/bookings" component={Bookings} />
                            )}
                            {!token && <Redirect to="/auth" exact />}
                        </Switch>
                    </main>
                </AuthContext.Provider>
            </Fragment>
        </Router>
    )
}

export default App
