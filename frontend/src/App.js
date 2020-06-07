import React from 'react'
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

function App() {
    return (
        <Router>
            <Switch>
                <Redirect from="/" to="/auth" exact />
                <Route path="/auth" component={AuthPage} />
                <Route path="/events" component={Events} />
                <Route path="/bookings" component={Bookings} />
            </Switch>
        </Router>
    )
}

export default App
