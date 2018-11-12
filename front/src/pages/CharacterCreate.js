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
    race_pick: '',
    class_pick: '',
    race_pick_error: '',
    class_pick_error: '',
    faction_pick: '',
    buttonDisabled: false,
    buttonText: 'Add character',
    snackbarOpen: false,
  };


  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  isFormValid = () => {
    const s = this.state;
    if(s.race_pick.length < 1) { this.setState({race_pick_error: 'No race selected'}); return false; }
    if(s.class_pick.length < 1) return false;
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
        name: s.name,
        level: s.level,
        race: s.race_pick,
        pc_class: s.class_pick,
        faction: s.faction_pick,
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

    const character_races = this.props.portalStore.races;
    const character_classes = this.props.portalStore.classes;
    const character_factions = this.props.portalStore.factions;

    return (
      <NarrowContent>
        <Typography variant="h6">
          Add New Character
        </Typography>

        <Grid container spacing={8}>
          <Grid item xs={12}>
            <form onSubmit={this.addCharacter}>
              <InputField name={'name'} label={'Character name'}
                          value={this.state.name}
                          onChange={this.handleChange('name')}/>
              <InputField name={'level'} label={'Character level'}
                          value={this.state.level}
                          type={'number'}
                          onChange={this.handleChange('level')}/>

              <SelectField name={'race_pick'} label={'Character Race'}
                           value={this.state.race_pick}
                           onChange={this.handleChange('race_pick')}
                           options={character_races}
                           required={true} error={this.state.race_pick_error}
              />

              <SelectField name={'class_pick'} label={'Character Class'}
                           value={this.state.class_pick}
                           onChange={this.handleChange('class_pick')}
                           options={character_classes}
                           required={true} error={this.state.class_pick_error}
              />

              <SelectField name={'faction_pick'} label={'Character Faction'}
                           value={this.state.faction_pick}
                           onChange={this.handleChange('faction_pick')}
                           options={character_factions}
                           blank={true}
              />

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
