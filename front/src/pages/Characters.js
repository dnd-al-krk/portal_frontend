import React from 'react';
import {inject, observer} from "mobx-react";
import withStyles from '@material-ui/core/styles/withStyles';
import LoadingDiv from "../common/LoadingDiv";
import {ClipLoader} from "react-spinners";
import {NarrowContent} from "../common/Content";
import Typography from "@material-ui/core/Typography/Typography";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import Avatar from "@material-ui/core/Avatar/Avatar";
import Person from "@material-ui/icons/Person";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItemSecondaryAction
  from "@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton/IconButton";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import UndecoratedLink from "../common/UndecoratedLink";
import Grid from "@material-ui/core/Grid/Grid";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Input from "@material-ui/core/Input/Input";
import FormControl from "@material-ui/core/FormControl/FormControl";
import Button from "@material-ui/core/Button/Button";
import CharactersList from "../common/CharactersList";

const styles = (theme) => {

};

@withStyles(styles, {withTheme: true})
@inject('portalStore') @observer
export default class Characters extends React.Component{

  state = {
    loading: true,
    characters: [],
    search: '',
    searched: false,
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
    this.setState({
      loading: true,
      searched: true,
    });
    this.props.portalStore.searchCharacters(this.state.search)
      .then((data) => {
        this.setState({
          characters: data,
          loading: false,
        })
      })
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
                League characters
              </Typography>
              <Grid container spacing={8} style={{margin: '20px 0'}}>
                <Grid item xs={12} sm={9}>
                  <FormControl
                      style={{width: '100%'}}>
                    <InputLabel htmlFor="signIn-email">Search character or player</InputLabel>
                    <Input
                      style={{width: '100%'}}
                      id="signIn-email"
                      type="text"
                      autoFocus={this.state.searched}
                      value={this.state.search}
                      onKeyPress={(e) => {
                        if(e.charCode === 13){
                          this.setState({search: e.target.value});
                          this.search();
                        }
                      }}
                      onChange={(e) => { this.setState({search: e.target.value })}}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button variant={'contained'} onClick={() => this.search()}>Search</Button>
                </Grid>
              </Grid>
              <CharactersList characters={this.state.characters}/>
            </div>
          )
        }
      </NarrowContent>
    );
  }
}
