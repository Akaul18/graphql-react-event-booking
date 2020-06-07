import React, { Fragment } from 'react'
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

function App() {
    return (
        <Router>
            <Fragment>
                <Navigation />
                <main className="main-content">
                    <Switch>
                        <Redirect from="/" to="/auth" exact />
                        <Route path="/auth" component={AuthPage} />
                        <Route path="/events" component={Events} />
                        <Route path="/bookings" component={Bookings} />
                    </Switch>
                </main>
            </Fragment>
        </Router>
    )
}

export default App
