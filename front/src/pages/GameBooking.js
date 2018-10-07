import React, {Component} from 'react';
import Typography from "@material-ui/core/Typography/Typography";
import {WideContent} from "../common/Content";
import LoadingDiv from "../common/LoadingDiv";
import {ClipLoader} from "react-spinners";
import withStyles from "@material-ui/core/styles/withStyles";
import {inject, observer} from "mobx-react";
import FormControl from "@material-ui/core/FormControl/FormControl";
import {SelectField} from "../common/Fields";
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import classNames from 'classnames';
import LocationIcon from '@material-ui/icons/LocationOn';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import {dateToString, weekdayOf} from "../utils";


const styles = theme => ({
  header: {
    marginBottom: theme.spacing.unit,
  },
  info: {
    marginRight: 10
  },
  infoIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  formControl: {
    width: '100%',
  },
  textField: {
    marginRight: theme.spacing.unit,
    width: '100%',
  },
  field: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  timeControl: {
    width: 200,
    marginBottom: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  notesControl: {
    width: '100%',
    marginBottom: theme.spacing.unit,
  },
  button: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  spotsControl: {
    marginLeft: theme.spacing.unit,
  },
  endTimeControl: {
    marginRight: theme.spacing.unit,
  },
});

@withStyles(styles, {withTheme: true})
@inject('portalStore') @observer
class GameBooking extends Component {

  state = {
    adventures: [],
    adventure: '',
    startTime: '',
    endTime: '',
    spots: 0,
    gameID: null,
    game: null,
    notes: '',
    loading: true,
    formValid: false,
    gameAlreadyBooked: false,
  };

  componentDidMount(){
    this.setState({
      loading: true,
    });
    Promise.all([this.getGame(), this.fetchAdventures()]).then((data) => {
      this.setState({
        loading: false,
      })
    });
  }

  getGame = () => {
    return this.props.portalStore.games.get(this.props.match.params.id).then(game => {
      if(game.dm !== null){
        this.setState({
          gameAlreadyBooked: true,
        })
      }
      else {
        this.setState({
          startTime: game.time_start,
          spots: game.spots,
          gameID: this.props.match.params.id,
          game: game,
        })
      }
    })
  };

  bookGame = () => {
    const data = {
      time_start: this.state.startTime,
      time_end: this.state.endTime ? this.state.endTime : null,
      adventure: this.state.adventure,
      notes: this.state.notes,
      spots: this.state.spots,
    };
    this.props.portalStore.games.book(this.props.match.params.id, data).then(() => {
      // TODO: Go to the booked game page, but for now simply return to the list
      this.props.history.push('/games');
    });
  };

  fetchAdventures = () => {
    return this.props.portalStore.adventures.fetch().then((adventures) => {
      this.setState({
        adventures: adventures,
      })
    });
  };


  handleChange = prop => event => {
    const value = event.target.value;
    this.setState({
      [prop]: value,
    });
    if(prop === 'adventure')
      this.setState({
        formValid: value !== '',
      })
  };

  handleSpotsChange = event => {
    const new_value = event.target.value;
    if(new_value <= this.state.game.max_spots && new_value > 3)
      this.handleChange('spots')(event);
  };

  gameDate = () => {
    const date = new Date(this.state.game.date);
    const dateString = dateToString(date);
    const day = weekdayOf(date);
    return `${dateString}, ${day}`;
  };

  render() {
    const {classes} = this.props;

    if(this.state.loading)
      return (
          <LoadingDiv>
            <ClipLoader color={'#FFDE00'} loading={this.state.loading}/>
          </LoadingDiv>
        );
    else
      if(this.state.gameAlreadyBooked){
        return (
          <WideContent>
            <Typography variant='display1' className={classes.header}>
              This game is already booked. Sorry!
            </Typography>
          </WideContent>
        )
      }
      return (
        <WideContent>
          <Typography variant='display1' className={classes.header}>
            Booking slot for a game
          </Typography>
          <Typography variant="body1" className={classes.header}>
            <span className={classes.info}>
              <CalendarIcon className={classes.infoIcon}/>{this.gameDate()}
            </span>
            <span className={classes.info}>
              <LocationIcon className={classes.infoIcon}/> {this.state.game.table_name}
            </span>
          </Typography>
          <SelectField name={'adventure'} label={'Select Adventure'}
                       value={this.state.adventure}
                       onChange={this.handleChange('adventure')}
                       options={this.state.adventures.map(adventure => ({id: adventure.id, name: adventure.title_display}))}
                       required={true}
          />
          <FormControl className={classNames([classes.field, classes.timeControl])}>
            <TextField
              id="startTime"
              label="Starting time"
              type="time"
              onChange={this.handleChange('startTime')}
              value={this.state.startTime}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 900, // 15 min
              }}
            />
          </FormControl>
          <FormControl className={classNames([classes.field, classes.timeControl, classes.endTimeControl])}>
            <TextField
              id="endTime"
              label="Estimated end time"
              type="time"
              onChange={this.handleChange('endTime')}
              value={this.state.endTime}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 900, // 15 min
              }}
            />
          </FormControl>
          <FormControl className={classNames([classes.field, classes.spotsControl])}>
            <TextField
              id="spots"
              label="Maximum players spots"
              onChange={this.handleSpotsChange}
              type="number"
              helperText={`Maximum spots for the table: ${this.state.game.max_spots}`}
              value={this.state.spots}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
          <FormControl className={classNames([classes.field, classes.notesControl])}>
            <TextField
              id="notes"
              label="Notes for players"
              type="text"
              value={this.state.notes}
              onChange={this.handleChange('notes')}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
          <Button variant="contained" color="secondary" className={classes.button}
                  onClick={this.bookGame} disabled={!this.state.formValid}>
            Book game slot
          </Button>
        </WideContent>
      );
  }
}

export default GameBooking;
