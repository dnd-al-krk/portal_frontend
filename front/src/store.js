import {observable, action, computed, reaction} from 'mobx';
import axios from 'axios';
import Cookies from 'js-cookie';
import {API_HOSTNAME} from "./config";
import {
  JWT_TOKEN,
  JWT_TOKEN_IAT,
  JWT_TOKEN_ORIG_IAT,
  TOKEN_EXPIRATION_DELTA,
  TOKEN_REFRESH_EXPIRATION,
  TOKEN_REFRESH_RATE
} from "./constants";
import GamesStore from "./stores/GamesStore";
import AdventuresStore from "./stores/AdventuresStore";


const csrftoken = Cookies.get('csrftoken');


export const axiosInstance = axios.create({
  headers: {
    'X-CSRFToken': csrftoken,
  }
});


export class PortalStore {
  @observable currentUser = null;
  @observable token = window.localStorage.getItem(JWT_TOKEN);
  @observable token_iat = window.localStorage.getItem(JWT_TOKEN_IAT);
  @observable token_original_iat = window.localStorage.getItem('jwt_orig_iat');
  @observable authenticated = false;
  @observable navigationStore = new NavigationStore(this);
  @observable games = new GamesStore(this);
  @observable adventures = new AdventuresStore(this);

  constructor() {
    reaction(
      () => this.token,
      token => {
        if (token){
          window.localStorage.setItem(JWT_TOKEN, token);
        } else {
          window.localStorage.removeItem(JWT_TOKEN);
        }
      }
    );

    reaction(
      () => this.token_iat,
      token_iat => {
        if (token_iat) {
          window.localStorage.setItem(JWT_TOKEN_IAT, token_iat);
        } else {
          window.localStorage.removeItem(JWT_TOKEN_IAT);
        }
      }
    );

    reaction(
      () => this.token_original_iat,
      token_iat => {
        if (token_iat) {
          window.localStorage.setItem(JWT_TOKEN_ORIG_IAT, token_iat);
        } else {
          window.localStorage.removeItem(JWT_TOKEN_ORIG_IAT);
        }
      }
    );
  }

  createAxiosInstance() {
    const instance = axios.create({
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'Authorization': `JWT ${this.token}`
      }
    });

    instance.interceptors.response.use(response => {
       return response;
    }, error => {
      if (error.response.status === 401) {
        console.log('Tokens have expired! Need to sign in again');
        this.signOut();
        window.location.reload();
      }
      return error;
    });

