import React, {Fragment} from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import UndecoratedLink from "./UndecoratedLink";
import {inject, observer} from "mobx-react";
import Hidden from "@material-ui/core/Hidden/Hidden";
import Divider from "@material-ui/core/Divider/Divider";

// icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGhost, faUserShield, faUser, faHome,
  faCalendar, faArchive, faIdCard,
  faUserCircle, faUserPlus,
} from '@fortawesome/free-solid-svg-icons'

library.add(faGhost);
library.add(faUser);
library.add(faHome);
library.add(faUserShield);
library.add(faCalendar);
library.add(faArchive);
library.add(faIdCard);
library.add(faUserCircle);
library.add(faUserPlus);


const styles = theme => ({
  root: {
    width: '300px',
    backgroundColor: theme.palette.background.paper,
  },
  link: {
    textDecoration: 'none',
  }
});

@withStyles(styles, {withTheme: true})
@inject('portalStore') @observer
export default class SidebarNavigationList extends React.Component{

  currentProfile(){
    return this.props.portalStore.currentUser;
  }

  isAuth(){
    return this.props.portalStore.isAuthenticated();
  }

  render() {
    const {classes} = this.props;

    return (
      <div className={classes.root}>
        <List component="nav">
          <UndecoratedLink to="/">
            <ListItem button>
              <ListItemIcon>
                <FontAwesomeIcon icon="home" />
              </ListItemIcon>
              <ListItemText primary="Homepage">
              </ListItemText>
            </ListItem>
          </UndecoratedLink>
          <Divider />
          {this.isAuth() && (
            <Fragment>
              <UndecoratedLink to={`/profiles/${this.currentProfile().profileID}`}>
                <ListItem button>
                  <ListItemIcon>
                    <FontAwesomeIcon icon="user-circle" />
                  </ListItemIcon>
                  <ListItemText primary="Your profile">
                  </ListItemText>
                </ListItem>
              </UndecoratedLink>
              <Hidden smUp>
                <UndecoratedLink to={`/characters/create`}>
                  <ListItem button>
                    <ListItemIcon>
                      <FontAwesomeIcon icon="user-plus" />
                    </ListItemIcon>
                    <ListItemText primary="Add new character">
                    </ListItemText>
                  </ListItem>
                </UndecoratedLink>
              </Hidden>
            </Fragment>
          )}
          <UndecoratedLink to="/games">
            <ListItem button>
              <ListItemIcon>
                <FontAwesomeIcon icon="calendar" />
              </ListItemIcon>
              <ListItemText primary="Next Game sessions">
              </ListItemText>
            </ListItem>
          </UndecoratedLink>
          <UndecoratedLink to="/games/archive">
            <ListItem button>
              <ListItemIcon>
                <FontAwesomeIcon icon="archive" />
              </ListItemIcon>
              <ListItemText primary="Games Archive">
              </ListItemText>
            </ListItem>
          </UndecoratedLink>
          <Divider />
          <UndecoratedLink to="/profiles">
            <ListItem button>
              <ListItemIcon>
                <FontAwesomeIcon icon="user" />
              </ListItemIcon>
              <ListItemText primary="League Players">
              </ListItemText>
            </ListItem>
          </UndecoratedLink>
          <UndecoratedLink to="/characters">
            <ListItem button>
              <ListItemIcon>
                <FontAwesomeIcon icon="id-card" />
              </ListItemIcon>
              <ListItemText primary="Characters">
              </ListItemText>
            </ListItem>
          </UndecoratedLink>
        </List>
      </div>
    );
  }
}
