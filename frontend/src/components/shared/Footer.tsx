import React from "react"
import { Link } from 'react-router-dom'
import "./footer.scss"

const Footer = () => {

    return (
        <section className="footer-section">
            <div className="left-content">
            </div>
            <div className="middle-content">
                <Link className="clickable-icon" to={'/buyer-onboarding/dashboard'}>
                    <img className="logo" alt="logo" src={require("../../images/wealth-holdings-logo-white.svg")} />
                </Link>
            </div>
            <div className="right-content">

            </div>
        </section>
    )
}

export default Footer