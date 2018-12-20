import React from 'react'
import classNames from 'classnames';
import {inject, observer} from "mobx-react";
import {Redirect} from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from "@material-ui/core/Paper/Paper";
import Button from "@material-ui/core/Button/Button";
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Input from "@material-ui/core/Input/Input";
import InputAdornment from "@material-ui/core/InputAdornment/InputAdornment";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {NarrowContent} from "./Content";
import FormHelperText from "@material-ui/core/FormHelperText/FormHelperText";
import Link from "react-router-dom/es/Link";
import {SnackbarContentWrapper} from "./InfoSnackbar";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import UndecoratedLink from "./UndecoratedLink";

const styles = (theme) => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '100%',
  },
  paperContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  submitRow: {
    textAlign: 'right',
  },
  inputMargin: {
    margin: `0`,
  },
  whiteUrl: {
    color: '#fff',
    fontWeight: 'bold',
    textDecoration: 'none',
  }
});


@withStyles(styles, {withTheme:true})
export class RegisterActive extends React.Component {
  render() {
    const {classes} = this.props;
    return (
      <div>
        <SnackbarContentWrapper
          variant="success"
          className={classes.margin}
          message={(<div>Your account has been activated. <Link to="/login" className={classes.whiteUrl}>You can now login</Link></div>)}/>
      </div>
    )
  }
}

@withStyles(styles, { withTheme: true })
@inject('portalStore') @observer
export default class Register extends React.Component {
  state = {
    redirectToReferrer: false,
    isSigning: false,
    isDone: false,
    email: '',
    password: '',
    passwordConfirm: '',
    first_name: '',
    last_name: '',
    nickname: '',
    dci: '',
    terms: null,
    emailErrors: null,
    passwordErrors: null,
    first_nameErrors: null,
    last_nameErrors: null,
    nicknameErrors: null,
    termsErrors: false,
    dciErrors: null,
    signupText: 'Sign up',
    showPassword: false,
  };

  signup = (e) => {
    e.preventDefault();
    if(this.state.password === this.state.passwordConfirm) {
      if(this.state.password.length < 8){
        this.setState({passwordErrors: 'The password should have at least 8 characters.'});
        return;
      }
      if(!this.state.terms){
        this.setState({termsErrors: true});
        return;
      }
      this.setState({
        isSigning: true
      });
      this.props.portalStore.register({
        nickname: this.state.nickname,
        dci: this.state.dci ? this.state.dci : null,
        user: {
          email: this.state.email,
          password: this.state.password,
          first_name: this.state.first_name,
          last_name: this.state.last_name,
        }
      })
        .then(() => {
          this.setState(() => ({
            email: '',
            password: '',
            isSigning: false,
            isDone: true,
          }))
        }).catch(error => {
        const new_state = {
          emailErrors: null,
          passwordErrors: null,
          first_nameErrors: null,
          last_nameErrors: null,
          nicknameErrors: null,
          dciErrors: null,
        };
        const data = error.response.data;
        Reflect.ownKeys(data).forEach(key => {
          if (data[key].constructor.name.toLowerCase() === "object") {
            Reflect.ownKeys(data[key]).forEach(innerKey => {
              new_state[innerKey + 'Errors'] = data[key][innerKey][0];
            })
          }
          else {
            new_state[key + 'Errors'] = data[key][0];
          }
        });
        new_state.isSigning = false;
        this.setState(new_state);
      });
    }
    else {
      this.setState({passwordErrors: "Passwords don't match"});
    }
  };

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleCheckChange = prop => event => {
    this.setState({ [prop]: event.target.checked, [prop+"Errors"]: false});
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  diffPasswords = () => {
    return this.state.passwordConfirm !== '' && (this.state.password === '' || this.state.password !== this.state.passwordConfirm);
  };

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };

    const {classes} = this.props;

