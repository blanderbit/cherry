import { Injectable } from '@angular/core';

export interface UserStorage {
    userName: string;
}


@Injectable()
export class LocalStorageService {
  protected userDataKey: string;

  constructor() {
    this.userDataKey = 'currentUser';

    this.initStorage();
  }

  private initStorage() {
    const userData = this.getCurrentUserData();

    if (!userData) {
      this.setCurrentUserData({userName: ''});
    }
  }

  setCurrentUserData(data: UserStorage): void {
    localStorage.setItem(this.userDataKey, JSON.stringify(data));
  }

  getCurrentUserData(): UserStorage {
    return JSON.parse(localStorage.getItem(this.userDataKey));
  }

  clearStorage(): void {
    localStorage.clear();

    this.initStorage();
  }
}
