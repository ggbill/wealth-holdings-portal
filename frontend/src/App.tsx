import React from 'react'
import { BrowserRouter, Route, Switch } from "react-router-dom"
import Home from './components/home/Home'
import TeamAdmin from './components/team/TeamAdmin'
import PlayerAdmin from './components/player/PlayerAdmin'
import FixtureAdmin from './components/fixture/FixtureAdmin'
import Error from './components/Error'
import MenuBar from './components/MenuBar'
import SeasonAdmin from './components/season/SeasonAdmin'
import Season from './components/season/Season'
import Fixture from './components/fixture/Fixture'
import Player from './components/player/Player'



const App = () => {
    return (
        <BrowserRouter>
            <MenuBar />
            <div>
                <Switch>
                    <Route path="/" component={Home} exact />
                    <Route path="/season-admin" component={SeasonAdmin} />
                    <Route path="/season/:id" component={Season} />
                    <Route path="/teams" component={TeamAdmin} />
                    <Route path="/players" component={PlayerAdmin} />
                    <Route path="/player/:id" component={Player} />
                    <Route path="/fixture-admin" component={FixtureAdmin} />
                    <Route path="/fixture/:id" component={Fixture} />
                    <Route component={Error} />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;
