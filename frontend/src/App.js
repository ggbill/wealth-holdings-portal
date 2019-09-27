import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from "react-router-dom"
import Home from './components/Home'
import About from './components/About'
import Contact from './components/Contact'
import Error from './components/Error'
import Navigation from './components/Navigation'


class App extends Component {

    constructor(props) {
        super(props);
        this.state = { apiResponse: [] };
    }
    
    callAPI() {
        fetch("http://localhost:8080/players")
            .then(res => res.json())
            .then(data => {
                this.setState({ apiResponse: data })
            });
    }
    
    componentDidMount() {
        this.callAPI();
    }

    render(){
        console.log(this.state.apiResponse);
        return (
            <BrowserRouter>
                <Navigation />
                <ul>
                    {this.state.apiResponse.map(item => (
                        <li key={item._id}>{item.firstName} {item.surname}</li> 
                    ))}
                </ul>
                {/* <p> {this.state.apiResponse.firstName} </p> */}
                <Switch>
                    <Route path="/" component={Home} exact/>
                    <Route path="/about" component={About} />
                    <Route path="/contact" component={Contact} />
                    <Route component={Error} />
                </Switch>
            </BrowserRouter>
        );
    }
    
}

export default App;
