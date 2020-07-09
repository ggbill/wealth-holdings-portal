import React from 'react'
import { Router, Route, Switch, Redirect } from "react-router-dom"
import Home from './components/home/Home'
import { createBrowserHistory } from 'history';
import ActivePipeline from './components/activePipeline/ActivePipeline';
import ClosedInstances from './components/closedInstances/ClosedInstances';
import InstanceList from './components/instanceList/InstanceList';
import InstanceDetails from './components/instanceDetails/InstanceDetails';
import ActionLog from './components/actionLog/ActionLog';
import CompletedInstances from './components/completedInstances/CompletedInstances';
import Login from './components/login/login';
import LayoutAuthenticated from './layouts/LayoutAuthenticated';
import LayoutAnonymous from './layouts/LayoutAnonymous';
import Auth from './auth/Auth';
import Callback from './components/callback';
import './App.scss';


const history = createBrowserHistory();

const App = () => {

    const auth = new Auth();

    const handleAuthentication = (prop: any) => {
        if (/access_token|id_token|error/.test(prop.location.hash)) {
            auth.handleAuthentication()
        }
    };

    // const layoutProps = {
    //     auth: auth
    // }

    const routes = [
        {
            path: "/dashboard",
            component: Home,
            exact: true,
            title: "Dashboard"
        },
        {
            path: "/active-pipeline",
            component: ActivePipeline,
            exact: true,
            title: "Active Pipeline"
        },
        {
            path: "/action-log",
            component: ActionLog,
            exact: true,
            title: "Action Log"
        },
        {
            path: "/closed-instances",
            component: ClosedInstances,
            exact: true,
            title: "Closed Instances"
        },
        {
            path: "/completed-instances",
            component: CompletedInstances,
            exact: true,
            title: "Completed Instances"
        },
        {
            path: "/all-instances",
            component: InstanceList,
            exact: true,
            title: "All Instances"
        },
        {
            path: "/onboard-lead",
            component: InstanceList,
            exact: true,
            title: "Live Instances"
        },
        {
            path: "/initial-fee-payment",
            component: InstanceList,
            exact: true,
            title: "Live Instances"
        },
        {
            path: "/high-level-due-diligence",
            component: InstanceList,
            exact: true,
            title: "Live Instances"
        },
        {
            path: "/heads-of-terms",
            component: InstanceList,
            exact: true,
            title: "Live Instances"
        },
        {
            path: "/detailed-due-diligence",
            component: InstanceList,
            exact: true,
            title: "Live Instances"
        },
        {
            path: "/formal-offer",
            component: InstanceList,
            exact: true,
            title: "Live Instances"
        },
        {
            path: "/transaction-agreement",
            component: InstanceList,
            exact: true,
            title: "Live Instances"
        },
        {
            path: "/final-fee-payment",
            component: InstanceList,
            exact: true,
            title: "Live Instances"
        },
        {
            path: "/instance-details/:id",
            component: InstanceDetails,
            title: "Instance Details"
        }

    ];

    return (
        <Router history={history}>
            <Switch>
                {routes.map((route, i) =>
                    <Route key={i} exact={route.exact} path={route.path}>
                        <LayoutAuthenticated auth={auth} title={route.title}>
                                <Route
                                    key={i}
                                    path={route.path}
                                    exact={route.exact}
                                    render={(props) => (auth.isAuthenticated() ? <route.component auth={auth} {...props} /> : <Redirect to={{ pathname: "/", search: "unauthorised" }} />)}
                                />
                        </LayoutAuthenticated>
                    </Route>
                )}
                <Route path="/" exact={true}>
                    <LayoutAnonymous>
                        <Route path="/" exact={true} render={(props) => <Login auth={auth} {...props} />} />
                    </LayoutAnonymous>
                </Route>
                <Route path="/callback" render={props => {
                    handleAuthentication(props);
                    return <Callback {...props} />;
                }} />
            </Switch>
        </Router>
    )
}

export default App;
