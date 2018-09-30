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


const styles = theme => ({
  header: {
    marginBottom: theme.spacing.unit,
  },
  formControl: {
    width: '100%',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '100%',
  },
  timeControl: {
    width: 200,
    marginBottom: theme.spacing.unit,
  },
  notesControl: {
    width: '100%',
    marginBottom: theme.spacing.unit,
  },
  button: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  }
});

@withStyles(styles, {withTheme: true})
@inject('portalStore') @observer
class GameBooking extends Component {

  state = {
    adventures: null,
    adventure: '',
    startTime: '17:00',
    notes: '',
    loading: true,
    formValid: false,
  };

  componentDidMount(){
    this.setState({
      loading: true,
    });
    this.props.portalStore.adventures.fetch().then((adventures) => {
      this.setState({
        adventures: adventures,
        loading: false,
      })
    })
  }

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

  render() {
    const {classes} = this.props;

    if(this.state.loading)
      return (
          <LoadingDiv>
            <ClipLoader color={'#FFDE00'} loading={this.state.loading}/>
          </LoadingDiv>
        );
    else
      return (
        <WideContent>
          <Typography variant='display1' className={classes.header}>
            Booking slot for a game
          </Typography>
          <SelectField name={'adventure'} label={'Select Adventure'}
                       value={this.state.adventure}
                       onChange={this.handleChange('adventure')}
                       options={this.state.adventures.map(adventure => ({id: adventure.id, name: adventure.title_display}))}
                       required={true}
          />
          <FormControl className={classes.timeControl}>
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
          <FormControl className={classes.notesControl}>
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
