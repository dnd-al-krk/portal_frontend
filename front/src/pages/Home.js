import React from 'react';
import {inject, observer} from "mobx-react";
import {CurrentDMGamesList, CurrentUserGamesList} from "./GamesList";
import Grid from "@material-ui/core/Grid/Grid";

@inject('portalStore') @observer
class Home extends React.Component {

  render() {

    console.log(this.props.portalStore.currentUser);

    return (
      <div className="container">
        {this.props.portalStore.currentUser && this.props.portalStore.currentUser.profileID && (
          <Grid container spacing={8}>
            <Grid item xs={12} >
              <CurrentUserGamesList/>
            </Grid>
            <Grid item xs={12} >
              {this.props.portalStore.currentUser.isDM && (
                <CurrentDMGamesList/>
              )}
            </Grid>
          </Grid>
        )}
      </div>
    );
  }
}

export default Home;
