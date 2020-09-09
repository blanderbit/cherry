import { Injectable } from '@angular/core';

import { HttpWrapperService } from './api';
import { LocalStorageService } from './local-storage.service';

import { Observable, of } from 'rxjs';

@Injectable()
export class AuthService {

  constructor(private httpService: HttpWrapperService,
              private localStorageService: LocalStorageService) {
  }

  clearSession(): void {
    this.localStorageService.clearStorage();
  }

  signIn()/*: Observable<any>*/ {
  }

  signUp() /*: Observable<any>*/ {
  }

  forgotPassword(email: string): Observable<any> {
      return of(null);
  }

  resetPassword() /*: Observable<any>*/ {
  }
}
