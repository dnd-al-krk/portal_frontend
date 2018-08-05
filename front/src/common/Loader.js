import {inject, observer} from "mobx-react";
import {Component} from "react";
import React from "react";
import styled from 'styled-components';

const LoadingDiv = styled.div`
  position:fixed;
  top: 50%;
  left: 50%;
  width: 4em;
  height: 2em;
  margin-left: -1em;
  margin-top: -2em;
  text-align: center;
  color: #888;
  font-size: 2em;
`;


@inject('portalStore') @observer
export default class Loader extends Component {

  state = {
    loading: true,
  };

  componentDidMount() {
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
    if (this.state.loading) {
      return (<LoadingDiv>loading...</LoadingDiv>) }
    else {
      return (
        <div>
          { this.props.children }
        </div>
      )
    }
  }
}
