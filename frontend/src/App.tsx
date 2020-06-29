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

    const layoutProps = {
        auth: auth
    }

    const routes = [
        // {
        //     layout: LayoutAnonymous,
        //     subRoutes: [
        //         {
        //             exact: true,
        //             path: "/",
        //             component: Login,
        //         },
        //     ]
        // },
        {
            layout: LayoutAuthenticated,
            subRoutes: [
                {
                    path: "/dashboard",
                    component: Home,
                    exact: true
                },
                {
                    path: "/active-pipeline",
                    component: ActivePipeline,
                    exact: true
                },
                {
                    path: "/action-log",
                    component: ActionLog,
                    exact: true
                },
                {
                    path: "/closed-instances",
                    component: ClosedInstances,
                    exact: true
                },
                {
                    path: "/completed-instances",
                    component: CompletedInstances,
                    exact: true
                },
                {
                    path: "/all-instances",
                    component: InstanceList,
                    exact: true
                },
                {
                    path: "/onboard-lead",
                    component: InstanceList,
                    exact: true
                },
                {
                    path: "/initial-fee-payment",
                    component: InstanceList,
                    exact: true
                },
                {
                    path: "/high-level-due-diligence",
                    component: InstanceList,
                    exact: true
                },
                {
                    path: "/heads-of-terms",
                    component: InstanceList,
                    exact: true
                },
                {
                    path: "/detailed-due-diligence",
                    component: InstanceList,
                    exact: true
                },
                {
                    path: "/formal-offer",
                    component: InstanceList,
                    exact: true
                },
                {
                    path: "/transaction-agreement",
                    component: InstanceList,
                    exact: true
                },
                {
                    path: "/final-fee-payment",
                    component: InstanceList,
                    exact: true
                },
                {
                    path: "/instance-details/:id",
                    component: InstanceDetails,
                }
            ]
        }
    ];

    return (
        <Router history={history}>
            <Switch>
                {routes.map((route, i) =>
                    <Route key={i} exact={route.subRoutes.some(r => r.exact)} path={(route.subRoutes as any[]).map(r => r.path)}>
                        <route.layout {...layoutProps}>
                            {(route.subRoutes as any[]).map((subRoute, i) =>
                                <Route
                                    key={i}
                                    path={subRoute.path}
                                    exact={subRoute.exact}
                                    // render={(props) => (auth.isAuthenticated() ? <subRoute.component {...props} /> : <Redirect to={{pathname:"/", search:"status=unauthorised"}}/>)}
                                    render={() => (auth.isAuthenticated() ? <subRoute.component auth={auth} /> : <Redirect to={{pathname:"/", search:"unauthorised"}}/>)}
                                />
                            )}
                        </route.layout>
                    </Route>
                )}
                <Route path="/" exact={true}>
                    <LayoutAnonymous>
                        <Route path="/" exact={true} render={(props) => <Login auth={auth} {...props}/> } />
                        {/* <Route path="/" exact={true} render={() => <Login auth={auth}/> } /> */}
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
