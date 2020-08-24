import React, { useState, useLayoutEffect, useEffect } from 'react'
import { AppBar, Toolbar, Button, Menu, MenuItem } from '@material-ui/core'
import { Link } from 'react-router-dom'
import "./menuBar.scss"
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

interface InputProps {
    auth: any
}

const MenuBar = (props: InputProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [scrollClass, setScrollClass] = useState("menu-bar no-shadow")
    const [authorisedUserProfile, setAuthorisedUserProfile] = useState<any>(null)

    const { getProfile, isAuthenticated } = props.auth;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleScroll = () => {
        if (window.pageYOffset > 1) {
            setScrollClass("menu-bar shadow")
        } else {
            setScrollClass("menu-bar no-shadow")
        }
    };

    const logOut = () => {
        setAnchorEl(null);
        props.auth.logout();
    }

    useLayoutEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', () => handleScroll);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, []);

    useEffect(() => {
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
        <>
            <AppBar position="fixed" className={scrollClass}>
                <Toolbar>
                    <Link className="clickable-icon" to={'/dashboard'}>
                        <img className="logo" alt="logo" src={require("../../images/wealth-holdings-logo-white.svg")} />
                    </Link>
                    <div className="menu-items">
                        {/* <LinkButton className="link-button" to='/about'><AccountCircleIcon /></LinkButton> */}
                        <Link to='#' onClick={handleClick} className="authorised-email">
                            {authorisedUserProfile && <span className="username">{authorisedUserProfile.name}</span>}
                            <Button className="clickable-icon" aria-controls="logout-menu" aria-haspopup="true">
                            <AccountCircleIcon />
                        </Button>
                        </Link>
                    </div>
                </Toolbar>
            </AppBar>
            <Menu
                id="logout-menu"
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={logOut}>Log Out</MenuItem>
            </Menu>
        </>
    )
}

export default MenuBar