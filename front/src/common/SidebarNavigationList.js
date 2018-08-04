import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Notifications from "@material-ui/icons/Notifications";
import Settings from "@material-ui/icons/Settings";
import PermIdentity from "@material-ui/icons/PermIdentity";
import ScreenShare from "@material-ui/icons/ScreenShare";
import { Link } from 'react-router-dom';
import styled from 'styled-components';


const styles = theme => ({
  root: {
    width: '300px',
    backgroundColor: theme.palette.background.paper,
  },
  link: {
    textDecoration: 'none',
  }
});


const StyledLink = styled(Link)`
    text-decoration: none;

    &:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: none;
    }
`;


function SidebarNavigationList(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <List component="nav">
        <StyledLink to="/profile">
          <ListItem button>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Profile Settings" >
            </ListItemText>
          </ListItem>
        </StyledLink>
        <StyledLink to="/characters">
          <ListItem button>
            <ListItemIcon>
              <PermIdentity />
            </ListItemIcon>
            <ListItemText primary="Characters" >
            </ListItemText>
          </ListItem>
        </StyledLink>
      </List>
    </div>
  );
}

SidebarNavigationList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SidebarNavigationList);
