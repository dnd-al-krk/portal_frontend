import Cookies from "js-cookie";
import axios from "axios";
import {action, computed, observable, reaction} from "mobx";
import {
  JWT_TOKEN,
  JWT_TOKEN_IAT,
  JWT_TOKEN_ORIG_IAT,
  TOKEN_EXPIRATION_DELTA,
  TOKEN_REFRESH_EXPIRATION, TOKEN_REFRESH_RATE
} from "../constants";
import {API_HOSTNAME} from "../config";

const csrftoken = Cookies.get('csrftoken');


export const axiosInstance = axios.create({
  headers: {
    'X-CSRFToken': csrftoken,
  }
});


export default class TokenAuthorizationStore {
  @observable root = null;
  @observable token = window.localStorage.getItem(JWT_TOKEN);
  @observable token_iat = window.localStorage.getItem(JWT_TOKEN_IAT);
  @observable token_original_iat = window.localStorage.getItem('jwt_orig_iat');

  constructor(root) {
    this.root = root;

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
    return this.token !== undefined && this.tokenValidIat;
  }

  @action refreshToken() {
    return axiosInstance.post(`${API_HOSTNAME}/token/refresh/`, {'token': this.token, 'orig_iat': this.token_original_iat}).then(response => {
      this.token = response.data.token;
      this.resetToken();
      console.log('refreshing token to: ', this.token);
      return response;
    })
      .catch((e) => {
        console.log('Failed to refresh... ', e.response);
        this.signOut();
        //window.location.reload();
      });
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

  login(user, password){
    return axiosInstance.post(`${API_HOSTNAME}/token/auth/`, {
      'username': user,
      'password': password,
    }).then((response) => {
      console.log(response.data);
      if (response.status === 200) {
        this.token = response.data.token;
        this.hardResetToken();
      }
      return response;
    });
  }

  signOut(){
    this.token = undefined;
    this.token_iat = undefined;
    this.token_original_iat = undefined;
    // FIXME: should be independent from the root store
    this.root.signOut();
  }

  @action.bound
  autologin(){
    if(this.token && new Date().getTime() < this.token_original_iat + TOKEN_EXPIRATION_DELTA){
      // refresh token
      console.log('refreshing token on autologin...');
      return this.refreshToken();
    }
    else{
      return null;
    }
  }
}
