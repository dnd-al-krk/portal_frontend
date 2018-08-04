import {inject, observer} from "mobx-react";
import {Component} from "react";
import React from "react";


@inject('portalStore') @observer
export default class Loader extends Component {

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
