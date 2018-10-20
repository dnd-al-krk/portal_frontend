import {inject, observer} from "mobx-react";
import React, {Fragment} from "react";
import Spinner from "../common/LoadingDiv";
import Games from "./Games";
import Typography from "@material-ui/core/Typography/Typography";
import {withStyles} from "@material-ui/core";


const styles = (theme) => ({
  header: {
    padding: '10px 30px'
  }
});

@withStyles(styles, {withTheme: true})
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
    const {classes} = this.props;
    if(this.state.loading)
      return (
          <Spinner loading={this.state.loading} />
        );
    else
      return (
        <Fragment>
          <Typography variant='display1' className={classes.header}>
            All game sessions
          </Typography>
          <Games list={this.state.games} />
        </Fragment>
      )
  }
}
