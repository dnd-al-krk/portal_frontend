import React, { Component } from 'react';

import { PortalStore } from './store';
import {observer, Provider} from 'mobx-react';

import './App.css';


const portalStore = new PortalStore()

@observer
class App extends Component {
  render() {
    return (
      <Provider portalStore={portalStore}>
        <div>Hello world!</div>
      </Provider>
    );
  }
}

export default App;
