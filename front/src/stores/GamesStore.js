import {observable} from 'mobx';
import {dateToString, weekdayOf} from "../utils";

export default class GamesStore {
  @observable root = null;

  constructor(root){
    this.root = root
  }

  fetch(){
    return this.root.fetchData('games/list');
  }

  fetchFuture(){
    return this.root.fetchData('games/future');
  }

  fetchPast(){
    return this.root.fetchData('games/past');
  }

  fetchFutureForUser(id){
    return this.root.get(`/games/future/?having_player=${id}`).then(response => response.data);
  }

  fetchFutureForDM(id){
    return this.root.get(`/games/future/?dm__id=${id}`).then(response => response.data);
  }

  fetchFutureForCurrentUser(){
    return this.fetchFutureForUser(this.root.currentUser.profileID);
  }

  fetchFutureForCurrentDM(){
    return this.fetchFutureForDM(this.root.currentUser.profileID);
  }

  get(id){
    return this.root.getData('games/list', id);
  }

  book(id, data){
    return this.root.putData('games/booking', id, data);
  }

  cancel(id){
    return this.root.get(`/games/booking/${id}/cancel/`);
  }

  signUp(id, characterId){
    return this.root.putData('games/list', `${id}/signUp`, {character_id: characterId})
  }

  signOut(id){
    return this.root.putData('games/list', `${id}/signOut`, {})
  }

  static getDMName(game) {
    if(!game.dm) return '';
    return `${game.dm.first_name} ${game.dm.last_name} (${game.dm.nickname})`;
  }

  static getWeekDay(game) {
    const date = new Date(game.date);
    return weekdayOf(date);
  }

  static getDateString(game) {
    if(!game.date) return '';
    const date = new Date(game.date);
    return dateToString(date);
  }

}
