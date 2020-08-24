import React, { useEffect, useState } from 'react'
import "./login.scss"
import { Card, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

interface InputProps {
    auth: any
}

const Login = (props) => {

    const { getProfile, isAuthenticated } = props.auth;
    const [authorisedUserProfile, setAuthorisedUserProfile] = useState<any>(null)
    const [isUnauthorised, setIsUnauthorised] = useState<boolean>(false)

    const login = () => {
        props.auth.login();
    }
    const logout = () => {
        props.auth.logout();
    }

    useEffect(() => {
        if (props.location.search.split('?')[1] === "unauthorised") {
            setIsUnauthorised(true)
        }
        if (isAuthenticated()) {
            getProfile((err, profile) => {
                if (err) {
                    console.log(err)
                }
                setAuthorisedUserProfile(profile)
            });
        }

    }, []);

    return (
        <div className="login flex-container">
            <Card className="login-card">
                <Card className="image-card">
                    <img className="logo" alt="logo" src={require("../../images/wealth-holdings-logo-colour.svg")} />
                </Card>

                <h2>Welcome to the Wealth Holdings Portal</h2>

                {!isAuthenticated() &&
                    <>
                        <span className="medium-text">Please log in by clicking the button below.</span>
                        <br />

                        <div className="button-wrapper">
                            {isUnauthorised && <span className="validation-text">You must be logged in to access the portal.</span>}
                            <Button variant="contained" className="admin-login" onClick={login}>Login</Button>
                        </div>

                    </>
                }
                {isAuthenticated() &&
                    <>
                        <span className="medium-text">You are currently logged in as <b>{authorisedUserProfile && authorisedUserProfile.name}</b></span>
                        <p className="small-text">Not you? <a onClick={logout} href="#">Click here to log out</a></p>
                        <span className="small-text">or</span>
                        <div className="button-wrapper">
                            <Button variant="contained" className="admin-login" component={Link} to={'/dashboard'}>View Dashboard</Button>
                        </div>

                    </>
                }
            </Card>
            <span className="small-text white">Please contact the site administrator or email <a href="mailto:enquiries@wealthholdings.co.uk">enquiries@wealthholdings.co.uk</a> if you require access to the portal.</span>
        </div>
    )
}

export default Login