import {observable, action} from 'mobx';
import axios from 'axios';
import Cookie from 'js-cookie';


const csrftoken = Cookie.get('csrftoken');
export const axiosInstance = axios.create({headers: {'X-CSRFToken': csrftoken}});

export class NavigationStore {
  @observable drawerStatus = false;

  @action.bound
  toggleDrawer(){
    this.drawerStatus = !this.drawerStatus;
  }
}

export class PortalStore {

}


export class UserStore {
  @observable profile_id;
  @observable user_id;
  @observable first_name;
  @observable last_name;
  @observable nickname;
  @observable dci;

  @action.bound
  fetchData(){
    return new Promise((resolve, reject) => {
      axios.get("http://localhost:8000/api/current_user/")
        .then((response) => {
          const data = response.data;
          console.log(data);
          this.profile_id = data.id;
          this.user_id = data.user.id;
          this.first_name = data.user.first_name;
          this.last_name = data.user.last_name;
          this.nickname = data.nickname;
          this.dci = data.dci;
          resolve(response.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  @action.bound
  saveData(){
    return new Promise((resolve, reject) => {
      axiosInstance.put(`http://localhost:8000/api/profiles/${this.profile_id}/`,
        {
          'id': this.profile_id,
          'user': {
            'id': this.user_id,
            'first_name': this.first_name,
            'last_name': this.last_name,
          },
          'nickname': this.nickname,
          'dci': this.dci,
        }).then((response) => {
          resolve(response.data);
      })
        .catch((err) => {
          reject(err);
        });
    })
  }
}
