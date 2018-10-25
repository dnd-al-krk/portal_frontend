import React, {Fragment} from 'react';
import {inject, observer} from "mobx-react";
import {CurrentDMGamesList, CurrentUserGamesList} from "./GamesList";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import {WideContent} from "../common/Content";


const styles = (theme) => ({
  info: {
  }
});


@withStyles(styles, { withTheme: true })
@inject('portalStore') @observer
class Home extends React.Component {
  render() {
    const {classes} = this.props;

    return (
      <div className="container">
        <Grid container spacing={8}>
        {this.props.portalStore.currentUser ? (
          <Fragment>
            <Grid item xs={12} >
              <CurrentUserGamesList/>
            </Grid>
            <Grid item xs={12} >
              {this.props.portalStore.currentUser.isDM && (
                <CurrentDMGamesList/>
              )}
            </Grid>
          </Fragment>
        ) : (
          <Grid item xs={12}>
            <WideContent>
              <Typography variant="display1">
                Adventure Awaits!
              </Typography>
              <Typography variant="body1" className={classes.info}>
                Welcome to D&D Adventurers League Kraków service.<br/>
                Here you can sign up for the games run by our finest Dungeon Masters.<br/>
                Or maybe you would like to become DM? Sure thing!
              </Typography>
            </WideContent>
          </Grid>
        )}
        </Grid>
      </div>
    );
  }
}

export default Home;
