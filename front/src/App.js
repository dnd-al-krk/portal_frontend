import React, { Component } from 'react';

import {NavigationStore, PortalStore} from './store';
import {observer, Provider} from 'mobx-react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import './App.css';
import Profile from "./pages/Profile";
import Characters from "./pages/Characters";
import Home from "./pages/Home";
import TopAppBar from "./common/TopAppBar";
import styled from 'styled-components';


const portalStore = new PortalStore();
const navigationStore = new NavigationStore();

const PushedDiv = styled.div`
  padding-top: 50px;
`;

@observer
class App extends Component {
  render() {
    return (
      <Provider portalStore={portalStore}
                navigationStore={navigationStore}>
        <Router>
          <div>
            <TopAppBar />
            <PushedDiv>
              <Route exact path="/" component={Home} />
              <Route path="/profile" component={Profile} />
              <Route path="/characters" component={Characters} />
            </PushedDiv>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
