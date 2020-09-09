import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor() {
  }

  handleError(error: any) {
    console.log('global error:', error);
    // IMPORTANT: Rethrow the error otherwise it gets swallowed
    throw error;
  }
}
