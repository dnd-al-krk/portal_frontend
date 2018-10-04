import React, {Component} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import {inject, observer} from "mobx-react";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import CalendarIcon from '@material-ui/icons/CalendarToday';
import TimeIcon from '@material-ui/icons/AccessTime';
import LocationIcon from '@material-ui/icons/LocationOn';
import {dateToString, weekdayOf} from "../utils";
import LoadingDiv from "../common/LoadingDiv";
import {ClipLoader} from "react-spinners";
import Avatar from "@material-ui/core/Avatar/Avatar";
import PersonIcon from "@material-ui/icons/Person";
import UndecoratedLink from "../common/UndecoratedLink";
import List from "@material-ui/core/List/List";
import ProfileListItem from "../common/ProfileListItem";
import PlusIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button/Button";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import IconButton from "@material-ui/core/IconButton/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";

const styles = theme => ({
  root: {
    padding: 20
  },
  header: {
    marginBottom: 10
  },
  info: {
    marginBottom: 5
  },
  infoIcon: {
    fontSize: 14,
    marginRight: 10
  },
  userInfo: {
    padding: 10,
    height: 50,
  },
  userAvatar: {
    padding: 10,
    width: 24,
    height: 24,
    float: 'left',
    marginRight: 20,
  },
  userName: {
    height: 44,
    lineHeight: '44px',
  }
});

@withStyles(styles, {withTheme: true})
@inject('portalStore') @observer
class GameDetail extends Component {

  state = {
    game: null,
    loading: true,
  };

  componentDidMount(){
    this.getGame();
  }

  getGame = () => {
    this.setState({
      loading: true,
    });
    return this.props.portalStore.games.get(this.props.match.params.id).then(game => {
      this.setState({
        game: game,
        loading: false,
      })
    })
  };

  gameDate = (game) => {
    const date = new Date(game.date);
    const dateString = dateToString(date);
    const day = weekdayOf(date);
    return `${dateString}, ${day}`;
  };

  gameTime = (game) => {
    if(game.time_end){
      return `${game.time_start} - ${game.time_end}`;
    }
    return `Starting at: ${game.time_start}`
  };

  gameDM = (dm) => {
    return `${dm.first_name} ${dm.last_name}`
  };

  getUserListItem = (player) => {
    let action = null;
    if(player.id === this.props.portalStore.currentUser.profileID){
      action = (
        <IconButton aria-label="See profile" onClick={() => this.signOut()}>
          <CancelIcon />
        </IconButton>
      )
    }
    return <ProfileListItem key={`signed-up-player-${player.id}`} profile={player} history={this.props.history} action={action}/>
  };

  canSignUp = () => {
    const players = this.state.game.players.map(player => player.id);
    const player = this.props.portalStore.currentUser.profileID;
    const usersGameSlot = this.state.game.dm.id === player;
    return players.indexOf(player) === -1 && !usersGameSlot;
  };

  signUp = () => {
    this.props.portalStore.games.signUp(this.state.game.id).then(() => {
      this.getGame();
    });
  };

  signOut = () => {
    this.props.portalStore.games.signOut(this.state.game.id).then(() => {
      this.getGame();
    });
  };

  render() {
    const {classes} = this.props;
    if(this.state.loading)
      return (
          <LoadingDiv>
            <ClipLoader color={'#FFDE00'} loading={this.state.loading}/>
          </LoadingDiv>
        );

    const game = this.state.game;

    return (
      <div className={classes.root}>
        <Grid container spacing={8}>
          <Grid item xs={12} md={6}>
            <Typography variant="display1" className={classes.header}>
              {game.adventure.title_display}
            </Typography>
            <Typography variant="body1" className={classes.info}>
                <CalendarIcon className={classes.infoIcon}/>{this.gameDate(game)}
            </Typography>
            <Typography variant="body1" className={classes.info}>
                <TimeIcon className={classes.infoIcon}/> {this.gameTime(game)}
            </Typography>
            <Typography variant="body1" className={classes.info}>
                <LocationIcon className={classes.infoIcon}/> {game.table_name}
            </Typography>
            <Typography variant="headline" className={classes.header}>
                Dungeon Master
            </Typography>
            <div className={classes.userInfo}>
              <Avatar className={classes.userAvatar}><PersonIcon/></Avatar>
              <Typography variant="title" className={classes.userName}>
                <UndecoratedLink to={`/profiles/${game.dm.id}`}>{this.gameDM(game.dm)}</UndecoratedLink>
              </Typography>
            </div>
            <Typography variant="headline" className={classes.header}>
                Additional Notes
            </Typography>
            <Typography variant="body1">
              {game.notes}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="headline" className={classes.header}>
                Signed up players
            </Typography>
            <List>
              {game.players.map(player => this.getUserListItem(player))}
            </List>
            {this.canSignUp() && (
              <Button variant="contained" color="secondary" onClick={() => this.signUp()}>
                <PlusIcon/>
                Join this game
              </Button>
            )}

          </Grid>
        </Grid>
      </div>
    );
  }
}

export default GameDetail;