    return instance;
  }

  getAxiosInstance(){
    return new Promise((resolve) => {
      console.log('loading...', this.token_iat);
      if(this.tokenShouldRefresh && this.tokenValidIat){
        console.log('refreshing token!', this.token_iat);

        this.refreshToken().then(() => {
          resolve(this.createAxiosInstance());
        }).catch(e => {
          console.log('Looks like there was an issue with retrieving token data. Resetting state to login.', e);
          this.signOut();
          window.location.reload();
        });
      }
      else {
        if (!this.tokenValidOrigIat) {
          console.log('Expired refresh! Cannot get any new token until user signs in');
          this.signOut();
          window.location.reload();
        }
        resolve(this.createAxiosInstance());
      }
    });
  }

  @action.bound
  get(url){
    return this.getAxiosInstance().then(instance => instance.get(`${API_HOSTNAME}${url}`));
  }

  @computed get tokenValidIat(){
    // checks if token is refreshable - maybe it is too late for it to be refreshed?
    console.log('seconds since refresh: ', new Date().getTime() - this.token_iat );
    return this.token_iat !== undefined && new Date().getTime() < this.token_iat + TOKEN_EXPIRATION_DELTA;
  }

  @computed get tokenValidOrigIat(){
    // checks if tokens can still be refreshed against origin token picking time
    console.log('orig_iat seconds since start: ', new Date().getTime() - this.token_original_iat );
    return this.token_original_iat !== undefined && new Date().getTime() < this.token_original_iat + TOKEN_REFRESH_EXPIRATION;
  }

  @computed get tokenShouldRefresh(){
    // checks if enough time has passed for the token to be refreshed
    console.log('iat seconds since start to refresh rate: ', new Date().getTime() - this.token_iat , this.token_iat + TOKEN_REFRESH_RATE);
    return this.token_iat !== undefined && new Date().getTime() > this.token_iat + TOKEN_REFRESH_RATE;
  }

  resetToken(){
    this.token_iat = new Date().getTime();
  }

  hardResetToken(){
    this.token_iat = this.token_original_iat = new Date().getTime();
  }

  @action
  isAuthenticated(){
    if(this.currentUser)
      // console.log(this, this.token !== undefined && this.tokenValidIat && this.currentUser && this.currentUser.profileID !== undefined);
    return this.token !== undefined && this.tokenValidIat && this.currentUser && this.currentUser.profileID !== undefined;
  }

  @action refreshToken() {
    return axiosInstance.post(`${API_HOSTNAME}/token/refresh/`, {'token': this.token, 'orig_iat': this.token_original_iat}).then(response => {
      this.token = response.data.token;
      this.resetToken();
      console.log('refreshing token to: ', this.token);
    })
      .catch((e) => {
        console.log('Failed to refresh... ', e.response);
        this.signOut();
        //window.location.reload();
      });
  }

  @action.bound
  login(user, password){
    return new Promise((resolve, reject) => {
      axiosInstance.post(`${API_HOSTNAME}/token/auth/`, {
        'username': user,
        'password': password,
      }).then((response) => {
        console.log(response.data);
        if (response.status === 200) {
          this.token = response.data.token;
          this.hardResetToken();

          this.currentUser = new UserStore(this);
          this.currentUser.fetchData().then(() => resolve());
        }
      });
    });


  }

  @action.bound
  signOut(){
    this.token = undefined;
    this.token_iat = undefined;
    this.token_original_iat = undefined;
    this.currentUser = null;
  }


  @action.bound
  autologin(){
    return new Promise((resolve, reject) => {
      console.log('trying to log in automatically...');
      if(this.token && new Date().getTime() < this.token_original_iat + TOKEN_EXPIRATION_DELTA){
        // refresh token
        console.log('refreshing token on autologin...');
        this.refreshToken().then(() => {
          console.log('token refreshed...');
          this.currentUser = new UserStore(this);
          this.currentUser.fetchData()
            .then(() => resolve(), () => { reject() })
            .catch((err) => { reject(err); });
        });
      }
      else{
        reject();
        this.signOut();
      }
    });
  }

  @action.bound
  fetchCurrentUser(){
    if(this.isAuthenticated()){
      this.currentUser = new UserStore(this);
      this.currentUser.fetchData();
    }
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
  fetchData(name){
    return this.get(`/${name}/`).then(response => response.data);
  }

  @action.bound
  getData(name, id){
    return this.get(`/${name}/${id}/`).then(response => response.data);
  }

  @action.bound
  putData(name, id, data){
    return this.getAxiosInstance().then(instance => instance.put(`${API_HOSTNAME}/${name}/${id}/`, data));
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
    return this.get(`/characters/?owner=${owner}`).then(response => response.data);
  }

  @action.bound
  getCharacter(id){
    return this.get(`/characters/${id}/`).then(response => response.data);
  }

  @action.bound
  searchCharacters(search_term){
    return this.get(`/characters/?search=${search_term}`).then(response => response.data);
  }

  @action.bound
  createCharacter(data){
    return this.getAxiosInstance().then(instance => instance.post(`${API_HOSTNAME}/characters/`, data).then(response => {
      if(response.status === 201){
        this.currentUser.charactersCount++;
      }
    }));
  }

  @action.bound
  saveCharacter(id, data){
    return this.getAxiosInstance().then(instance => instance.put(`${API_HOSTNAME}/characters/${id}/`, data));
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
  fetchData(){
    return this.rootStore.get(`/current_user/`)
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
    return this.rootStore.getAxiosInstance().then(instance => instance.put(`${API_HOSTNAME}/profiles/${this.profileID}/`,
      {
        'id': this.profileID,
        'user': this.userID,
        'nickname': this.nickname,
        'dci': this.dci,
    }).catch((err) => {
      this.rootStore.signOut();
    }));
  }
}
