import React from 'react'
import { Router, Route, Switch } from "react-router-dom"
import Home from './components/home/Home'
import HttpsRedirect from 'react-https-redirect'
// import ReactGA from'react-ga'
import { createBrowserHistory } from 'history';
import DynamicComponent from './components/dynamicComponent/DynamicComponent'
import MenuBar from './components/shared/MenuBar'
import Footer from './components/shared/Footer';
import About from './components/about/About';

const history = createBrowserHistory();

const App = () => {

    return (
        <HttpsRedirect>
            <Router history={history}>
                <MenuBar />
                <div className="full-height-content">
                    <Switch>
                        <Route path="/" component={Home} exact />
                        <Route path="/about" component={About} exact />
                        <Route path="/:dynamicPath" component={DynamicComponent} />
                    </Switch>
                </div>
                <Footer />
            </Router>
        </HttpsRedirect>
    );
}

export default App;
