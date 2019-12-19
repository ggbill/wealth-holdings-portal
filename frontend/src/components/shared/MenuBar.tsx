import React, { useState, useEffect } from 'react'
import { AppBar, Toolbar, Button, Menu, MenuItem, Drawer } from '@material-ui/core'
import LinkButton from './LinkButton'
import { ReactComponent as LightningSVG } from '../../images/lightning-logo.svg'
import { Link } from 'react-router-dom'
import "../../App.scss"
import PersonIcon from '@material-ui/icons/Person'
import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'

interface InputProps {
    auth: any
}

const MenuBar = (props: InputProps) => {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [isShadow, setIsShadow] = useState(false)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const toggleDrawer = (open: boolean) => event => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setIsDrawerOpen(open);
    };


    const handleScroll = () => {
        if (window.pageYOffset > 20) {
            setIsShadow(true)
        } else {
            setIsShadow(false)
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', () => handleScroll);
        };
    }, []);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setIsDrawerOpen(false);
    };

    const logOut = () => {
        setAnchorEl(null);
        props.auth.logout();
    }

    const { isAuthenticated } = props.auth;
    return (
        <>
            <div className="menu-bar">
                <AppBar className={isShadow ? 'shadow' : 'no-shadow'}>
                    <Toolbar>
                        <Link className="clickable-icon" to={'/'}>
                            <LightningSVG className="logo" />
                        </Link>
                        <div className="menu-items">
                            <LinkButton className="link-button" to='/season-admin'>Seasons</LinkButton>
                            {isAuthenticated() &&
                                <LinkButton className="link-button" to='/teams'>Teams</LinkButton>
                            }
                            <LinkButton className="link-button" to='/players'>Players</LinkButton>
                            {isAuthenticated() &&
                                <Button className="clickable-icon" aria-controls="logout-menu" aria-haspopup="true" onClick={handleClick}>
                                    <PersonIcon />
                                </Button>
                            }
                        </div>

                        <Button className="clickable-icon hamburger-menu" aria-controls="simple-menu" aria-haspopup="true" onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </Button>
                    </Toolbar>
                </AppBar>
            </div>
            <Drawer
                anchor="top"
                open={isDrawerOpen}
                onClose={toggleDrawer(false)}
                className="menu-drawer"
            >
                <div className="close-icon-container">
                    <Button className="clickable-icon hamburger-menu" aria-controls="simple-menu" aria-haspopup="true" onClick={toggleDrawer(false)}>
                        <CloseIcon />
                    </Button>
                </div>
                <Link to='/season-admin' style={{ textDecoration: 'none', color: 'black' }}>
                    <MenuItem onClick={handleClose}>Seasons</MenuItem>
                </Link>
                {isAuthenticated() &&
                    <Link to='/teams' style={{ textDecoration: 'none', color: 'black' }}>
                        <MenuItem onClick={handleClose}>Teams</MenuItem>
                    </Link>
                }
                <Link to='/players' style={{ textDecoration: 'none', color: 'black' }}>
                    <MenuItem onClick={handleClose}>Players</MenuItem>
                </Link>
                {isAuthenticated() &&
                    <MenuItem onClick={logOut}>Log Out</MenuItem>
                }
            </Drawer>
            <Menu
                id="logout-menu"
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
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