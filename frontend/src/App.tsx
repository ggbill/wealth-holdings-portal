import React from 'react'
import { Router, Route, Switch, Link } from "react-router-dom"
import Home from './components/home/Home'
import HttpsRedirect from 'react-https-redirect'
// import ReactGA from'react-ga'
import { createBrowserHistory } from 'history';
import MenuBar from './components/shared/MenuBar'
import Footer from './components/shared/Footer';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core/';
import BlockIcon from '@material-ui/icons/Block';
import LabelImportantIcon from '@material-ui/icons/LabelImportant';
import ActivePipeline from './components/activePipeline/ActivePipeline';
import ClosedInstances from './components/closedInstances/ClosedInstances';
import InstanceList from './components/instanceList/InstanceList';
import InstanceDetails from './components/instanceDetails/InstanceDetails';
import HomeIcon from '@material-ui/icons/Home';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import ActionLog from './components/actionLog/ActionLog';
import CompletedInstances from './components/completedInstances/CompletedInstances';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const history = createBrowserHistory();

const App = () => {

    return (
        <HttpsRedirect>
            <Router history={history}>
                <MenuBar />
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
                                <ListItem button component={Link} to="/">
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
                            <Switch>
                                <Route path="/" component={Home} exact />
                                <Route path="/active-pipeline" component={ActivePipeline} exact />
                                <Route path="/action-log" component={ActionLog} exact />
                                <Route path="/closed-instances" component={ClosedInstances} exact />
                                <Route path="/completed-instances" component={CompletedInstances} exact />
                                <Route path="/all-instances" component={InstanceList} exact />
                                <Route path="/onboard-lead" component={InstanceList} exact />
                                <Route path="/initial-fee-payment" component={InstanceList} exact />
                                <Route path="/high-level-due-diligence" component={InstanceList} exact />
                                <Route path="/heads-of-terms" component={InstanceList} exact />
                                <Route path="/detailed-due-diligence" component={InstanceList} exact />
                                <Route path="/formal-offer" component={InstanceList} exact />
                                <Route path="/transaction-agreement" component={InstanceList} exact />
                                <Route path="/final-fee-payment" component={InstanceList} exact />
                                <Route path="/instance-details/:id" component={InstanceDetails}/>
                            </Switch>
                        </div>
                        <Footer />
                    </main>

                </div>

            </Router>
        </HttpsRedirect>
    );
}

export default App;
