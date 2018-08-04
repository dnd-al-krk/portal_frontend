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
class Profile extends React.Component {

  SAVE_TEXT = 'Save';

  state = {
    first_name: '',
    last_name: '',
    nickname: '',
    dci: '',
    is_saving: false,
    save_text: this.SAVE_TEXT,
  };

  componentDidMount(){
    this.setStateFromStore();
  }

  setStateFromStore = () => {
    const store = this.props.portalStore.currentUser;
    let new_state = {
      first_name: store.first_name,
      last_name: store.last_name,
      nickname: store.nickname,
      dci: store.dci,
    };
    console.log(new_state);
    this.setState(new_state);
  };

  saveData = () => {
    console.log(this.state);
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
          <Paper className={classes.paperContainer}>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <h1>Change profile settings</h1>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="name"
                  label="First Name"
                  className={classes.textField}
                  value={this.state.first_name}
                  onChange={(event) => this.setState({first_name: event.target.value})}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="name"
                  label="Last Name"
                  className={classes.textField}
                  value={this.state.last_name}
                  onChange={(event) => this.setState({last_name: event.target.value})}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="name"
                  label="Nickname"
                  className={classes.textField}
                  value={this.state.nickname}
                  onChange={(event) => this.setState({nickname: event.target.value})}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="name"
                  label="DCI"
                  className={classes.textField}
                  value={this.state.dci}
                  onChange={(event) => this.setState({dci: event.target.value})}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} className={classes.submitRow}>
                <Button variant="contained"
                        color="primary"
                        className={classes.button}
                        disabled={this.state.is_saving}
                        onClick={(event) => this.saveData()}>
                  { this.state.save_text }
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </form>
      </div>
    );
  }
}

export default Profile;
