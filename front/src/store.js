import {observable, action} from 'mobx';

export class NavigationStore {
  @observable drawerStatus = false;

  @action.bound
  toggleDrawer(){
    this.drawerStatus = !this.drawerStatus;
  }
}

export class PortalStore {

}
