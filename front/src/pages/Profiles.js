import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from "@material-ui/core/Paper/Paper";
import Button from "@material-ui/core/Button/Button";
import {inject, observer} from "mobx-react/index";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import Avatar from "@material-ui/core/Avatar/Avatar";
import Person from "@material-ui/icons/Person";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton/IconButton";
import { ClipLoader } from 'react-spinners';
import LoadingDiv from "../common/LoadingDiv";

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
class Profiles extends React.Component {

  state = {
    profiles: [],
    loading: true,
  };

  componentDidMount(){
    this.setStateFromStore();
  }

  setStateFromStore = () => {
    this.props.portalStore.fetch_profiles().then(
      (data) => {
        this.setState({
          profiles: data,
          loading: false,
        });
      },
      () => {
        this.setState({
          profiles: [],
          loading: false,
        })

      }
    );
  };


  profiles_list() {
    if(this.state.profiles){
      return this.state.profiles.map(profile => {
                return (
                  <ListItem key={profile.id}>
                    <Avatar>
                      <Person />
                    </Avatar>
                    <ListItemText primary={`${profile.user.first_name} ${profile.user.last_name} (${profile.nickname})`}
                                  secondary="
                                  0 characters |
                                  5 games played |
                                  Dungeon Master" />
                    <ListItemSecondaryAction>
                      <IconButton aria-label="See profile">
                        <ChevronRightIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                )
              })
    }
  }


  render() {

    const {classes} = this.props;

    return (
      <div className={classes.root}>
        <form className={classes.container} noValidate autoComplete="off">
            <Grid container spacing={24}>
              <Grid item xs={12}>
                {this.state.loading && (
                  <LoadingDiv>
                    <ClipLoader color={'#FFDE00'} loading={this.state.loading}  />
                  </LoadingDiv>
                )}
                {!this.state.loading && (
                  <List>
                    { this.profiles_list() }
                  </List>
                )}
              </Grid>
            </Grid>
        </form>
      </div>
    );
  }
}

export default Profiles;