    return (
      <NarrowContent>
        {!this.state.isDone && (
          <form className={classes.container} noValidate autoComplete="off" onSubmit={this.signup}>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <h1>Sign up</h1>
                <p>Register in order to access D&D Adventurers League Krakow system and start playing.</p>
              </Grid>
              <Grid item xs={12}>
                <FormControl className={classNames(classes.inputMargin, classes.textField)}>
                  <InputLabel htmlFor="signUp-email">E-mail</InputLabel>
                  <Input
                    id="signUp-email"
                    type="text"
                    error={!!this.state.emailErrors}
                    aria-describedby="email-error-text"
                    value={this.state.email}
                    onChange={this.handleChange('email')}
                  />
                  {this.state.emailErrors && (<FormHelperText id="email-error-text">{this.state.emailErrors}</FormHelperText>)}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                 <FormControl className={classNames(classes.inputMargin, classes.textField)}>
                  <InputLabel htmlFor="signUp-password">Password</InputLabel>
                  <Input
                    id="signUp-password"
                    type={this.state.showPassword ? 'text' : 'password'}
                    value={this.state.password}
                    error={!!this.state.passwordErrors}
                    aria-describedby="password-error-text"
                    onChange={this.handleChange('password')}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Toggle password visibility"
                          onClick={this.handleClickShowPassword}
                          onMouseDown={this.handleMouseDownPassword}
                        >
                          {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                 {this.state.passwordErrors && (<FormHelperText id="password-error-text">{this.state.passwordErrors}</FormHelperText>)}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                 <FormControl className={classNames(classes.inputMargin, classes.textField)}>
                  <InputLabel htmlFor="signUp-password-confirm">Repeat Password</InputLabel>
                  <Input
                    id="signUp-password-confirm"
                    type={this.state.showPassword ? 'text' : 'password'}
                    value={this.state.passwordConfirm}
                    onChange={this.handleChange('passwordConfirm')}
                    error={this.diffPasswords()}
                    aria-describedby="first-name-error-text"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Toggle password visibility"
                          onClick={this.handleClickShowPassword}
                          onMouseDown={this.handleMouseDownPassword}
                        >
                          {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                   {this.diffPasswords() && (<FormHelperText id="first-name-error-text">Passwords don't match!</FormHelperText>)}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                 <FormControl className={classNames(classes.inputMargin, classes.textField)}>
                  <InputLabel htmlFor="signUp-first-name">First name</InputLabel>
                  <Input
                    id="signUp-first-name"
                    type="text"
                    error={!!this.state.first_nameErrors}
                    aria-describedby="last-name-error-text"
                    value={this.state.first_name}
                    onChange={this.handleChange('first_name')}
                  />
                 {this.state.first_nameErrors && (<FormHelperText id="last-name-error-text">{this.state.first_nameErrors}</FormHelperText>)}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                 <FormControl className={classNames(classes.inputMargin, classes.textField)}>
                  <InputLabel htmlFor="signUp-last-name">Last name</InputLabel>
                  <Input
                    id="signUp-last-name"
                    type="text"
                    error={!!this.state.last_nameErrors}
                    aria-describedby="name-error-text"
                    value={this.state.last_name}
                    onChange={this.handleChange('last_name')}
                  />
                 {this.state.last_nameErrors && (<FormHelperText id="name-error-text">{this.state.last_nameErrors}</FormHelperText>)}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                 <FormControl className={classNames(classes.inputMargin, classes.textField)}>
                  <InputLabel htmlFor="signUp-nickname">Nickname</InputLabel>
                  <Input
                    id="signUp-nickname"
                    type="text"
                    value={this.state.nickname}
                    onChange={this.handleChange('nickname')}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                 <FormControl className={classNames(classes.inputMargin, classes.textField)}>
                  <InputLabel htmlFor="signUp-dci">Your DCI</InputLabel>
                  <Input
                    id="signUp-dci"
                    type="number"
                    value={this.state.dci}
                    onChange={this.handleChange('dci')}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.terms}
                      onChange={this.handleCheckChange('terms')}
                      aria-describedby="terms-error-text"
                    />
                  }
                  label={(<div>I agree with <Link to='/terms'>Terms of use</Link></div>)}
                />
                {this.state.termsErrors && (<FormHelperText id="terms-error-text">You cannot register until you agree to our terms.</FormHelperText>)}
              </Grid>
              <Grid item xs={12} className={classes.submitRow}>
                <Button variant="contained"
                        color="primary"
                        type="submit"
                        className={classes.button}
                        disabled={this.state.isSigning}
                        onClick={this.signup}>
                  { this.state.signupText }
                </Button>
              </Grid>
              <Grid item xs={12}>
                <p>Already registered? <Link to="/login">Sign in</Link></p>
                <p>Forgotten password? Go to <Link to="/password-reset">Password Reset Page</Link></p>
              </Grid>
            </Grid>
          </form>
        )}
        {this.state.isDone && (
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <h1>Sign up</h1>
              <p>All set! We have sent you activation e-mail. You won't be able to login until you click the link it contains.</p>
            </Grid>
          </Grid>
        )}
      </NarrowContent>
    )
  }
}
