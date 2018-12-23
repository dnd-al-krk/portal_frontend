import {action, observable} from 'mobx';
import {API_HOSTNAME} from "./config";
import GamesStore from "./stores/GamesStore";
import AdventuresStore from "./stores/AdventuresStore";
import TokenAuthorizationStore from "./stores/TokenAuthorizationStore";
import {AxiosInstance as axiosInstance} from "axios";
import UserStore from "./stores/UserStore";
import NavigationStore from "./stores/NavigationStore";


export class PortalStore {
  @observable auth = new TokenAuthorizationStore(this);
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
          console.log('token refreshed...');
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
  get(url){
    return this.getAxiosInstance().then(instance => instance.get(`${API_HOSTNAME}${url}`));
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

