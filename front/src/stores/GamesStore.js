import {observable, action} from 'mobx';

export default class GamesStore {
  @observable root = null;
  @observable items = [];

  constructor(root){
    this.root = root
  }

  fetch(){
    this.items = [];
    return this.root.fetchData('games').then(data => data.map(game_data => {
      this.items.push(new Game(this, game_data));
    }));
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
    const weekday = new Array(7);
    weekday[0] =  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    return weekday[new Date(this.date).getDay()];
  }

  getDateString() {
    if(!this.date) return '';
    const d = new Date(this.date);
    return ("0" + d.getDate()).slice(-2) + '.' + ("0" + (d.getMonth()+1)).slice(-2);
  }

}
