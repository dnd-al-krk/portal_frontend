import {Game} from "./GamesStore";
import {observable} from "mobx";


export default class AdventuresStore {
  @observable root = null;

  constructor(rootStore){
    this.root = rootStore;
  }

  fetch(){
    this.items = [];
    return this.root.fetchData('adventures');
  }
}
