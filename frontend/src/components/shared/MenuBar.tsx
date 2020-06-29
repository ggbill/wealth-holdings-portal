import React, { useState, useLayoutEffect, useEffect } from 'react'
import { AppBar, Toolbar, Button, Drawer, Menu, MenuItem } from '@material-ui/core'
import { Link } from 'react-router-dom'
import "./menuBar.scss"
import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

interface InputProps {
    auth: any
}

const MenuBar = (props: InputProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [scrollClass, setScrollClass] = useState("menu-bar no-shadow")
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [authorisedUserProfile, setAuthorisedUserProfile] = useState<any>(null)

    const { getProfile, isAuthenticated } = props.auth;

    const toggleDrawer = (open: boolean) => event => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setIsDrawerOpen(open);
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setIsDrawerOpen(false);
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
                console.log(profile)
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
                        <Link onClick={handleClick} className="authorised-email">
                            {authorisedUserProfile && authorisedUserProfile.name}
                            <Button className="clickable-icon" aria-controls="logout-menu" aria-haspopup="true">
                            <AccountCircleIcon />
                        </Button>
                        </Link>
                        
                    </div>
                    <Button className="clickable-icon hamburger-menu" aria-controls="simple-menu" aria-haspopup="true" onClick={toggleDrawer(true)}>
                        <MenuIcon />
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer
                anchor="top"
                open={isDrawerOpen}
                onClose={toggleDrawer(false)}
                className="menu-drawer"
            >
                <div className="close-icon-container">
                    <Button className="clickable-icon" aria-controls="simple-menu" aria-haspopup="true" onClick={toggleDrawer(false)}>
                        <CloseIcon />
                    </Button>
                </div>
                <Link to='/about' style={{ textDecoration: 'none', color: 'black' }}>
                    <MenuItem onClick={handleClose}>About</MenuItem>
                </Link>
                <div className="drawer-footer">
                    {/* <img className="logo" alt="logo" src={require("../../images/G-with-glow.png")} /> */}
                </div>
            </Drawer>
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