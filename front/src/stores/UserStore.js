import {action, computed, observable} from "mobx";
import {API_HOSTNAME} from "../config";

export default class UserStore {
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
