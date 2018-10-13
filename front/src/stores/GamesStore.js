import {observable} from 'mobx';
import {dateToString, weekdayOf} from "../utils";

export default class GamesStore {
  @observable root = null;
  @observable items = [];

  constructor(root){
    this.root = root
  }

  fetch(){
    this.items = [];
    return this.root.fetchData('games/list');
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
