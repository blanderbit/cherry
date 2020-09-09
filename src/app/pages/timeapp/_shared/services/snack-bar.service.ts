import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Injectable()
export class SnackBarService {

  constructor(private snackBar: MatSnackBar) { }

  openSnackBar(message: string, type: string = 'success', duration: number = 4000, action: string = 'OK'): void {
    const config = new MatSnackBarConfig();

    config.duration = duration;
    config.horizontalPosition = 'right';
    config.verticalPosition = 'bottom';

    config.panelClass = [type];

    this.snackBar.open(message, action, config);
  }
}
