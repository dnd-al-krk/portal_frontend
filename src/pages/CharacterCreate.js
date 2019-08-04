import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import {NarrowContent} from "../common/Content";
import Typography from "@material-ui/core/Typography/Typography";
import Grid from "@material-ui/core/Grid/Grid";
import {inject, observer} from "mobx-react";
import Button from "@material-ui/core/Button/Button";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import {InputField, SelectField} from "../common/Fields";

const styles = (theme) => ({
  addButton: {
    marginTop: 20,
    float: 'right',
  }
});


@withStyles(styles, {withTheme: true})
@inject('portalStore') @observer
export default class CharacterCreate extends React.Component {

  state = {
    name: '',
    level: 1,
    race: '',
    class: '',
    race_error: '',
    class_error: '',
    faction: '',
    notes: '',
    dead: 0,
    buttonDisabled: false,
    buttonText: 'Add character',
    snackbarOpen: false,
  };


  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  isFormValid = () => {
    const s = this.state;
    if(s.race.length < 1) { this.setState({race_error: 'No race selected'}); return false; }
    if(s.class.length < 1) return false;
    if(s.level > 20 || s.level < 1) return false;
    return s.name.length > 0;
  };

  addCharacter = (e) => {
    e.preventDefault();
    const s = this.state;
    if(this.isFormValid()) {
      this.setState({
        buttonDisabled: true,
        buttonText: 'Adding...',
      });
      this.props.portalStore.createCharacter({
        'name': s.name,
        'level': s.level,
        'race': s.race,
        'pc_class': s.class,
        'faction': s.faction,
        'notes': s.notes,
      }).then(response => {
        this.setState({
          buttonDisabled: false,
          buttonText: 'Add character',
        });
        this.props.history.push('/profiles/' + this.props.portalStore.currentUser.profileID);
      });
    }
    else {
      this.setState({
        snackbarOpen: true,
      });
    }
  };

  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({
        snackbarOpen: false,
      });
  };

  render() {
    const {classes} = this.props;

    return (
      <NarrowContent>
        <Typography variant="h6">
          Add New Character
        </Typography>
        <Typography variant='body1'>
          In order to sign up for a game session slot, you need to select one of your characters. Here you can create
          your character. Provided information may be useful for the Dungeon Master to prepare a game for you.
        </Typography>

        <Grid container spacing={8}>
          <Grid item xs={12}>
            <form onSubmit={this.addCharacter}>
              <InputField name={'name'} label={'Character name'}
                          value={this.state.name}
                          onChange={this.handleChange('name')}/>
              <InputField name={'level'} label={'Character total level'}
                          value={this.state.level}
                          type={'number'}
                          onChange={this.handleChange('level')}/>

              <InputField name={'race'} label={'Character Race'}
                           value={this.state.race}
                           onChange={this.handleChange('race')}
                           required={true}
              />

              <InputField name={'class'} label={'Character Class'}
                           value={this.state.class}
                           onChange={this.handleChange('class')}
                           required={true}
              />

              <InputField name={'faction'} label={'Character Faction'}
                           value={this.state.faction}
                           onChange={this.handleChange('faction')}
              />

              <InputField name={'notes'} label={'Additional notes / multiclassing / items etc.'}
                value={this.state.notes}
                type={'text'}
                multiline={true}
                onChange={this.handleChange('notes')}/>


              <Button variant={'contained'} className={classes.addButton} onClick={this.addCharacter} type='submit'
                      disabled={this.state.buttonDisabled}>
                {this.state.buttonText}
              </Button>

              <Snackbar
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                open={this.state.snackbarOpen}
                onClose={this.handleSnackbarClose}
                autoHideDuration={6000}
                ContentProps={{
                  'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">Cannot add new character. Fill in all required fields and check their values!</span>}
              />
            </form>
          </Grid>
        </Grid>
      </NarrowContent>
    )
  }
}
