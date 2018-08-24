import React from 'react';
import {inject, observer} from "mobx-react";

@inject('portalStore') @observer
class Home extends React.Component {

  render() {
    return (
      <div className="container">
        <h1>Home page!!</h1>
      </div>
    );
  }
}

export default Home;
