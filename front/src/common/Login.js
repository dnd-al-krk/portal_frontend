import React from 'react'
import {inject, observer} from "mobx-react";
import {Redirect} from "react-router-dom";


@inject('portalStore') @observer
class Login extends React.Component {
  state = {
    redirectToReferrer: false
  };

  login = () => {
    // TODO: create regular component for that!
    const username = window.prompt('username', '');
    const password = window.prompt('password', '');
    this.props.portalStore.login(username, password)
      .then(() => {
        this.setState(() => ({
          redirectToReferrer: true
        }))
      });
  };

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer === true) {
      return <Redirect to={from} />
    }

    return (
      <div>
        <p>You must log in to view the page</p>
        <button onClick={this.login}>Log in</button>
      </div>
    )
  }
}

export default Login;
