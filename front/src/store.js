import {observable, action} from 'mobx';
import axios from 'axios';
import Cookies from 'js-cookie';
import {API_HOSTNAME} from "./config";
import {JWT_TOKEN} from "./constants";


const csrftoken = Cookies.get('csrftoken');


export const axiosInstance = axios.create({
  headers: {
    'X-CSRFToken': csrftoken,
  }
});

export function getAxiosInstance(token){
  return axios.create({
    headers: {
      'X-CSRFToken': csrftoken,
      'Authorization': `JWT ${token}`
    }
  })
}

export class PortalStore {
  @observable currentUser = null;
  @observable userToken = null;
  @observable authenticated = false;
  @observable navigationStore = new NavigationStore(this);

  @action.bound
  fetchCurrentUser(){
    if(this.isAuthenticated()){
      console.log('fetching user data')
      this.currentUser = new UserStore(this);
      this.currentUser.fetchData();
    }
  }

  @action.bound
  autologin(){
    const token = Cookies.get(JWT_TOKEN);
    return new Promise((resolve, reject) => {
      if(token){
        this.userToken = token;
        // refresh token
        this.currentUser = new UserStore(this);
        this.currentUser.fetchData()
          .then(() => resolve(), () => { reject() })
          .catch((err) => { reject(err); });
      }
      else{
        reject();
        this.signOut();
      }
    });
  }

  @action.bound
  isAuthenticated(){
    return this.getToken() !== null;
  }

  @action.bound
  getToken(){
    return this.userToken;
  }

  @action.bound
  login(user, password){
    return axiosInstance.post(`${API_HOSTNAME}/token/auth/`, {
      'username': user,
      'password': password,
    }).then((response) => {
      this.userToken = response.data.token;
      Cookies.set(JWT_TOKEN, this.userToken);
      this.currentUser = new UserStore(this);
      this.currentUser.fetchData();
    });
  }

  @action.bound
  signOut(){
    this.userToken = null;
    Cookies.remove(JWT_TOKEN);
  }

  @action.bound
  fetch_profiles() {
    return getAxiosInstance(this.userToken).get(`${API_HOSTNAME}/profiles/`).then(response => response.data);
  }

  @action.bound
  get_profile(id){
    return getAxiosInstance(this.userToken).get(`${API_HOSTNAME}/profiles/${id}/`).then(response => response.data);
  }
}


export class NavigationStore {
  @observable rootStore;
  @observable drawerStatus = false;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action.bound
  toggleDrawer(){
    this.drawerStatus = !this.drawerStatus;
  }
}


export class UserStore {
  @observable rootStore;
  @observable profileID;
  @observable userID;
  @observable first_name;
  @observable last_name;
  @observable nickname;
  @observable dci;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action.bound
  getToken(){
    return this.rootStore.getToken();
  }

  @action.bound
  fetchData(){
    return getAxiosInstance(this.getToken()).get(`${API_HOSTNAME}/current_user/`)
      .then((response) => {
        const data = response.data;
        this.profileID = data.id;
        this.userID = data.user.id;
        this.first_name = data.user.first_name;
        this.last_name = data.user.last_name;
        this.nickname = data.nickname;
        this.dci = data.dci;
      })
      .catch((err) => {
        this.rootStore.signOut();
      });
  }

  @action.bound
  saveData(){
    return getAxiosInstance(this.getToken()).put(`${API_HOSTNAME}/profiles/${this.profile_id}/`,
      {
        'id': this.profile_id,
        'user': {
          'id': this.user_id,
          'first_name': this.first_name,
          'last_name': this.last_name,
        },
        'nickname': this.nickname,
        'dci': this.dci,
    }).catch((err) => {
      this.rootStore.signOut();
    });
  }
}
