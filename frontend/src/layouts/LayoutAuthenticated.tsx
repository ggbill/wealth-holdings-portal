import React from 'react'
import {Link } from "react-router-dom"
import MenuBar from '../components/shared/MenuBar'
import Footer from '../components/shared/Footer';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core/';
import BlockIcon from '@material-ui/icons/Block';
import LabelImportantIcon from '@material-ui/icons/LabelImportant';
import HomeIcon from '@material-ui/icons/Home';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import "./layoutAuthenticated.scss"

interface InputProps {
    children?: any
    auth?: any
}

const LayoutAuthenticated = (props: InputProps) => {
    return (
        <>
            <MenuBar auth={props.auth}/>
            <div className="root">
                <Drawer
                    className="left-drawer"
                    variant="permanent"
                    classes={{
                        paper: "drawer-paper",
                    }}
                >
                    <div className="drawer-container">
                        {/* <Toolbar /> */}
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

                </Drawer>
                <main>
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