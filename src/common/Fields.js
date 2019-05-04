import withStyles from "@material-ui/core/styles/withStyles";
import React from "react";
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Input from "@material-ui/core/Input/Input";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText/FormHelperText";
import classNames from 'classnames';


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

    const {classes, name, label, onChange, value, type, ...rest} = this.props;

    return (
      <FormControl className={classNames(classes.margin, classes.textField)}>
        <InputLabel htmlFor={`character-create-${name}`}>{label}</InputLabel>
        <Input
          id={`character-create-${name}`}
          value={value}
          onChange={onChange}
          type={type !== undefined ? type : 'text'}
          {...rest}
        />
      </FormControl>
    )
  }
}

@withStyles(styles, {withTheme: true})
export class SelectField extends React.Component {
  render() {

    const {classes, name, label, value, onChange, options, blank, required, helper_text, error} = this.props;

    let htext = '';
    if (error !== undefined && error.length > 0) {
      htext = error;
    }
    else {
      htext = helper_text;
    }

    return (
      <FormControl className={classNames(classes.margin, classes.textField)}
                   required={required !== undefined ? required : false} error={error !== undefined && error.length > 0}>
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
            <MenuItem key={`select-${name}-${option.id}`} value={option.id}>{option.name}</MenuItem>
          ))}
        </Select>
        {htext !== undefined && htext.length > 0 && (<FormHelperText>{htext}</FormHelperText>)}
      </FormControl>
    )
  }
}
