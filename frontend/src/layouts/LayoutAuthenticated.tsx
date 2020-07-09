import React from 'react'
import { Link } from "react-router-dom"
import MenuBar from '../components/shared/MenuBar'
import Footer from '../components/shared/Footer';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, AppBar, Toolbar } from '@material-ui/core/';
import BlockIcon from '@material-ui/icons/Block';
import LabelImportantIcon from '@material-ui/icons/LabelImportant';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import "./layoutAuthenticated.scss"

interface InputProps {
    children?: any
    auth?: any
    title?: string
}

const LayoutAuthenticated = (props: InputProps) => {


    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <div className="drawer-container">
            <AppBar position="fixed">
                <Toolbar>
                    <Link className="clickable-icon" to={'/dashboard'}>
                        <img className="logo" alt="logo" src={require("../images/wealth-holdings-logo-white.svg")} />
                    </Link>
                </Toolbar>
            </AppBar>
            <List>
                <ListItem button component={Link} to="/dashboard">
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button component={Link} to="/active-pipeline">
                    <ListItemIcon><LabelImportantIcon /></ListItemIcon>
                    <ListItemText primary="Active Pipeline" />
                </ListItem>
                <ListItem button component={Link} to="/action-log">
                    <ListItemIcon><FormatListBulletedIcon /></ListItemIcon>
                    <ListItemText primary="Action Log" />
                </ListItem>
                <ListItem button component={Link} to="/completed-instances">
                    <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                    <ListItemText primary="Completed Instances" />
                </ListItem>
                <ListItem button component={Link} to="/closed-instances">
                    <ListItemIcon><BlockIcon /></ListItemIcon>
                    <ListItemText primary="Closed Instances" />
                </ListItem>
            </List>
            {/* <Divider /> */}
        </div>

    )

    return (
        <>
            <MenuBar auth={props.auth} />
            <div className="root">
                {/* <Drawer
                    className="left-drawer"
                    variant="permanent"
                    classes={{
                        paper: "drawer-paper",
                    }}
                >
                    {drawer}
                </Drawer> */}
                <Drawer
                    variant="temporary"
                    className="mobile-drawer"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    classes={{
                        paper: "drawer-paper",
                    }}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    classes={{
                        paper: "drawer-paper",
                    }}
                    variant="permanent"
                    className="desktop-drawer"
                    open
                >
                    {drawer}
                </Drawer>
                <main>
                    <div className="header-bar">
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                        >
                            <MenuIcon />
                        </IconButton>
                        <span>{props.title}</span>
                    </div>
                    <div className="full-height-content">
                        {props.children}
                    </div>
                    <Footer />
                </main>

            </div>
        </>
    )
}

export default LayoutAuthenticated