import withStyles from "@material-ui/core/styles/withStyles";
import React from "react";
import {SnackbarContentWrapper} from "./InfoSnackbar";
import Link from "react-router-dom/es/Link";
import {inject, observer} from "mobx-react";
import {openUrl} from "../utils";


const styles = (theme) => ({
  whiteUrl: {
    color: '#fff',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  snackbarWrapper: {
    padding: 10,
    marginBottom: 20
  },
  snackbar: {
    maxWidth: '100%',
  }
});


@withStyles(styles, {withTheme:true})
@inject('portalStore') @observer
export class MissingDCINotification extends React.Component {
  render() {
    const {classes} = this.props;

    if(this.props.portalStore.currentUser.dci){
      return null
    }

    return (
      <div className={classes.snackbarWrapper}>
        <SnackbarContentWrapper
          variant="warning"
          className={classes.snackbar}
          message={(<div>You did't provide DCI number for your account. You need to set it in order to be able to play games in the League. DCI number can be acquired on <a href="https://accounts.wizards.com" onClick={openUrl} className={classes.whiteUrl}>Wizards of the Coast page</a> after registering an account. Once you have one <Link to={`/account`} className={classes.whiteUrl}>update your profile</Link>.</div>)}/>
      </div>
    )
  }
}
