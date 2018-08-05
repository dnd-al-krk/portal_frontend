import {observable, action} from 'mobx';
import axios from 'axios';
import Cookies from 'js-cookie';
import {API_HOSTNAME} from "./config";
import {JWT_TOKEN} from "./constants";


const csrftoken = Cookies.get('csrftoken');


export const axiosInstance = axios.create({
  headers: {
    'X-CSRFToken': csrftoken,
    'Authorization': `JWT $token`
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
    return new Promise((resolve, reject) => {
      axiosInstance.post(`${API_HOSTNAME}/token/auth/`, {
        'username': user,
        'password': password,
      }).then((response) => {
        this.userToken = response.data.token;
        Cookies.set(JWT_TOKEN, this.userToken);
        this.currentUser = new UserStore(this);
        this.currentUser.fetchData()
          .then(() => resolve(), () => reject())
          .catch((err) => reject(err));
      }).catch((err) => {
        reject(err);
      })
    })
  }

  @action.bound
  signOut(){
    this.userToken = null;
    Cookies.remove(JWT_TOKEN);
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
  @observable profile_id;
  @observable user_id;
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
    return new Promise((resolve, reject) => {
      getAxiosInstance(this.getToken()).get(`${API_HOSTNAME}/current_user/`)
        .then((response) => {
          const data = response.data;
          this.profile_id = data.id;
          this.user_id = data.user.id;
          this.first_name = data.user.first_name;
          this.last_name = data.user.last_name;
          this.nickname = data.nickname;
          this.dci = data.dci;
          resolve(response.data);
        })
        .catch((err) => {
          this.rootStore.signOut();
          reject(err);
        });
    });
  }

  @action.bound
  saveData(){
    return new Promise((resolve, reject) => {
      getAxiosInstance(this.getToken()).put(`${API_HOSTNAME}/profiles/${this.profile_id}/`,
        {
          'id': this.profile_id,
          'user': {
            'id': this.user_id,
            'first_name': this.first_name,
            'last_name': this.last_name,
          },
          'nickname': this.nickname,
          'dci': this.dci,
        }).then((response) => {
          resolve(response.data);
      })
        .catch((err) => {
          this.rootStore.signOut();
          reject(err);
        });
    });
  }
}
