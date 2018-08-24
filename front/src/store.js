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
  @observable classes = [];
  @observable races = [];
  @observable factions = [];

  @action.bound
  fetchCurrentUser(){
    if(this.isAuthenticated()){
      console.log('fetching user data');
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
          .then(() => this.fetchClasses().then(data => this.classes = data))
          .then(() => this.fetchRaces().then(data => this.classes = data))
          .then(() => this.fetchFactions().then(data => this.classes = data))
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
  fetchData(name){
    return getAxiosInstance(this.userToken).get(`${API_HOSTNAME}/${name}/`).then(response => response.data);
  }

  @action.bound
  getData(name, id){
    return getAxiosInstance(this.userToken).get(`${API_HOSTNAME}/${name}/${id}/`).then(response => response.data);
  }

  @action.bound
  fetchProfiles() {
    return this.fetchData('profiles')
  }

  @action.bound
  getProfile(id){
    return this.getData('profiles', id);
  }

  @action.bound
  fetchClasses(){
    return this.fetchData('classes');
  }

  @action.bound
  fetchRaces(){
    return this.fetchData('races');
  }

  @action.bound
  fetchFactions(){
    return this.fetchData('factions');
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
