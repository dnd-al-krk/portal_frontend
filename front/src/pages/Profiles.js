import React from 'react';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
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
import Typography from "@material-ui/core/Typography/Typography";
import {NarrowContent} from "../common/Content";

const styles = theme => ({
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
    this.props.portalStore.fetchProfiles().then(
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

  gotoProfile = (id) => {
    this.props.history.push(`/profiles/${id}`);
  };


  profiles_list() {
    if(this.state.profiles){
      return this.state.profiles.map(profile => {
                return (
                  <ListItem key={profile.id} button onClick={() => this.gotoProfile(profile.id)}>
                    <Avatar>
                      <Person />
                    </Avatar>
                    <ListItemText primary={`${profile.user.first_name} ${profile.user.last_name} (${profile.nickname})`}
                                  secondary={`
                                  ${profile.role} | ${profile.characters_count} characters

                                  `} />
                    <ListItemSecondaryAction>
                      <IconButton aria-label="See profile" onClick={() => this.gotoProfile(profile.id)}>
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
      <NarrowContent>
        <form className={classes.container} noValidate autoComplete="off">
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <Typography variant="title">
                  League players
                </Typography>
                {this.state.loading ? (
                  <LoadingDiv>
                    <ClipLoader color={'#FFDE00'} loading={this.state.loading}  />
                  </LoadingDiv>
                )
                : (
                  <List>
                    { this.profiles_list() }
                  </List>
                )}
              </Grid>
            </Grid>
        </form>
      </NarrowContent>
    );
  }
}

export default Profiles;
