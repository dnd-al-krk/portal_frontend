import React, {Fragment} from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Settings from "@material-ui/icons/Settings";
import AccountCircle from "@material-ui/icons/AccountCircle";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PermIdentity from "@material-ui/icons/PermIdentity";
import UndecoratedLink from "./UndecoratedLink";
import {inject, observer} from "mobx-react";
import Hidden from "@material-ui/core/Hidden/Hidden";
import Divider from "@material-ui/core/Divider/Divider";


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
          {this.isAuth() && (
            <Fragment>
              <UndecoratedLink to={`/profiles/${this.currentProfile().profileID}`}>
                <ListItem button>
                  <ListItemIcon>
                    <AccountCircle/>
                  </ListItemIcon>
                  <ListItemText primary="Your profile">
                  </ListItemText>
                </ListItem>
              </UndecoratedLink>
              <Hidden smUp>
                <UndecoratedLink to={`/characters/create`}>
                  <ListItem button>
                    <ListItemIcon>
                      <PersonAddIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Add new character">
                    </ListItemText>
                  </ListItem>
                </UndecoratedLink>
              </Hidden>
              <Divider />
            </Fragment>
          )}
          <UndecoratedLink to="/profiles">
            <ListItem button>
              <ListItemIcon>
                <Settings/>
              </ListItemIcon>
              <ListItemText primary="AL Players">
              </ListItemText>
            </ListItem>
          </UndecoratedLink>
          <UndecoratedLink to="/games">
            <ListItem button>
              <ListItemIcon>
                <Settings/>
              </ListItemIcon>
              <ListItemText primary="Game sessions">
              </ListItemText>
            </ListItem>
          </UndecoratedLink>
          <UndecoratedLink to="/characters">
            <ListItem button>
              <ListItemIcon>
                <PermIdentity/>
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
