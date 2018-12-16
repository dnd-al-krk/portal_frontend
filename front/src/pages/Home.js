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
import classNames from 'classnames';
import allogo from '../images/DnD_ADVL.png';
import cover from '../images/dnd_cover.jpg';
import teamIllustration from '../images/ill1.jpg';
import Image from 'material-ui-image'


import {faDiscord, faFacebook} from '@fortawesome/free-brands-svg-icons'
import {faFile, faFilePdf} from '@fortawesome/free-regular-svg-icons'
import {Link} from "react-router-dom";
import Divider from "@material-ui/core/Divider/Divider";
library.add(faFacebook, faDiscord, faFilePdf, faFile);

const styles = (theme) => ({
  communityIcon: {
    fontSize: 24
  },
  community: {
    padding: 20,
  },
  root: {
    padding: theme.spacing.unit*2,
  },
  centered: {
    textAlign: 'center'
  },
  mainHeader: {
    marginTop: 36,
    marginBottom: 24
  },
  textHeader: {
    marginTop: 24,
    marginBottom: 12
  },
  info: {
    marginBottom: 12
  },
  strong: {
    fontWeight: 'bold',
  },
  cover: {
    width: '100%',
  },
  imageRight: {
    width: '100%',
    marginBottom: 12,
    [theme.breakpoints.up('sm')]: {
      maxWidth: 280,
      float: 'right',
      marginLeft: 12,
    },
  },
  ALLogo: {
    width: '100%',
    padding: '0 10px',
    [theme.breakpoints.up('sm')]: {
      width: '400px'
    },
  },
  textDivider: {
    marginTop: 24,
    marginBottom: 12,
  }
});


@withStyles(styles, { withTheme: true })
@inject('portalStore') @observer
class Home extends React.Component {

  openUrl = e => {
    e.preventDefault();
    window.open(e.target.href);
  };

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
              <div className={classes.centered}>
                <img src={allogo} className={classes.ALLogo}/>
                <Typography variant="h4" className={classes.mainHeader}>
                  Welcome to the League in Kraków!
                </Typography>
              </div>
              <Typography variant="body1" className={classNames(classes.info, classes.strong)}>
                This is the official website of the Dungeons &amp; Dragons Adventurers League Kraków group. Here you will find other
                players and Dungeon Masters from Kraków, who are playing together D&D 5e games <a href="http://locator.wizards.com/#brand=magic&a=location&p=Krak%C3%B3w,+Poland&c=50.06465009999999,19.94497990000002&massmarket=no&loc=376610&orgid=14492&addrid=376610" onClick={this.openUrl}>under the official WPN</a>
              </Typography>
              <Typography variant="h5" className={classNames(classes.textHeader)}>
                What is the Adventurers League?
              </Typography>
              <Typography variant="body1" className={classes.info}>
                The D&D Adventurers League is an ongoing official campaign for Dungeons & Dragons (fifth edition rules) and a diverse and vibrant community of gamers. You can play D&D Adventurers League games literally anywhere – at your friendly local game shop, at conventions, and even in the privacy of your own home. Unique to organized play, the heroes you create in the Adventurers League follow you wherever you go, making friends and memories in the Forgotten Realms as you do the same at the table.
              </Typography>
              <Typography variant="body1" className={classes.info}>
If you are completely new to Dungeons & Dragons, the D&D Adventurers League is a wonderful way to introduce yourself to this storytelling game. New players and old will find these links most useful when starting as a player in the Adventurers League:
              </Typography>
              <Typography variant="body1" className={classes.info}>
                <a href="http://dndadventurersleague.org/start-here/playing/" onClick={this.openUrl}>Read more at the official Adventurers League website.</a>
              </Typography>
              <img src={cover} className={classes.cover}/>
              <Typography variant="h5" className={classes.textHeader}>
                Games in Kraków
              </Typography>
              <Typography variant="body1" className={classes.info}>
                We are running organized play regularly every week. Our games are hosted mainly on Tuesdays, Saturdays and Sundays. All games are hosted by <a href="https://www.facebook.com/rlyehcafe/" onClick={this.openUrl}>R'lyeh Cafe</a> and organized by our community with help of <a href="https://dragonus.pl/" onClick={this.openUrl}>Dragonus Store</a>. Are new-comers are always welcome. You don't need to know the game rules, you don't need to be tabletop RPG player yet. Our players and DMs are open to help you with the first steps.
              </Typography>
              <Typography variant="body1" className={classes.info}>
                Join our community <a href="https://www.facebook.com/groups/ALKrakow/" onClick={this.openUrl}>group on facebook</a> or <a href="https://discord.gg/BWYKVxk" onClick={this.openUrl}>drop a message on our Discord server</a>. There's always someone available and willing  to help you on the start. Although we mainly play in Polish, we also run games in English.
              </Typography>
              <Typography variant="h5" className={classes.textHeader}>
                What is this service for?
              </Typography>
              <img src={teamIllustration} className={classes.imageRight}/>
              <Typography variant="body1" className={classes.info}>
                <strong>D&D AL Kraków portAL</strong> is a service where you can join our games by signing up for a game slots. Each DM in our community can take a free slot and run an Adventurers League adventure game session for the League players. All the spots booked for DMs are available for players for the sign up. Just pick the game slot with adventure you want to play and sign up for the game.
              </Typography>
              <Typography variant="body1" className={classes.info}>
                To start, simply <Link to="/register">register</Link> and activate your account. Further steps are described on each page.
              </Typography>
              <Typography variant="body1" className={classes.info}>
                <strong>portAL</strong> service was created as an open source community driven project which purpose is to help AL players to easily join the game and for the community to automate some organizational work. portAL is in continuous development and new features will come in the next months. You can support this project. For details <a href="https://github.com/dnd-al-krk/portal" onClick={this.openUrl}>visit project github page</a>.
              </Typography>
              <Typography variant="h5" className={classes.textHeader}>
                Looking for groups in other cities?
              </Typography>
              <Typography variant="body1" className={classes.info}>
                D&D Adventurers League is an organized play running in multiple cities around the globe. If you are not from Kraków, but found us somehow, you can always go to the <a href="http://locator.wizards.com/#brand=dnd" onClick={this.openUrl}>Wizards Locator</a> to find store and games near your location.
              </Typography>
              <Divider className={classes.textDivider}/>
              <Typography variant="body1" className={classNames(classes.info, classes.centered)}>
                <em><strong>D&D AL Kraków website and portAL</strong> is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.</em>
              </Typography>
              <Divider className={classes.textDivider}/>
              <Typography variant="body1" className={classNames(classes.info, classes.centered)}>
                <strong>portAL</strong> is proudly hosted by <a href="http://toady.org" onClick={this.openUrl}>Toady</a>.
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
