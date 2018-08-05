import React, { Component } from 'react';

import {PortalStore} from './store';
import {inject, observer, Provider} from 'mobx-react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter, Redirect,
} from 'react-router-dom';

import './App.css';
import Account from "./pages/Account";
import Characters from "./pages/Characters";
import Home from "./pages/Home";
import TopAppBar from "./common/TopAppBar";
import styled from 'styled-components';
import RouteRequiresLogin from "./common/RouteRequiresLogin";
import Login from "./common/Login";
import Loader from "./common/Loader";


const portalStore = new PortalStore();

const PushedDiv = styled.div`
  padding-top: 80px;
`;




@observer
class App extends Component {

  render() {
    return (
      <Provider portalStore={portalStore}>
        <Loader>
          <Router>
            <div>
              <TopAppBar/>
              <PushedDiv>
                <Route exact path="/" component={Home}/>
                <Route path="/characters" component={Characters}/>
                <RouteRequiresLogin path="/account" component={Account}/>
                <Route exact path="/login" component={Login}/>
              </PushedDiv>
            </div>
          </Router>
        </Loader>
      </Provider>
    );
  }
}

export default App;
