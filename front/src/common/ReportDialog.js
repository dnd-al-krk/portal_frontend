import React, {Component} from 'react';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import TextField from "@material-ui/core/TextField/TextField";
import FormControl from "@material-ui/core/FormControl/FormControl";
import FormLabel from "@material-ui/core/FormLabel/FormLabel";
import FormGroup from "@material-ui/core/FormGroup/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import FormHelperText from "@material-ui/core/FormHelperText/FormHelperText";
import {withStyles} from "@material-ui/core";
import Switch from "@material-ui/core/Switch/Switch";


const styles = theme => ({

});


@withStyles(styles, {withTheme: true})
class ReportDialog extends Component {

  state = {
    players: [],
    selectAll: false,
  };

  componentWillMount(){
    const {players} = this.props;

    const players_list = [];

    players.map(player => {
      players_list.push({
        name: this.getName(player.profile),
        dci: player.profile.dci,
        id: player.profile.id,
        confirmed: false,
      });
    });

    this.setState({players: players_list});
  }

  getName = (profile) => {
    const names = `${profile.first_name} ${profile.last_name}`;
    const nickname = profile.nickname ? ` (${profile.nickname})` : '';
    return names+nickname
  };

  handleClose = () => {
    const {game, open, players, onClose} = this.props;
    onClose();
  };

  handleCancel = () => {
    this.handleClose();
  };

  handleConfirm = () => {
    this.handleClose();
  };

  confirmPlayer = id => event => {
    const players = this.state.players;
    players.map(player => {
      if(player.id === id)
        player.confirmed = !player.confirmed;
    });
    this.setState({players: players});
  };

  confirmAllPlayers = () => {
    this.setState({selectAll: !this.state.selectAll});
  };

  render() {
    const {open, classes} = this.props;

    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Confirm game report</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm all players that were playing at your table.
          </DialogContentText>

          <FormControl component="fieldset" className={classes.formControl}>
            <FormGroup>
              {this.state.players.map(player => (
                <FormControlLabel
                  key={`player-checkbox-${player.id}`}
                  control={
                    <Checkbox checked={player.confirmed || this.state.selectAll} onChange={this.confirmPlayer(player.id)} />
                  }
                  label={player.name+" DCI: "+player.dci}
                />
              ))}
            </FormGroup>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.selectAll}
                    onChange={this.confirmAllPlayers}
                    color='secondary'
                  />
                }
                label="Select all players in the list"
              />
            </FormGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ReportDialog;
