import React from 'react'
import { BrowserRouter, Route, Switch } from "react-router-dom"
import Home from './components/home/Home'
import TeamAdmin from './components/team/TeamAdmin'
import PlayerAdmin from './components/player/PlayerAdmin'
import FixtureAdmin from './components/fixture/FixtureAdmin'
import Error from './components/shared/Error'
import MenuBar from './components/shared/MenuBar'
import SeasonAdmin from './components/season/SeasonAdmin'
import Season from './components/season/Season'
import Fixture from './components/fixture/Fixture'
import Player from './components/player/Player'
import Footer from './components/shared/Footer'
import Auth from './auth/Auth';
import Callback from './components/callback'
import Loading from './components/shared/Loading'
import HttpsRedirect from 'react-https-redirect'
import ReactGA from'react-ga'

ReactGA.initialize('UA-154787523-1');

const logPageView = () => {
    ReactGA.set({ page: window.location.pathname + window.location.search });
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

const auth = new Auth();

const handleAuthentication = (prop: any) => {
    if (/access_token|id_token|error/.test(prop.location.hash)) {
        auth.handleAuthentication();
    }
};

const App = () => {
    return (
        <HttpsRedirect>
            <BrowserRouter onUpdate={logPageView}>
                    <MenuBar auth={auth} />
                    <div className="full-height-content">

                        <Switch>
                            <Route
                                path="/"
                                component={Home}
                                exact
                            />
                            <Route
                                path="/season-list"
                                render={() => <SeasonAdmin auth={auth} />}
                            />
                            <Route
                                path="/season/:id"
                                render={(props) => <Season auth={auth} {...props} />}
                            />
                            <Route path="/team-list" component={TeamAdmin} />
                            <Route
                                path="/player-list"
                                render={() => <PlayerAdmin auth={auth} />}
                            />
                            <Route path="/player/:id" component={Player} />
                            <Route path="/fixture-list" component={FixtureAdmin} />
                            <Route path="/fixture/:id" component={Fixture} />
                            <Route path="/callback" render={props => {
                                handleAuthentication(props);
                                return <Callback {...props} />;
                            }}
                            />
                            <Route path="/loading" component={Loading} />
                            <Route component={Error} />
                        </Switch>
                    </div>
                    <Footer auth={auth} />
            </BrowserRouter>
        </HttpsRedirect>
    );
}

export default App;
