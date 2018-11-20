import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import {NarrowContent} from "../common/Content";
import Typography from "@material-ui/core/Typography/Typography";
import Grid from "@material-ui/core/Grid/Grid";
import {inject, observer} from "mobx-react";
import Button from "@material-ui/core/Button/Button";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import {InputField, SelectField} from "../common/Fields";
import Spinner from "../common/LoadingDiv";

const styles = (theme) => ({
  addButton: {
    marginTop: 20,
    float: 'right',
  }
});


@withStyles(styles, {withTheme: true})
@inject('portalStore') @observer
export default class CharacterEdit extends React.Component {

  state = {
    id: this.props.match.params.id,
    loading: true,
    name: '',
    level: 1,
    notes: '',
    race_pick: '',
    class_pick: '',
    race_pick_error: '',
    class_pick_error: '',
    faction_pick: '',
    buttonDisabled: false,
    buttonText: 'Save changes',
    snackbarOpen: false,
  };

  componentDidMount(){
    this.props.portalStore.getCharacter(this.state.id)
      .then(
        (data) => {
          if(data.owner !== this.props.portalStore.currentUser.profileID){
            this.props.history.push('/');
            return;
          }
          this.setState({
            name: data.name,
            level: data.level,
            notes: data.notes,
            race_pick: data.race,
            class_pick: data.pc_class,
            faction_pick: data.faction === null ? '': data.faction,
            loading: false,
          })
        }
      )
  }


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

  saveCharacter = () => {
    const s = this.state;
    if(this.isFormValid()) {
      this.setState({
        buttonDisabled: true,
        buttonText: 'Saving...',
      });
      this.props.portalStore.saveCharacter(this.state.id, {
        'name': s.name,
        'level': s.level,
        'notes': s.notes,
        'race': s.race_pick,
        'pc_class': s.class_pick,
        'faction': s.faction_pick,
      }).then(response => {
        this.setState({
          buttonDisabled: false,
          buttonText: 'Save changes',
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
        {this.state.loading ? (
            <Spinner loading={this.state.loading} />
          )
          : (
            <div>
              <Typography variant="h6">
                Edit {this.state.name}
              </Typography>

              <Grid container spacing={8}>
                <Grid item xs={12}>
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

                  <InputField name={'notes'} label={'Additional notes / multiclassing / items etc.'}
                              value={this.state.notes}
                              type={'text'}
                              multiline={true}
                              onChange={this.handleChange('notes')}/>

                  <Button variant={'contained'} className={classes.addButton} onClick={this.saveCharacter}
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
                    message={<span id="message-id">Cannot save the character. Check all fields before trying again!</span>}
                  />

                </Grid>
              </Grid>
            </div>
          )}
      </NarrowContent>
    )
  }
}
