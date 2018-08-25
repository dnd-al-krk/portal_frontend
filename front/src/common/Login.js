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


const styles = (theme) => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '90%',
  },
  paperContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  submitRow: {
    textAlign: 'right',
  },
  margin: {
    margin: theme.spacing.unit,
  },
});


@withStyles(styles, { withTheme: true })
@inject('portalStore') @observer
class Login extends React.Component {
  state = {
    redirectToReferrer: false,
    isSigning: false,
    email: '',
    password: '',
    signinText: 'Sign in',
    showPassword: false,
  };

  login = () => {
    this.setState({
      isSigning: true
    });
    this.props.portalStore.login(this.state.email, this.state.password)
      .then(() => {
        this.setState(() => ({
          redirectToReferrer: true,
          email: '',
          password: '',
          isSigning: false
        }))
      });
  };

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer === true) {
      return <Redirect to={from} />
    }

    const {classes} = this.props;

    return (
      <NarrowContent>
        <form className={classes.container} noValidate autoComplete="off">
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <h1>Sign in</h1>
              <p>You must log in to view the page</p>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl className={classNames(classes.margin, classes.textField)}>
                <InputLabel htmlFor="signIn-email">E-mail</InputLabel>
                <Input
                  id="signIn-email"
                  type="text"
                  value={this.state.email}
                  onChange={this.handleChange('email')}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
               <FormControl className={classNames(classes.margin, classes.textField)}>
                <InputLabel htmlFor="signIn-password">Password</InputLabel>
                <Input
                  id="signIn-password"
                  type={this.state.showPassword ? 'text' : 'password'}
                  value={this.state.password}
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
              </FormControl>
            </Grid>
            <Grid item xs={12} className={classes.submitRow}>
              <Button variant="contained"
                      color="primary"
                      className={classes.button}
                      disabled={this.state.isSigning}
                      onClick={this.login}>
                { this.state.signinText }
              </Button>
            </Grid>
          </Grid>
        </form>
      </NarrowContent>
    )
  }
}

export default Login;
