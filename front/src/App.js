import React, {Component} from 'react';

import {PortalStore} from './store';
import {observer, Provider} from 'mobx-react';
import {BrowserRouter as Router, Route,} from 'react-router-dom';

import './App.css';
import Account from "./pages/Account";
import Characters from "./pages/Characters";
import Home from "./pages/Home";
import TopAppBar from "./common/TopAppBar";
import styled from 'styled-components';
import RouteRequiresLogin from "./common/RouteRequiresLogin";
import Login from "./common/Login";
import Loader from "./common/Loader";
import Profiles from "./pages/Profiles";
import Profile from "./pages/Profile";
import CharacterCreate from "./pages/CharacterCreate";
import CharacterEdit from "./pages/CharacterEdit";
import Register from "./common/Register";
import GameBooking from "./pages/GameBooking";
import GameDetail from "./pages/GameDetail";
import {FutureGamesList, GamesList, PastGamesList} from "./pages/GamesList";
import PasswordReset from "./pages/PasswordReset";


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
                <Route exact path="/password-reset/" component={PasswordReset}/>
                {/*<Route exact path="/password-reset/:token" component={PasswordResetConfirm}/>*/}
                <RouteRequiresLogin exact path="/games/archive" component={PastGamesList}/>
                <RouteRequiresLogin exact path="/games" component={FutureGamesList}/>
                <RouteRequiresLogin exact path="/games/game/:id" component={GameDetail}/>
                <RouteRequiresLogin exact path="/games/game/:id/book" component={GameBooking}/>
                <RouteRequiresLogin exact path="/profiles" component={Profiles}/>
                <RouteRequiresLogin exact path="/profiles/:id" component={Profile}/>
                <RouteRequiresLogin exact path="/characters" component={Characters}/>
                <RouteRequiresLogin exact path="/characters/create" component={CharacterCreate}/>
                <RouteRequiresLogin exact path="/characters/:id/edit" component={CharacterEdit}/>
                <RouteRequiresLogin path="/account" component={Account}/>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/register" component={Register}/>
              </PushedDiv>
            </div>
          </Router>
        </Loader>
      </Provider>
    );
  }
}

export default App;
