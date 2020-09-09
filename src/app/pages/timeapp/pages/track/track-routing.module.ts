import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackComponent } from './track.component';
import { DayViewComponent } from './day-view/day-view.component';
import { WeekViewComponent } from './week-view/week-view.component';
import { ViewMode } from '../../models/view-mode.enum';

export const navigableComponents = [
  TrackComponent
];

export const TrackRoutes = {
    week: 'week',
    day: 'day'
};

const routes: Routes = [
  {
      path: '',
      component: TrackComponent,
      children: [
          {
              path: ViewMode.Week,
              component: WeekViewComponent,
          },
          {
              path: ViewMode.Day,
              component: DayViewComponent,
          },
          {
              path: '',
              pathMatch: 'full',
              redirectTo: ViewMode.Week,
          }
      ]
  },
  {
      path: '**',
      redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackRoutingModule {
}
