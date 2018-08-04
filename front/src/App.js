import React, { Component } from 'react';

import {NavigationStore, PortalStore} from './store';
import {inject, observer, Provider} from 'mobx-react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter, Redirect,
} from 'react-router-dom';

import './App.css';
import Profile from "./pages/Profile";
import Characters from "./pages/Characters";
import Home from "./pages/Home";
import TopAppBar from "./common/TopAppBar";
import styled from 'styled-components';
import RouteRequiresLogin from "./common/RouteRequiresLogin";
import Login from "./common/Login";


const portalStore = new PortalStore();
const navigationStore = new NavigationStore();

const PushedDiv = styled.div`
  padding-top: 80px;
`;


@inject('portalStore') @observer
class Loader extends Component {

  state = {
    loading: true,
  };

  componentDidMount = () => {
    if(!this.props.portalStore.currentUser)
      this.props.portalStore.autologin()
        .then(
          () => { this.removeLoader() },
          () => { this.removeLoader() });
  };

  removeLoader = () => {
    this.setState({
      loading: false,
    });
  };

  render() {
    if (this.state.loading) { return (<div>Loading...</div>) }
    else {
      return (
        <div>
          { this.props.children }
        </div>
      )
    }
  }
}

@observer
class App extends Component {

  render() {
    return (
      <Provider portalStore={portalStore}
                navigationStore={navigationStore}>
        <Loader>
          <Router>
            <div>
              <TopAppBar/>
              <PushedDiv>
                <Route exact path="/" component={Home}/>
                <Route path="/characters" component={Characters}/>
                <RouteRequiresLogin path="/profile" component={Profile}/>
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
