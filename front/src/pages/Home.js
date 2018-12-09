import React, {Fragment} from 'react';
import {inject, observer} from "mobx-react";
import {CurrentDMGamesList, CurrentUserGamesList, DMNotReportedGamesList} from "./GamesList";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import UndecoratedLink from "../common/UndecoratedLink";

import {faDiscord, faFacebook} from '@fortawesome/free-brands-svg-icons'
import {faFile, faFilePdf} from '@fortawesome/free-regular-svg-icons'
library.add(faFacebook, faDiscord, faFilePdf, faFile);

const styles = (theme) => ({
  communityIcon: {
    fontSize: 24
  },
  community: {
    padding: 20,
  },
  root: {
    padding: theme.spacing.unit,
  },
});


@withStyles(styles, { withTheme: true })
@inject('portalStore') @observer
class Home extends React.Component {
  render() {
    const {classes} = this.props;

    return (
      <div className={classes.container}>
        <Grid container>
          <Grid item xs={12} md={8} lg={9}>
          {this.props.portalStore.currentUser ? (
            <Fragment>
                <CurrentUserGamesList/>
                {this.props.portalStore.currentUser.isDM && (
                  <Fragment>
                    <CurrentDMGamesList/>
                    <DMNotReportedGamesList/>
                  </Fragment>
                )}
            </Fragment>
          ) : (
            <div className={classes.root}>
                <Typography variant="h5">
                  Adventure Awaits!
                </Typography>
                <Typography variant="body1" className={classes.info}>
                  Welcome to D&D Adventurers League Kraków service.<br/>
                  Here you can sign up for the games run by our finest Dungeon Masters.<br/>
                  Or maybe you would like to become DM? Sure thing!
                </Typography>
            </div>
          )}
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <div className={classes.community}>
              <Typography variant="h5">
                Join our community
              </Typography>
              <List component="nav">
                <ListItem button onClick={() => window.open('https://www.facebook.com/groups/ALKrakow/')}>
                  <ListItemIcon className={classes.communityIcon}>
                    <FontAwesomeIcon icon={["fab","facebook"]}/>
                  </ListItemIcon>
                  <ListItemText primary="Facebook Group">
                  </ListItemText>
                </ListItem>

                <ListItem button onClick={() => window.open('https://discord.gg/BWYKVxk')}>
                  <ListItemIcon className={classes.communityIcon}>
                    <FontAwesomeIcon icon={["fab","discord"]} />
                  </ListItemIcon>
                  <ListItemText primary="Discord Server">
                  </ListItemText>
                </ListItem>

                <UndecoratedLink to="/terms">
                  <ListItem button>
                    <ListItemIcon className={classes.communityIcon}>
                      <FontAwesomeIcon icon={["far","file"]} />
                    </ListItemIcon>
                    <ListItemText primary="Terms &amp; Conditions">
                    </ListItemText>
                  </ListItem>
                </UndecoratedLink>

                <ListItem button>
                  <ListItemIcon className={classes.communityIcon}>
                    <FontAwesomeIcon icon={["far","file-pdf"]} />
                  </ListItemIcon>
                  <ListItemText primary="Read FAQ">
                  </ListItemText>
                </ListItem>
              </List>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Home;
