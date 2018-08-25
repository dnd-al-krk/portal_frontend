import React from 'react';
import withStyles from "../../node_modules/@material-ui/core/styles/withStyles";
import {inject, observer} from "mobx-react";
import ListItem from "../../node_modules/@material-ui/core/ListItem/ListItem";
import Avatar from "../../node_modules/@material-ui/core/Avatar/Avatar";
import Person from "../../node_modules/@material-ui/icons/Person";
import ListItemText from "../../node_modules/@material-ui/core/ListItemText/ListItemText";
import UndecoratedLink from "./UndecoratedLink";
import ListItemSecondaryAction
  from "../../node_modules/@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction";
import IconButton from "../../node_modules/@material-ui/core/IconButton/IconButton";
import ChevronRightIcon from "../../node_modules/@material-ui/icons/ChevronRight";
import List from "../../node_modules/@material-ui/core/List/List";

const styles = (theme) => {

};

@withStyles(styles, {withTheme: true})
@inject('portalStore') @observer
export default class CharactersList extends React.Component {
  render() {
    const {characters, use_by} = this.props;

    return (
      <List>
        {characters.map(character =>
          (<div key={`player-character-${character.id}`}>
            <ListItem key={character.id}>
              <Avatar>
                <Person />
              </Avatar>
              <ListItemText primary={character.name}
                            secondary={(
                              <span>
                                {(use_by === undefined || use_by === true) && (
                                  <span>
                                    Played by <UndecoratedLink to={`/profiles/${character.owner}/`}>{character.owner_name}</UndecoratedLink> |&nbsp;
                                  </span>)}
                                    {character.faction}
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
    )
  }
}
