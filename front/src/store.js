import {action, observable} from 'mobx';
import {API_HOSTNAME} from "./config";
import GamesStore from "./stores/GamesStore";
import AdventuresStore from "./stores/AdventuresStore";
import TokenAuthorizationStore from "./stores/TokenAuthorizationStore";
import {AxiosInstance as axiosInstance} from "axios";
import UserStore from "./stores/UserStore";
import NavigationStore from "./stores/NavigationStore";
import Api from "./api";


export class PortalStore {
  @observable auth = new TokenAuthorizationStore(this);
  @observable api = new Api(this.auth);
  @observable currentUser = null;
  @observable navigationStore = new NavigationStore(this);
  @observable games = new GamesStore(this);
  @observable adventures = new AdventuresStore(this);

  @action
  isAuthenticated(){
    return this.auth.isAuthenticated() && this.currentUser && this.currentUser.profileID !== undefined;
  }

  getAxiosInstance(){
    return this.auth.getAxiosInstance();
  }

  @action.bound
  login(user, password){
    return new Promise((resolve) => {
      this.auth.login(user, password).then(response => {
        this.currentUser = new UserStore(this);
        this.currentUser.fetchData().then(() => resolve());
        return response;
      });
    });
  }

  @action.bound
  signOut(){
    this.currentUser = null;
  }

  @action.bound
  autologin(){
    return new Promise((resolve, reject) => {
      this.auth.autologin().then(response => {
        if(response !== null){
          this.currentUser = new UserStore(this);
          this.currentUser.fetchData()
            .then(() => resolve(response), () => { reject(response) })
            .catch((err) => { reject(err); });
        }
        else{
          reject(response)
        }
      })
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
  fetchProfiles() {
    return this.api.fetchData('profiles')
  }

  @action.bound
  getProfile(id){
    return this.api.getData('profiles', id);
  }

  @action.bound
  fetchCharacters(){
    return this.api.fetchData('characters');
  }

  @action.bound
  fetchProfileCharacters(owner){
    return this.api.get(`/characters/?owner=${owner}`).then(response => response.data);
  }

  @action.bound
  getCharacter(id){
    return this.api.get(`/characters/${id}/`).then(response => response.data);
  }

  @action.bound
  searchCharacters(search_term){
    return this.api.get(`/characters/?search=${search_term}`).then(response => response.data);
  }

  @action.bound
  createCharacter(data){
    return this.api.post(`/characters/`, data).then(response => {
      if(response.status === 201){
        this.currentUser.charactersCount++;
      }
    });
  }

  @action.bound
  saveCharacter(id, data){
    return this.api.put(`/characters/${id}/`, data);
  }
}

