import withStyles from "../../node_modules/@material-ui/core/styles/withStyles";
import {inject, observer} from "mobx-react";
import React from "react";
import Person from "../../node_modules/@material-ui/icons/Person";
import Avatar from "../../node_modules/@material-ui/core/Avatar/Avatar";
import Typography from "../../node_modules/@material-ui/core/Typography/Typography";
import Grid from "../../node_modules/@material-ui/core/Grid/Grid";
import LoadingDiv from "../common/LoadingDiv";
import {ClipLoader} from "react-spinners";
import {NarrowContent} from "../common/Content";
import ChevronRightIcon from "../../node_modules/@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import IconButton from "../../node_modules/@material-ui/core/IconButton/IconButton";


const styles = theme => ({
  avatar: {
    float: 'left',
    marginRight: 10,
    width: 60,
    height: 60,
  },
  avatarIcon: {
    width: 50,
    height: 50,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '90%',
  },
  paperContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  submitRow: {
    textAlign: 'right',
  },
  profileHeader: {
    marginBottom: 30,
  },
  charactersList: {
  },
});


@withStyles(styles, { withTheme: true })
@inject('portalStore') @observer
export default class Profile extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      id: this.props.match.params.id,
      profile: null,
      loading: true,
    }
  }

  componentDidMount(){
    this.setStateFromStore();
  }

  setStateFromStore(){
    this.props.portalStore.get_profile(this.state.id).then(
      (data) => {
        this.setState({
          profile: data,
          loading: false,
        });
      },
      () => {
        this.setState({
          profile: null,
          loading: false,
        })

      }
    );
  }

  render() {
    const {classes} = this.props;

    const profile = this.state.profile;

    return (
      <NarrowContent>
        {this.state.loading ? (
          <LoadingDiv>
            <ClipLoader color={'#FFDE00'} loading={this.state.loading}  />
          </LoadingDiv>
          )
          : (
          <Grid container spacing={8}>
            <Grid item xs={12} className={classes.profileHeader}>
              <Avatar className={classes.avatar}>
                <Person className={classes.avatarIcon} />
              </Avatar>
              <Typography variant="headline">
                {profile.user.first_name} {profile.user.last_name} ({profile.nickname})
              </Typography>
              <Typography variant="body1">
                {profile.role} | DCI: {profile.dci}
              </Typography>
            </Grid>
            <Grid item xs={12} className={classes.charactersList}>
              <Typography variant="headline">
                Characters
              </Typography>
              TODO: Here be characters list...
            </Grid>
          </Grid>
          )}
      </NarrowContent>
    )
  }
}
