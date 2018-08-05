import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Settings from "@material-ui/icons/Settings";
import PermIdentity from "@material-ui/icons/PermIdentity";
import UndecoratedLink from "./UndecoratedLink";


const styles = theme => ({
  root: {
    width: '300px',
    backgroundColor: theme.palette.background.paper,
  },
  link: {
    textDecoration: 'none',
  }
});

function SidebarNavigationList(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <List component="nav">
        <UndecoratedLink to="/profile">
          <ListItem button>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Your profile" >
            </ListItemText>
          </ListItem>
        </UndecoratedLink>
        <UndecoratedLink to="/profiles">
          <ListItem button>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="AL Players" >
            </ListItemText>
          </ListItem>
        </UndecoratedLink>
        <UndecoratedLink to="/characters">
          <ListItem button>
            <ListItemIcon>
              <PermIdentity />
            </ListItemIcon>
            <ListItemText primary="Characters" >
            </ListItemText>
          </ListItem>
        </UndecoratedLink>
      </List>
    </div>
  );
}

SidebarNavigationList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SidebarNavigationList);
