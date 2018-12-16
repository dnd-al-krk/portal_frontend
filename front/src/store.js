import {observable, action, computed} from 'mobx';
import axios from 'axios';
import Cookies from 'js-cookie';
import {API_HOSTNAME} from "./config";
import {JWT_TOKEN} from "./constants";
import GamesStore from "./stores/GamesStore";
import AdventuresStore from "./stores/AdventuresStore";


const csrftoken = Cookies.get('csrftoken');


export const axiosInstance = axios.create({
  headers: {
    'X-CSRFToken': csrftoken,
  }
});

export function getAxiosInstance(token){
  return axios.create({
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken'),
      'Authorization': `JWT ${token}`
    }
  })
}

export class PortalStore {
  @observable currentUser = null;
  @observable userToken = null;
  @observable authenticated = false;
  @observable navigationStore = new NavigationStore(this);
  @observable games = new GamesStore(this);
  @observable adventures = new AdventuresStore(this);

  @action.bound
  fetchCurrentUser(){
    if(this.isAuthenticated()){
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
    return new Promise((resolve, reject) => {
      axiosInstance.post(`${API_HOSTNAME}/token/auth/`, {
        'username': user,
        'password': password,
      }).then((response) => {
        if (response.status === 200) {
          this.userToken = response.data.token;
          Cookies.set(JWT_TOKEN, this.userToken);
          this.currentUser = new UserStore(this);
          this.currentUser.fetchData()
            .then(() => resolve(response));
        }
      });
    });
  }

  @action.bound
  register(data){
    return axiosInstance.post(`${API_HOSTNAME}/register/`, data)
  }

  @action.bound
  sendPasswordReset(login){
    return axiosInstance.post(`${API_HOSTNAME}/password_reset/`, {email: login})
  }

  @action.bound
  changePassword(token, password){
    return axiosInstance.post(`${API_HOSTNAME}/password_reset/confirm/`, {token: token, password: password});
  };

  @action.bound
  get(url){
    return getAxiosInstance(this.userToken).get(`${API_HOSTNAME}${url}`);
  }

  @action.bound
  signOut(){
    this.userToken = null;
    this.currentUser = null;
    Cookies.remove(JWT_TOKEN);
  }

  @action.bound
  fetchData(name){
    return this.get(`/${name}/`).then(response => response.data);
  }

  @action.bound
  getData(name, id){
    return this.get(`/${name}/${id}/`).then(response => response.data);
  }

  @action.bound
  putData(name, id, data){
    return getAxiosInstance(this.userToken).put(`${API_HOSTNAME}/${name}/${id}/`, data);
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
  fetchCharacters(){
    return this.fetchData('characters');
  }

  @action.bound
  fetchProfileCharacters(owner){
    return getAxiosInstance(this.userToken).get(`${API_HOSTNAME}/characters/?owner=${owner}`).then(response => response.data);
  }

  @action.bound
  getCharacter(id){
    return getAxiosInstance(this.userToken).get(`${API_HOSTNAME}/characters/${id}/`).then(response => response.data);
  }

  @action.bound
  searchCharacters(search_term){
    return getAxiosInstance(this.userToken).get(`${API_HOSTNAME}/characters/?search=${search_term}`).then(response => response.data);
  }

  @action.bound
  createCharacter(data){
    return getAxiosInstance(this.userToken).post(`${API_HOSTNAME}/characters/`, data).then(response => {
      if(response.status === 201){
        this.currentUser.charactersCount++;
      }
    })
  }

  @action.bound
  saveCharacter(id, data){
    return getAxiosInstance(this.userToken).put(`${API_HOSTNAME}/characters/${id}/`, data)
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
  profileID;
  userID;
  @observable first_name;
  @observable last_name;
  @observable nickname;
  @observable dci;
  role;
  @observable charactersCount;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @computed get isDM(){
    return this.role === 'Dungeon Master';
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
        this.role = data.role;
        this.charactersCount = data.characters_count;
      })
      .catch((err) => {
        this.rootStore.signOut();
      });
  }

  @action.bound
  saveData(){
    return getAxiosInstance(this.getToken()).put(`${API_HOSTNAME}/profiles/${this.profileID}/`,
      {
        'id': this.profileID,
        'user': this.userID,
        'nickname': this.nickname,
        'dci': this.dci,
    }).catch((err) => {
      this.rootStore.signOut();
    });
  }
}
