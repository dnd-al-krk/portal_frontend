import React, {Component} from 'react';
import ListItem from "@material-ui/core/ListItem/ListItem";
import Avatar from "@material-ui/core/Avatar/Avatar";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton/IconButton";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Person from "@material-ui/icons/Person";

class ProfileListItem extends Component {
  gotoProfile = (id) => {
    this.props.history.push(`/profiles/${id}`);
  };

  getName = (profile) => {
    const names = `${profile.first_name} ${profile.last_name}`;
    const nickname = profile.nickname ? ` (${profile.nickname})` : '';
    return names+nickname
  };

  render() {
    const {profile, action=null} = this.props;

    return (
      <ListItem button onClick={() => this.gotoProfile(profile.id)}>
        <Avatar>
          <Person />
        </Avatar>
        <ListItemText primary={this.getName(profile)}
                      secondary={`
                      ${profile.role} | ${profile.characters_count} character${profile.characters_count !== 1 ? 's' : ''}

                      `} />
        {action && (
          <ListItemSecondaryAction>
            {action}
          </ListItemSecondaryAction>
        )}
      </ListItem>
    );
  }
}

export default ProfileListItem;
