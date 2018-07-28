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


const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
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
  },
  logo: {
    height: '50px',
  },
};


@inject('navigationStore') @observer
class TopAppBar extends React.Component {
  state = {
    auth: true,
    anchorEl: null,
    drawerMenu: true,
  };

  handleChange = (event, checked) => {
    this.setState({ auth: checked });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  toggleDrawer = () => {
    this.props.navigationStore.toggleDrawer();
  };


  render() {
    const { classes } = this.props;

    const sideList = (
      <div>
        <SidebarNavigationList />
      </div>
    );

    return (
      <div>
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

            {/*{auth && (*/}
              {/*<div style={{ position: 'absolute', right: '15px' }}>*/}
                {/*<IconButton*/}
                  {/*aria-owns={open ? 'menu-appbar' : null}*/}
                  {/*aria-haspopup="true"*/}
                  {/*onClick={this.handleMenu}*/}
                  {/*color="inherit"*/}
                {/*>*/}
                  {/*<AccountCircle />*/}
                {/*</IconButton>*/}
                {/*<Menu*/}
                  {/*id="menu-appbar"*/}
                  {/*anchorEl={anchorEl}*/}
                  {/*anchorOrigin={{*/}
                    {/*vertical: 'top',*/}
                    {/*horizontal: 'right',*/}
                  {/*}}*/}
                  {/*transformOrigin={{*/}
                    {/*vertical: 'top',*/}
                    {/*horizontal: 'right',*/}
                  {/*}}*/}
                  {/*open={open}*/}
                  {/*onClose={this.handleClose}*/}
                {/*>*/}
                  {/*<MenuItem onClick={this.handleClose}>Account settings</MenuItem>*/}
                  {/*<MenuItem onClick={this.handleClose}>Logout</MenuItem>*/}
                {/*</Menu>*/}
              {/*</div>*/}
            {/*)}*/}
          </Toolbar>
        </AppBar>

        <Drawer open={this.props.navigationStore.drawerStatus} onClose={this.toggleDrawer}>
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
