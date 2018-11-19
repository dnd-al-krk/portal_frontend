import {inject, observer} from "mobx-react";
import React, {Fragment} from "react";
import Spinner from "../common/LoadingDiv";
import Games from "./Games";
import Typography from "@material-ui/core/Typography/Typography";
import {withStyles} from "@material-ui/core";
import Link from "react-router-dom/es/Link";


const styles = (theme) => ({
  header: {
    padding: '10px 30px',
    fontSize: 24,
  },
  infoParagraph: {
    padding: '10px 20px',
  }
});

@withStyles(styles, {withTheme: true})
@inject('portalStore') @observer
export class FutureGamesList extends React.Component {

  state = {
    loading: true,
    games: null,
  };

  componentDidMount(){
    this.setState({
      loading: true,
    });
    this.props.portalStore.games.fetchFuture().then((games) => {
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
          <Typography variant='h5' className={classes.header}>
            Incoming game sessions
          </Typography>
          <Games list={this.state.games} />
        </Fragment>
      )
  }
}


@withStyles(styles, {withTheme: true})
@inject('portalStore') @observer
export class PastGamesList extends React.Component {

  state = {
    loading: true,
    games: null,
  };

  componentDidMount(){
    this.setState({
      loading: true,
    });
    this.props.portalStore.games.fetchPast().then((games) => {
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
          <Typography variant='h5' className={classes.header}>
            Game sessions archive
          </Typography>
          <Games list={this.state.games} />
        </Fragment>
      )
  }
}



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
          <Typography variant='h5' className={classes.header}>
            All game sessions
          </Typography>
          <Games list={this.state.games} />
        </Fragment>
      )
  }
}


@withStyles(styles, {withTheme: true})
@inject('portalStore') @observer
export class CurrentUserGamesList extends React.Component {

  state = {
    loading: true,
    games: null,
  };

  componentDidMount(){
    this.setState({
      loading: true,
    });
    this.props.portalStore.games.fetchFutureForCurrentUser().then((games) => {
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
          <Typography variant='h4' component="h1" className={classes.header}>
            Your next games
          </Typography>
          {this.state.games.length ? (
            <Games list={this.state.games} />
          ) : (
            <Typography className={classes.infoParagraph}>
              You are not playing any game soon. <Link to='/games'>Check incomming games</Link> to join one.
            </Typography>
          )}

        </Fragment>
      )
  }
}


@withStyles(styles, {withTheme: true})
@inject('portalStore') @observer
export class CurrentDMGamesList extends React.Component {

  state = {
    loading: true,
    games: null,
  };

  componentDidMount(){
    this.setState({
      loading: true,
    });
    this.props.portalStore.games.fetchFutureForCurrentDM().then((games) => {
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
          <Typography variant='h4' component="h1" className={classes.header}>
            The next games you run as a DM
          </Typography>
          {this.state.games.length ? (
            <Games list={this.state.games} />
          ) : (
            <Typography variant='body1' className={classes.infoParagraph}>
              As a DM you are not running any game yet. <Link to='/games'>Check available slots</Link> to run one.
            </Typography>
          )}

        </Fragment>
      )
  }
}
