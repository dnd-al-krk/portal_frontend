import {inject, observer} from "mobx-react";
import React from "react";
import LoadingDiv from "../common/LoadingDiv";
import {ClipLoader} from "react-spinners";
import Games from "./Games";


@inject('portalStore') @observer
export class GamesList extends React.Component {

  state = {
    loading: true,
    games: null,
  };

  componentDidMount(){
    this.setState({
      loading: true,
    });
    this.props.portalStore.games.fetch().then((games) => {
      this.setState({
        games: games,
        loading: false,
      })
    })
  }

  render(){

    if(this.state.loading)
      return (
          <LoadingDiv>
            <ClipLoader color={'#FFDE00'} loading={this.state.loading}/>
          </LoadingDiv>
        );
    else
      return <Games list={this.state.games} />
  }
}
