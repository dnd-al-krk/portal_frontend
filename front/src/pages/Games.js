import React, {Fragment} from 'react';
import {inject, observer} from "mobx-react";
import Typography from "@material-ui/core/Typography/Typography";
import withStyles from '@material-ui/core/styles/withStyles';
import Button from "@material-ui/core/Button/Button";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Avatar from "@material-ui/core/Avatar/Avatar";
import Chip from "@material-ui/core/Chip/Chip";
import CalendarIcon from "@material-ui/icons/Event";
import RoomIcon from "@material-ui/icons/Room";
import PersonIcon from "@material-ui/icons/Person";
import ExclamationIcon from "@material-ui/icons/Warning";
import GamesStore from "../stores/GamesStore";
import {withRouter} from "react-router-dom";
import classNames from 'classnames';

const styles = theme => ({
  root: {
    padding: '0 20px',
  },
  gameSession: {
    marginBottom: 20,
  },
  actions: {
    display: 'flex',
  },
  chip: {
    marginRight: 10,
    marginBottom: 10,
  },
  title: {
    marginBottom: 10,
  },
  gameItemOfDM: {
    borderLeft: '5px solid #333333',
    paddingLeft: 19,
  },
  gameItemOfPlayer: {
    borderLeft: '5px solid #DF9E00',
    paddingLeft: 19,
  },
  currentDM: {
    backgroundColor: '#DF9E00',
    color: 'white',
  }
});

@withStyles(styles, {withTheme: true})
@inject('portalStore') @observer
@withRouter
export default class Games extends React.Component {

  gotoGameBooking = (e, id) => {
    e.stopPropagation();
    this.props.history.push(`/games/game/${id}/book`);
  };

  gotoGame = (id) => {
    this.props.history.push(`/games/game/${id}`);
  };

  gotoDM = (e, id) => {
    e.stopPropagation();
    this.props.history.push(`/profiles/${id}`);
  };

  spotsLeft = (game) => {
    return Math.max(game.spots - game.players.length, 0)
  };

  getItemClassNames = (game) => {
    const {classes} = this.props;
    const profileID = this.props.portalStore.currentUser.profileID;
    if(game.dm && game.dm.id === profileID)
      return classes.gameItemOfDM;
    if(game.players.map(player => player.profile.id).some((id) => id === profileID))
      return classes.gameItemOfPlayer;
    return null;
  };

  render() {
    const {classes, list} = this.props;

    return (
      <List className={classes.root}>
        {list.map(game => (
          <Fragment>
            {game.adventure ? (
              <ListItem key={`game-session-slot-${game.id}`} button onClick={() => this.gotoGame(game.id)}
                        className={this.getItemClassNames(game)}
              >
                <Fragment>
                  <ListItemIcon>
                    <div style={{textAlign: 'center'}}>
                      <Typography variant="title" style={{marginBottom: 0}}>
                        <CalendarIcon/><br/>
                        {GamesStore.getDateString(game)}
                      </Typography>
                      <Typography component='p'>
                        {GamesStore.getWeekDay(game)}<br/>
                        <strong>{game.timeStart}</strong>
                      </Typography>
                    </div>
                  </ListItemIcon>

                  <ListItemText primary={
                    <Typography variant='title' className={classes.title}>
                      {game.adventure.title_display}
                    </Typography>
                  } secondary={
                    <Fragment>
                      <Chip avatar={<Avatar><RoomIcon/></Avatar>} label={game.table_name} className={classes.chip} />
                      {game.dm ? (
                        <Fragment>
                          {game.dm.id !== this.props.portalStore.currentUser.profileID ? (
                            <Chip avatar={<Avatar><PersonIcon/></Avatar>} label={GamesStore.getDMName(game)}
                                  onClick={(e) => this.gotoDM(e, game.dm.id)} className={classes.chip}/>
                          ):(
                            <Chip avatar={<Avatar className={classes.currentDM}><PersonIcon/></Avatar>} label={'You run this game'}
                                  onClick={(e) => this.gotoDM(e, game.dm.id)}
                                  className={classNames(classes.chip, classes.currentDM)}/>
                          )}

                        </Fragment>
                      ) : (
                        <Chip color="secondary"
                              variant="outlined"
                              avatar={<Avatar><ExclamationIcon/></Avatar>}
                              label={`The DM can no longer run this game!`}
                              className={classes.chip}/>
                      )}
                    </Fragment>
                  } />

                  <ListItemIcon>
                    <span>{this.spotsLeft(game)} spots left</span>
                  </ListItemIcon>
                  {!game.dm && this.props.portalStore.currentUser.role === 'Dungeon Master' && (
                    <Button variant="outlined" size="small" color="primary" onClick={(e) => this.gotoGameBooking(e, game.id)}>
                      Run a game in this slot
                    </Button>
                  )}
                </Fragment>
              </ListItem>
            ) : (
              <ListItem key={`game-session-slot-${game.id}`}>
                <ListItemIcon>
                  <div style={{textAlign: 'center'}}>
                    <Typography variant="title" style={{marginBottom: 0}}>
                      <CalendarIcon/><br/>
                      {GamesStore.getDateString(game)}
                    </Typography>
                    <Typography component='p'>
                      {GamesStore.getWeekDay(game)}<br/>
                      <strong>{game.timeStart}</strong>
                    </Typography>
                  </div>
                </ListItemIcon>
                <ListItemText primary={
                  <Typography variant='title' className={classes.title}>
                    Empty Slot
                  </Typography>
                } secondary={
                  <Chip avatar={<Avatar><RoomIcon/></Avatar>} label={game.table_name} className={classes.chip} />
                } />
                {this.props.portalStore.currentUser.role === 'Dungeon Master' && (
                  <Button variant="outlined" size="small" color="primary" onClick={(e) => this.gotoGameBooking(e, game.id)}>
                    Run a game in this slot
                  </Button>
                )}
              </ListItem>
            )}
          </Fragment>
        ))}
      </List>
    );
  }
}
