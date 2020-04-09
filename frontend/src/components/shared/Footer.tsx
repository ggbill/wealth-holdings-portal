import React from "react"
import { Link } from 'react-router-dom'
import "./footer.scss"

const Footer = () => {

    return (
        <section className="footer-section">
            <div className="left-content">
                Email: <a href="mailto:thanos.gidaropoulos@tta.org.uk">thanos.gidaropoulos@tta.org.uk</a>
            </div>
            <div className="middle-content">
                <Link to={'/'}>
                    <img className="logo" alt="logo" src={require("../../images/G-with-glow.png")} />
                </Link>

            </div>
            <div className="right-content">

            </div>
        </section>
    )
}

export default Footer