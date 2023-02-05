import React from 'react'
import classNames from 'classnames';
import {inject, observer} from "mobx-react";
import {Redirect} from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from "@material-ui/core/Button/Button";
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Input from "@material-ui/core/Input/Input";
import {NarrowContent} from "../common/Content";
import Link from "react-router-dom/es/Link";


const styles = (theme) => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
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
});


@withStyles(styles, { withTheme: true })
@inject('portalStore') @observer
export default class PasswordReset extends React.Component {
  state = {
    redirectToReferrer: false,
    isSigning: false,
    done: false,
    email: '',
    buttonText: 'Reset Password',
    showPassword: false,
    errors: null,
  };

  reset = (e) => {
    e.preventDefault();
    this.setState({
      isSigning: true
    });
    this.props.portalStore.sendPasswordReset(this.state.email)
      .then(() => {
        this.setState(() => ({
          done: true,
          isSigning: false
        }))
      }).catch((error) => {
        if(error.response.status === 400){
          this.setState({
            errors: error.response.data.email,
            isSigning: false,
          })
        }
    });
  };

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  render() {
    const {classes} = this.props;

    return (
      <NarrowContent>
        {this.state.done ? (
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <h1>Reset your password</h1>
                <p>Check your e-mail. We have sent you password reset link.</p>
              </Grid>
            </Grid>
          ): (
          <form className={classes.container} noValidate autoComplete="off">
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <h1>Reset your password</h1>
                <p>If you have forgotten your password, you can reset it. Put your login e-mail address below. We will
                  send you password reset link to it.</p>
              </Grid>
              <Grid item xs={12}>
                <FormControl className={classNames(classes.inputMargin, classes.textField)}>
                  <InputLabel htmlFor="signIn-email">E-mail</InputLabel>
                  <Input
                    id="signIn-email"
                    type="text"
                    value={this.state.email}
                    onChange={this.handleChange('email')}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} className={classes.errors}>
                {this.state.errors}
              </Grid>
              <Grid item xs={12} className={classes.submitRow}>
                <Button variant="contained"
                        color="primary"
                        type="submit"
                        className={classes.button}
                        disabled={this.state.isSigning}
                        onClick={this.reset}>
                  {this.state.buttonText}
                </Button>
              </Grid>
              <Grid item xs={12}>
                No account yet? <Link to='/register'>Sign up!</Link>
              </Grid>
            </Grid>
          </form>)
        }
      </NarrowContent>
    )
  }
}
