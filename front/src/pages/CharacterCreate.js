import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import {NarrowContent} from "../common/Content";
import Typography from "@material-ui/core/Typography/Typography";
import Grid from "@material-ui/core/Grid/Grid";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Input from "@material-ui/core/Input/Input";
import FormControl from "@material-ui/core/FormControl/FormControl";
import classNames from 'classnames';
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Select from "@material-ui/core/Select/Select";
import {inject, observer} from "mobx-react";

const styles = (theme) => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '100%',
  },
  margin: {
    margin: theme.spacing.unit,
  },

  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});

@withStyles(styles, {withTheme: true})
export  class InputField extends React.Component {
  render(){

    const {classes, name, label, onChange, value, type} = this.props;

    return (
      <FormControl className={classNames(classes.margin, classes.textField)}>
        <InputLabel htmlFor={`character-create-${name}`}>{label}</InputLabel>
        <Input
          id={`character-create-${name}`}
          value={value}
          onChange={onChange}
          type={type !== undefined ? type : 'text'}
        />
      </FormControl>
    )
  }
}

@withStyles(styles, {withTheme: true})
export class SelectField extends React.Component {
  render() {

    const {classes, name, label, value, onChange, options, blank} = this.props;

    return (
      <FormControl className={classNames(classes.margin, classes.textField)}>
        <InputLabel htmlFor={`${name}-select`}>{label}</InputLabel>
        <Select
          value={value}
          onChange={onChange}
          inputProps={{
            name: `${name}`,
            id: `${name}-select`,
          }}
        >
          {(blank !== undefined && blank === true) && (
            <MenuItem value=''>None</MenuItem>
          )}
          {options.map(option => (
            <MenuItem key={`select-${name}-{$option-id}`} value={option.id}>{option.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    )
  }
}

@withStyles(styles, {withTheme: true})
@inject('portalStore') @observer
export default class CharacterCreate extends React.Component {

  state = {
    name: '',
    level: 1,
    race_pick: '',
    class_pick: '',
    faction_pick: '',
  };


  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  render() {
    const {classes} = this.props;

    const character_races = this.props.portalStore.races;
    const character_classes = this.props.portalStore.classes;
    const character_factions = this.props.portalStore.factions;

    return (
      <NarrowContent>
        <Typography variant={'title'}>
          Add New Character
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
            />

            <SelectField name={'class_pick'} label={'Character Class'}
                         value={this.state.class_pick}
                         onChange={this.handleChange('class_pick')}
                         options={character_classes}
            />

            <SelectField name={'faction_pick'} label={'Character Faction'}
                         value={this.state.faction_pick}
                         onChange={this.handleChange('faction_pick')}
                         options={character_factions}
                         blank={true}
            />

          </Grid>
        </Grid>
      </NarrowContent>
    )
  }
}
