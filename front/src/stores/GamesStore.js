import {observable, action} from 'mobx';
import {dateToString, weekdayOf} from "../utils";

export default class GamesStore {
  @observable root = null;
  @observable items = [];

  constructor(root){
    this.root = root
  }

  fetch(){
    this.items = [];
    return this.root.fetchData('games/list').then(data => data.map(game_data => {
      this.items.push(new Game(this, game_data));
    }));
  }

  get(id){
    return this.root.getData('games/list', id);
  }

  book(id, data){
    return this.root.putData('games/booking', id, data);
  }

  signUp(id){
    return this.root.putData('games/list', `${id}/signUp`, {})
  }

  signOut(id){
    return this.root.putData('games/list', `${id}/signOut`, {})
  }
}

export class Game {
  @observable root = null;
  id;
  date;
  tableName;
  adventure;
  dm;
  timeStart;
  notes;
  spots;

  constructor(root, data){
    this.root = root;
    this.id = data.id;
    this.date = data['date'];
    this.tableName = data.table_name;
    this.adventure = data.adventure;
    this.dm = data.dm;
    this.timeStart = data.time_start;
    this.notes = data.notes;
    this.spots = data.spots;
  }

  getDMName() {
    if(!this.dm) return '';
    return `${this.dm.first_name} ${this.dm.last_name} (${this.dm.nickname})`;
  }

  getWeekDay() {
    const date = new Date(this.date);
    return weekdayOf(date);
  }

  getDateString() {
    if(!this.date) return '';
    const date = new Date(this.date);
    return dateToString(date);
  }

}
