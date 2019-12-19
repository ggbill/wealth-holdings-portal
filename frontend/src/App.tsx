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

const auth = new Auth();

const handleAuthentication = (prop: any) => {
    if (/access_token|id_token|error/.test(prop.location.hash)) {
        auth.handleAuthentication();
    }
};



const App = () => {
    return (
        <HttpsRedirect>
            <BrowserRouter>
                <MenuBar auth={auth} />
                <div className="full-height-content">
                    <Switch>
                        <Route
                            path="/"
                            component={Home}
                            exact
                        />
                        <Route
                            path="/season-admin"
                            render={() => <SeasonAdmin auth={auth} />}
                        />
                        <Route
                            path="/season/:id"
                            render={(props) => <Season auth={auth} {...props} />}
                        />
                        <Route path="/teams" component={TeamAdmin} />
                        <Route
                            path="/players"
                            render={() => <PlayerAdmin auth={auth} />}
                        />
                        <Route path="/player/:id" component={Player} />
                        <Route path="/fixture-admin" component={FixtureAdmin} />
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
