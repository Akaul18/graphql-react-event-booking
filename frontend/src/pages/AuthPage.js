import React, { useState, useRef, useContext } from 'react'
import './AuthPage.css'
import { AuthContext } from '../context/auth-context'

const AuthPage = () => {
    const context = useContext(AuthContext)
    const [isLoginbtnText, setIsLoginBtnText] = useState(false)
    const emailEl = useRef('')
    const passwordEl = useRef('')

    const submitHandler = (e) => {
        e.preventDefault()
        const email = emailEl.current.value
        const password = passwordEl.current.value

        if (email.trim().length === 0 || password.trim().length === 0) {
            return
        }

        let requestBody

        if (!isLoginbtnText) {
            requestBody = {
                query: `
                    query {
                        login(email:"${email}",password:"${password}") {
                            userId
                            token
                            tokenExpiration
                        }
                    }
                `,
            }
        } else {
            requestBody = {
                query: `
                    mutation {
                        createUser(userInput: {email:"${email}",password:"${password}"}) {
                            _id
                            email
                        }
                    }
                `,
            }
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
                // console.log(resData.data)
                if (resData.data.login.token) {
                    context.login(
                        resData.data.login.token,
                        resData.data.login.userId,
                        resData.data.login.tokenExpiration
                    )
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const switchModeHandler = () => {
        setIsLoginBtnText((prevState) => !prevState)
    }

    return (
        <form className="auth-form" onSubmit={submitHandler}>
            <div className="form-control">
                <label htmlFor="email">E-Mail</label>
                <input type="email" id="email" ref={emailEl} />
            </div>
            <div className="form-control">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" ref={passwordEl} />
            </div>
            <div className="form-actions">
                <button type="submit">Submit</button>
                <button type="button" onClick={switchModeHandler}>
                    Switch to {!isLoginbtnText ? 'Signup' : 'Login'}
                </button>
            </div>
        </form>
    )
}

export default AuthPage
