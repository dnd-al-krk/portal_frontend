import React, {Component, Fragment} from 'react';
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
import IconButton from "@material-ui/core/IconButton/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";
import Menu from "@material-ui/core/Menu/Menu";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";

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
  },
  gameButton: {
    marginBottom: 20,
    marginTop: 10,
    display: 'block',
  }
});

@withStyles(styles, {withTheme: true})
@inject('portalStore') @observer
class GameDetail extends Component {

  state = {
    game: null,
    characters: null,
    anchorEl: null,
    loading: true,
  };

  componentDidMount(){
    this.fetchData();
  }

  fetchData = () => {
    this.setState({
      loading: true,
    });
    return Promise.all([this.getGame(), this.fetchCharacters()]).then(data => {
      this.setState({
        game: data[0],
        characters: data[1],
        loading: false,
      })
    })
  };

  getGame = () => {
    return this.props.portalStore.games.get(this.props.match.params.id)
  };

  fetchCharacters = () => {
    return this.props.portalStore.fetchProfileCharacters(this.props.portalStore.currentUser.profileID);
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
    if(player.profile.id === this.props.portalStore.currentUser.profileID){
      action = (
        <IconButton aria-label="See profile" onClick={() => this.signOut()}>
          <CancelIcon />
        </IconButton>
      )
    }
    return <ProfileListItem key={`signed-up-player-${player.profile.id}`} profile={player.profile} character={player.character}
                            history={this.props.history} action={action}/>
  };

  freeSpots = () => {
    return this.state.game.spots - this.takenSpots();
  };

  takenSpots = () => {
    return this.state.game.players.length;
  };

  canSignUp = () => {
    const players = this.state.game.players.map(player => player.profile.id);
    const player = this.props.portalStore.currentUser.profileID;
    const usersGameSlot = this.state.game.dm && this.state.game.dm.id === player;
    const emptySpot = this.freeSpots() > 0;
    const isDM = this.state.game.dm;
    return isDM && players.indexOf(player) === -1 && !usersGameSlot && emptySpot;
  };

  signUp = (characterId) => {
    this.props.portalStore.games.signUp(this.state.game.id, characterId).then(() => {
      this.fetchData();
    });
  };

  signOut = () => {
    this.props.portalStore.games.signOut(this.state.game.id).then(() => {
      this.fetchData();
    });
  };

  showCharacterPick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  hideCharacterPick = () => {
    this.setState({ anchorEl: null });
  };

  handleCharacterPick = (e, id) => {
    this.hideCharacterPick();
    this.signUp(id);
  };

  gotoGameBooking = (e, id) => {
    e.stopPropagation();
    this.props.history.push(`/games/${id}/book`);
  };

  cancel = (gameID) => {
    this.props.portalStore.games.cancel(gameID).then(() => {
      this.props.history.push('/games')
    });
  };

  render() {
    const {classes} = this.props;
    const { anchorEl } = this.state;
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

            {game.dm ? (
              <div>
                <Avatar className={classes.userAvatar}><PersonIcon/></Avatar>
                <Typography variant="title" className={classes.userName}>
                  <UndecoratedLink to={`/profiles/${game.dm.id}`}>{this.gameDM(game.dm)}</UndecoratedLink>
                </Typography>
                {game.dm.id === this.props.portalStore.currentUser.profileID && (
                  <Button
                    color='secondary'
                    variant='contained'
                    className={classes.gameButton}
                    onClick={() => this.cancel(game.id)}>Cancel your booking on this game session</Button>
                )}
              </div>
              ): (
              <div>
                DM can no longer run this game and a new one is needed!
                {this.props.portalStore.currentUser.role === 'Dungeon Master' && (
                  <Button color='secondary' variant='contained' className={classes.gameButton}
                          onClick={(e) => this.gotoGameBooking(e, game.id)}>
                    I will run this game
                  </Button>
                )}
              </div>
            )}
            <Typography variant="headline" className={classes.header}>
                Additional Notes
            </Typography>
            <Typography variant="body1">
              {game.notes}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="headline" className={classes.header}>
                Signed up players ({this.takenSpots()}/{this.state.game.spots})
            </Typography>
            <List>
              {game.players.map(player => this.getUserListItem(player))}
            </List>
            {this.canSignUp() && this.state.characters && (
              <Fragment>
                <Button variant="contained"
                        aria-owns={anchorEl ? 'simple-menu' : null}
                        aria-haspopup="true"
                        color="secondary" onClick={this.showCharacterPick}>
                  <PlusIcon/>
                  Join this game
                </Button>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={this.hideCharacterPick}
                >
                  {this.state.characters.map(character => (
                    <MenuItem key={`character-pick-item-${character.id}`} onClick={(e) => this.handleCharacterPick(e, character.id)}>{character.name}, {character.pc_class} {character.level}</MenuItem>
                  ))}
                </Menu>
              </Fragment>
            )}

          </Grid>
        </Grid>
      </div>
    );
  }
}

export default GameDetail;
