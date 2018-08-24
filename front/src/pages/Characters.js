import React from 'react';
import {inject, observer} from "mobx-react";
import withStyles from '@material-ui/core/styles/withStyles';
import LoadingDiv from "../common/LoadingDiv";
import {ClipLoader} from "react-spinners";
import {NarrowContent} from "../common/Content";
import Typography from "../../node_modules/@material-ui/core/Typography/Typography";
import List from "../../node_modules/@material-ui/core/List/List";
import ListItem from "../../node_modules/@material-ui/core/ListItem/ListItem";
import Avatar from "../../node_modules/@material-ui/core/Avatar/Avatar";
import Person from "../../node_modules/@material-ui/icons/Person";
import ListItemText from "../../node_modules/@material-ui/core/ListItemText/ListItemText";
import ListItemSecondaryAction
  from "../../node_modules/@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction";
import IconButton from "../../node_modules/@material-ui/core/IconButton/IconButton";
import ChevronRightIcon from "../../node_modules/@material-ui/icons/ChevronRight";
import UndecoratedLink from "../common/UndecoratedLink";
import Grid from "../../node_modules/@material-ui/core/Grid/Grid";
import InputLabel from "../../node_modules/@material-ui/core/InputLabel/InputLabel";
import Input from "../../node_modules/@material-ui/core/Input/Input";
import FormControl from "../../node_modules/@material-ui/core/FormControl/FormControl";
import Button from "../../node_modules/@material-ui/core/Button/Button";

const styles = (theme) => {

};

@withStyles(styles, {withTheme: true})
@inject('portalStore') @observer
export default class Characters extends React.Component{

  state = {
    loading: true,
    characters: [],
    search: '',
  };

  componentDidMount(){

    this.props.portalStore.fetchCharacters().then(
      (data) => {
        this.setState({
          characters: data,
          loading: false,
        });
      },
      () => {
        this.setState({
          characters: null,
          loading: false,
        })

      }
    );
  }

  search(){

  }

  render() {
    return (
      <NarrowContent>
        {this.state.loading ? (
            <LoadingDiv>
              <ClipLoader color={'#FFDE00'} loading={this.state.loading}/>
            </LoadingDiv>
          )
          : (
            <div>
              <Typography variant="title">
                League players
              </Typography>
              <Grid container spacing={8}>
                <Grid item xs={12} sm={9}>
                  <FormControl
                      style={{width: '100%'}}>
                    <InputLabel htmlFor="signIn-email">Search character or player</InputLabel>
                    <Input
                      style={{width: '100%'}}
                      id="signIn-email"
                      type="text"
                      value={this.state.search}
                      onChange={(e) => { this.setState({search: e.target.value })}}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button variant={'contained'} onClick={() => this.search()}>Search</Button>
                </Grid>
              </Grid>
              <List>
              {this.state.characters.map(character =>
                (<div key={`player-character-${character.id}`}>
                  <ListItem key={character.id}>
                    <Avatar>
                      <Person />
                    </Avatar>
                    <ListItemText primary={character.name}
                                  secondary={(
                                    <span>
                                      Played by <UndecoratedLink to={`/profiles/${character.owner}/`}>{character.owner_name}</UndecoratedLink> in 4 adventures | {character.faction}
                                    </span>
                                  )}>
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <IconButton aria-label="See character">
                        <ChevronRightIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </div>)
              )}
              </List>
            </div>
          )
        }
      </NarrowContent>
    );
  }
}
