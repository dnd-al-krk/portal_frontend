import React from "react";
import Typography from "@material-ui/core/Typography/Typography";
import withStyles from "@material-ui/core/styles/withStyles";


const styles = (theme) => ({
  root: {
    padding: theme.spacing.unit,
  },
});

@withStyles(styles, {withTheme:true})
export class Terms extends React.Component {
  render() {
    const {classes} = this.props;

    return (
      <div className={classes.root}>
        <Typography variant="h2">
          Terms &amp; Conditions
        </Typography>
        <Typography variant="body1">
          Text of terms...
        </Typography>
      </div>
    )
  }
}
