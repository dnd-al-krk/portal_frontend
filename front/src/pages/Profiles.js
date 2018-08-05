import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from "@material-ui/core/Paper/Paper";
import Button from "@material-ui/core/Button/Button";
import {inject, observer} from "mobx-react/index";

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: '0px 50px',
  },
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
});


@withStyles(styles, { withTheme: true })
@inject('portalStore') @observer
class Account extends React.Component {

  SAVE_TEXT = 'Save';

  state = {
    loading: true,
  };

  componentDidMount(){
    this.setStateFromStore();
  }

  setStateFromStore = () => {
    this.props.portalStore.fetch_profiles().then(
      () => {

      },
      () => {

      }
    );

    this.setState(new_state);
  };

  saveData = () => {
    this.setState({
      is_saving: true,
      save_text: 'Saving...'
    });

    this.props.portalStore.currentUser.first_name = this.state.first_name;
    this.props.portalStore.currentUser.last_name = this.state.last_name;
    this.props.portalStore.currentUser.nickname = this.state.nickname;
    this.props.portalStore.currentUser.dci = this.state.dci;

    this.props.portalStore.currentUser.saveData().then((response) => {
      this.setState({
        is_saving: false,
        save_text: this.SAVE_TEXT
      })
    });
  };

  render() {

    const {classes} = this.props;

    return (
      <div className={classes.root}>
        <form className={classes.container} noValidate autoComplete="off">
            <Grid container spacing={24}>
              <Grid item xs={12}>
                List goes here
              </Grid>
            </Grid>
        </form>
      </div>
    );
  }
}

export default Account;
