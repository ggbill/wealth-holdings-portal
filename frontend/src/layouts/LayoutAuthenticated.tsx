import React from 'react'
import { Link } from "react-router-dom"
import MenuBar from '../components/shared/MenuBar'
import Footer from '../components/shared/Footer';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, AppBar, Toolbar, Divider } from '@material-ui/core/';
import BlockIcon from '@material-ui/icons/Block';
import LabelImportantIcon from '@material-ui/icons/LabelImportant';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import SettingsIcon from '@material-ui/icons/Settings';
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
                    <Link className="clickable-icon" to={'/marriage-bureau/dashboard'}>
                        <img className="logo" alt="logo" src={require("../images/wealth-holdings-logo-white.svg")} />
                    </Link>
                </Toolbar>
            </AppBar>
            <List>
                <ListItem button component={Link} to="/marriage-bureau/dashboard">
                    <ListItemText className="bold" primary="Marriage Bureau" />
                </ListItem>
                <ListItem button component={Link} to="/marriage-bureau/dashboard">
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button component={Link} to="/marriage-bureau/active-pipeline">
                    <ListItemIcon><LabelImportantIcon /></ListItemIcon>
                    <ListItemText primary="Pipeline" />
                </ListItem>
                <ListItem button component={Link} to="/marriage-bureau/action-log">
                    <ListItemIcon><FormatListBulletedIcon /></ListItemIcon>
                    <ListItemText primary="Action Log" />
                </ListItem>
                <ListItem button component={Link} to="/marriage-bureau/completed-instances">
                    <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                    <ListItemText primary="Completed Deals" />
                </ListItem>
                <ListItem button component={Link} to="/marriage-bureau/closed-instances">
                    <ListItemIcon><BlockIcon /></ListItemIcon>
                    <ListItemText primary="Aborted Deals" />
                </ListItem>
                <Divider />
                <ListItem button component={Link} to="/buyer-onboarding/dashboard">
                    <ListItemText className="bold" primary="Buyer Onboarding" />
                </ListItem>
                <ListItem button component={Link} to="/buyer-onboarding/dashboard">
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button component={Link} to="/buyer-onboarding/active-pipeline">
                    <ListItemIcon><LabelImportantIcon /></ListItemIcon>
                    <ListItemText primary="Pipeline" />
                </ListItem>
                <ListItem button component={Link} to="/buyer-onboarding/action-log">
                    <ListItemIcon><FormatListBulletedIcon /></ListItemIcon>
                    <ListItemText primary="Action Log" />
                </ListItem>
                <ListItem button component={Link} to="/buyer-onboarding/closed-instances">
                    <ListItemIcon><BlockIcon /></ListItemIcon>
                    <ListItemText primary="Closed Instances" />
                </ListItem>
                <Divider />
                <ListItem button component={Link} to="/seller-onboarding/dashboard">
                    <ListItemText className="bold" primary="Seller Onboarding" />
                </ListItem>
                <ListItem button component={Link} to="/seller-onboarding/dashboard">
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button component={Link} to="/seller-onboarding/active-pipeline">
                    <ListItemIcon><LabelImportantIcon /></ListItemIcon>
                    <ListItemText primary="Pipeline" />
                </ListItem>
                <ListItem button component={Link} to="/seller-onboarding/action-log">
                    <ListItemIcon><FormatListBulletedIcon /></ListItemIcon>
                    <ListItemText primary="Action Log" />
                </ListItem>
                <ListItem button component={Link} to="/seller-onboarding/closed-instances">
                    <ListItemIcon><BlockIcon /></ListItemIcon>
                    <ListItemText primary="Closed Instances" />
                </ListItem>
                <Divider />
                <ListItem button component={Link} to="/settings">
                    <ListItemIcon><SettingsIcon /></ListItemIcon>
                    <ListItemText primary="Settings" />
                </ListItem>
            </List>

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