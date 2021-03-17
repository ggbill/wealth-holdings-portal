import React from 'react'
import { Router, Route, Switch, Redirect } from "react-router-dom"
import Home from './components/home/Home'
import { createBrowserHistory } from 'history';
import ClosedInstances from './components/closedInstances/ClosedInstances';
import ActivePipeline from './components/activePipeline/ActivePipeline';
import InstanceDetails from './components/instanceDetails/InstanceDetails';
import ActionLog from './components/actionLog/ActionLog';
import CompletedInstances from './components/completedInstances/CompletedInstances';
import Login from './components/login/login';
import LayoutAuthenticated from './layouts/LayoutAuthenticated';
import LayoutAnonymous from './layouts/LayoutAnonymous';
import Auth from './auth/Auth';
import Callback from './components/callback';
import './App.scss';
import Settings from './components/settings/Settings';


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
            path: "/marriage-bureau/dashboard",
            component: Home,
            exact: true,
            title: "Marriage Bureau - Dashboard"
        },
        {
            path: "/marriage-bureau/active-pipeline",
            component: ActivePipeline,
            exact: true,
            title: "Marriage Bureau - Active Pipeline"
        },
        {
            path: "/marriage-bureau/action-log",
            component: ActionLog,
            exact: true,
            title: "Marriage Bureau - Action Log"
        },
        {
            path: "/marriage-bureau/closed-instances",
            component: ClosedInstances,
            exact: true,
            title: "Marriage Bureau - Aborted Deals"
        },
        {
            path: "/marriage-bureau/completed-instances",
            component: CompletedInstances,
            exact: true,
            title: "Marriage Bureau - Completed Deals"
        },
        {
            path: "/marriage-bureau/instance-details/:id",
            component: InstanceDetails,
            title: "Marriage Bureau - Instance Details"
        },
        {
            path: "/buyer-onboarding/dashboard",
            component: Home,
            exact: true,
            title: "Buyer Onboarding - Dashboard"
        },
        {
            path: "/buyer-onboarding/active-pipeline",
            component: ActivePipeline,
            exact: true,
            title: "Buyer Onboarding - Active Pipeline"
        },
        {
            path: "/buyer-onboarding/action-log",
            component: ActionLog,
            exact: true,
            title: "Buyer Onboarding - Action Log"
        },
        {
            path: "/buyer-onboarding/closed-instances",
            component: ClosedInstances,
            exact: true,
            title: "Buyer Onboarding - Closed Instances"
        },
        {
            path: "/buyer-onboarding/instance-details/:id",
            component: InstanceDetails,
            title: "Buyer Onboarding - Instance Details"
        },
        {
            path: "/seller-onboarding/dashboard",
            component: Home,
            exact: true,
            title: "Seller Onboarding - Dashboard"
        },
        {
            path: "/seller-onboarding/active-pipeline",
            component: ActivePipeline,
            exact: true,
            title: "Seller Onboarding - Active Pipeline"
        },
        {
            path: "/seller-onboarding/action-log",
            component: ActionLog,
            exact: true,
            title: "Seller Onboarding - Action Log"
        },
        {
            path: "/seller-onboarding/closed-instances",
            component: ClosedInstances,
            exact: true,
            title: "Seller Onboarding - Closed Instances"
        },
        {
            path: "/seller-onboarding/instance-details/:id",
            component: InstanceDetails,
            title: "Seller Onboarding - Instance Details"
        },
        {
            path: "/settings",
            component: Settings,
            title: "Settings"
        },
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
                                    // auth={auth}
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
