import React, {Component} from 'react';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import FormControl from "@material-ui/core/FormControl/FormControl";
import FormGroup from "@material-ui/core/FormGroup/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import {withStyles} from "@material-ui/core";
import Switch from "@material-ui/core/Switch/Switch";
import {inject, observer} from "mobx-react";
import TextField from "@material-ui/core/TextField/TextField";
import Divider from "@material-ui/core/Divider/Divider";


const styles = theme => ({
  formControl: {
    width: '100%',
  },
  divider: {
    marginTop: 30,
    marginBottom: 10,
  }
});


@withStyles(styles, {withTheme: true})
@inject('portalStore') @observer
class ReportDialog extends Component {

  state = {
    players: [],
    extraPlayers: '',
    selectAll: false,
    extraPlayers: '',
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

  handleClose = (success) => {
    const {onClose} = this.props;
    onClose(success);
  };

  handleCancel = () => {
    this.handleClose(false);
  };

  handleConfirm = () => {
    const {game, onClosing} = this.props;
    onClosing();
    const players_list = this.state.players
      .filter(player => player.confirmed || this.state.selectAll)
      .map(player => player.id);
    this.props.portalStore.games.sendReport(
      game.id,
      {
        players: players_list,
        extra_players: this.state.extraPlayers !== '' ? this.state.extraPlayers : null,
        report_notes: this.state.reportNotes
      })
      .then(response => {
        this.handleClose(true);
      })
      .catch(error => {
        if(error.response.status === 400){
          console.log('Wrong data passed to errors');
        }
      });
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
    const players = this.state.players;
    players.map(player => player.confirmed = !this.state.selectAll);
    this.setState({selectAll: !this.state.selectAll, players: players});
  };

  render() {
    const {open, classes} = this.props;

    return (
      <Dialog
        open={open}
        onClose={(e) => this.handleClose(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">DM game report</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm the players that attended the game at your table.
          </DialogContentText>

          <FormControl component="fieldset" className={classes.formControl}>
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
              <TextField
                  id="name"
                  label="Additional players"
                  className={classes.textField}
                  value={this.state.extraPlayers}
                  helperText="If there were extra players at the table, enter only their DCIs comma-separated"
                  onChange={(event) => this.setState({extraPlayers: event.target.value})}
                  margin="normal"
                />
              <TextField
                  id="name"
                  label="Extra notes"
                  className={classes.textField}
                  value={this.state.reportNotes}
                  helperText="Extra report notes"
                  onChange={(event) => this.setState({reportNotes: event.target.value})}
                  margin="normal"
                />
            </FormGroup>
          </FormControl>
          <Divider className={classes.divider} />
          <DialogContentText>
            Make sure all report data is correct before confirming. You won't be able to change it.
          </DialogContentText>
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
