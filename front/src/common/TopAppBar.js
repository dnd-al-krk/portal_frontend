import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {observer, inject} from 'mobx-react';
import { Link } from 'react-router-dom';

import Drawer from '@material-ui/core/Drawer';

import dnd_logo_wide from '../images/dnd_logo_wide.png';

import SidebarNavigationList from "./SidebarNavigationList";
import Menu from "@material-ui/core/Menu/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import UndecoratedLink from "./UndecoratedLink";
import {withRouter} from "react-router";
import Button from "@material-ui/core/Button/Button";


const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    position: 'absolute',
    left: '-5px',
  },
  toolbar: {
    padding: 0,
    height: '48px',
    minHeight: '48px',
  },
  appBar: {
    backgroundColor: '#333',
    height: '48px',
    minHeight: '48px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    flexGrow: 1,
  },
  logo: {
    height: '50px',
  },
  rightNav: {
    position: 'absolute',
    right: '15px',
  }
});


@withRouter
@inject('portalStore') @observer
class TopAppBar extends React.Component {
  state = {
    auth: true,
    accountAnchorEl: null,
    anonymousAnchorEl: null,
    drawerMenu: true,
  };

  handleMenu = element => event => {
    this.setState({ [element]: event.currentTarget });
  };

  handleClose = element => () => {
    this.setState({ [element]: null });
  };

  toggleDrawer = () => {
    this.props.portalStore.navigationStore.toggleDrawer();
  };

  logout = () => {
    this.handleClose();
    this.props.portalStore.signOut();
    this.props.history.push('/');
  };

  isAuthenticated = () => {
    return this.props.portalStore.isAuthenticated();
  };

  gotoLogin = () => {
    this.props.history.push('/login')
  };

  render() {
    const { classes } = this.props;

    const sideList = (
      <div>
        <SidebarNavigationList />
      </div>
    );

    const accountOpen = Boolean(this.state.accountAnchorEl);
    const anonymousOpen = Boolean(this.state.anonymousAnchorEl);

    return (
      <div className={classes.root}>
        <AppBar className={ classes.appBar }>
          <Toolbar className={ classes.toolbar }>
            <Link to="/" className={ classes.link }>
            <Typography variant="title" color="inherit">
              <img src={ dnd_logo_wide } className={classes.logo} alt="logo" />
            </Typography>
            </Link>

            <IconButton color="inherit" className={ classes.menuButton } aria-label="Menu"
            onClick={this.toggleDrawer}>
              <MenuIcon />
            </IconButton>

            {!this.isAuthenticated() && (
              <div className={classes.rightNav}>
                <Button color="inherit" onClick={this.gotoLogin}>Login</Button>
                {/* TODO: Add once signup form is ready*/}
                {/*<Button color="inherit">Sign up</Button>*/}
              </div>
            )}

            {this.isAuthenticated() && (
              <div className={classes.rightNav}>
                <IconButton
                  aria-owns={accountOpen ? 'menu-appbar' : null}
                  aria-haspopup="true"
                  onClick={this.handleMenu('accountAnchorEl')}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={this.state.accountAnchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={accountOpen}
                  onClose={this.handleClose('accountAnchorEl')}
                >
                  <UndecoratedLink to='/account' className={classes.routeLink}>
                    <MenuItem onClick={this.handleClose('accountAnchorEl')}>
                      Account settings
                    </MenuItem>
                  </UndecoratedLink>
                  <MenuItem onClick={this.logout}>Logout</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>

        <Drawer open={this.props.portalStore.navigationStore.drawerStatus} onClose={this.toggleDrawer}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer}
            onKeyDown={this.toggleDrawer}
          >
            {sideList}
          </div>
        </Drawer>
      </div>

    );
  }
}

TopAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(TopAppBar);
