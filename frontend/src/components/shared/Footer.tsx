import React from "react"
import { ReactComponent as LightningSVG } from '../../images/lightning-logo.svg'
import { Link } from 'react-router-dom'
import "../../App.scss"

interface InputProps {
    auth: any
}

const Footer = (props: InputProps) => {

    const { isAuthenticated } = props.auth;

    const login = () => {
        props.auth.login();
    }
    const logout = () => {
        props.auth.logout();
    }

    return (
        <section className="footer-section">
            <div className="left-content">
                {!isAuthenticated() &&
                    <span className="admin-login" onClick={login}>Admin Login</span>
                }
                {isAuthenticated() &&
                    <span className="admin-login" onClick={logout}>Admin Log Out</span>
                }
            </div>
            <div className="middle-content">
                <Link to={'/'}>
                    <LightningSVG className="logo" />
                </Link>

            </div>
            <div className="right-content">
                <p>Created by <a href="https://www.goinggone.io">Going Gone Technology Services</a>.</p>
            </div>
        </section>
    )
}

export default Footer