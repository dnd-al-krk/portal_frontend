import {observable, action} from 'mobx';
import axios from 'axios';
import Cookies from 'js-cookie';
import {hostname} from "./config";


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

export class NavigationStore {
  @observable drawerStatus = false;

  @action.bound
  toggleDrawer(){
    this.drawerStatus = !this.drawerStatus;
  }
}

export class PortalStore {
  @observable currentUser = null;
  @observable userToken = null;
  @observable authenticated = false;

  @action.bound
  autologin(){
    const token = Cookies.get('jwt-token');
    return new Promise((resolve, reject) => {
      if(token){
        this.userToken = token;
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
  login(user='ivellios.mirimafea@gmail.com', password='qwer4321'){
    return new Promise((resolve, reject) => {
      axiosInstance.post(`http://${hostname}/api-token-auth/`, {
        'username': user,
        'password': password,
      }).then((response) => {
        this.userToken = response.data.token;
        Cookies.set('jwt-token', this.userToken);
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
    Cookies.remove('jwt-token');
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
      getAxiosInstance(this.getToken()).get(`http://${hostname}/api/current_user/`)
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
      getAxiosInstance(this.getToken()).put(`http://${hostname}/api/profiles/${this.profile_id}/`,
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
