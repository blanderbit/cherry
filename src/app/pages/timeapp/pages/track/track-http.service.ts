import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// import {TrackModule}  from './track.module';
import { HttpWrapperService } from '../../_shared/services/api';

@Injectable()
export class TrackHttpService {

  constructor(private httpService: HttpWrapperService) {}
  //
  // // tasks
  // getListTasksBySearch(search: string): Observable<any> {
  //   return this.httpService.get('task/name', {search, count: 10000});
  // }

  // getListTasksByDate(date: string): Observable<any> {
  //   return this.httpService.get('task/date', {date, count: 10000});
  // }

  // getListTasksByPeriod(startDate: string, endDate: string): Observable<any> {
  //   return this.httpService.get('task/period', {startDate, endDate, count: 10000});
  // }

  createNewTaskForSelectedDay(name: string): Observable<any> {
    return this.httpService.post('task', {name});
  }

  createNewTaskTimeForSelectedTaskAndDate(taskId: number, date: string, time: number): Observable<any> {
    return this.httpService.post('task/time', {taskId, date, time});
  }

  updateTaskProject(taskId: number, projectId: number): Observable<any> {
    return this.httpService.patch(`task/${taskId}/project`, {projectId});
  }

  updateTaskIsActive(taskId: number, isActive: boolean): Observable<any> {
    return this.httpService.patch(`task/${taskId}/active`, {isActive});
  }

  updateTaskTimeEntity(taskTimeId: number, time: number): Observable<any> {
    return this.httpService.patch(`task/time/${taskTimeId}/time`, {time});
  }

  deleteTaskTime(timeId: number): Observable<any> {
    return this.httpService.delete(`task/time/${timeId}`);
  }

  deleteAllTaskTimesByIdAndPeriod(taskId: number, startDate: string, endDate: string): Observable<any> {
    return this.httpService.delete(`task/time/${taskId}/period`, {startDate, endDate});
  }

  // projects
  // getListProjectsBySearch(search: string): Observable<any> {
  //   return this.httpService.get('project/name', {search, count: 10000});
  // }

  createProject(name: string): Observable<any> {
    return this.httpService.post('project', {name});
  }

  // comments
  getCommentByTaskTimeId(taskTimeId: number): Observable<any> {
    return this.httpService.get('comment', {taskTimeId});
  }

  getCommentListForSelectedPeriod(taskId: number, periodStartDate: string, periodEndDate: string): Observable<any> {
    return this.httpService.get('comment/period', {taskId, periodStartDate, periodEndDate});
  }

  createUpdateCommentByTaskTimeId(dataForUpdate: { taskTimeId: number, text: string }[]): Observable<any> {
    return this.httpService.post('comment', dataForUpdate);
  }

  // export
  exportTasksTimes(startDate: string, endDate: string): Observable<any> {
    return this.httpService.get('task/period/export', {
        startDate,
        endDate,
        count: 10000
      }, {
        responseType: 'text'
      },
      {
        'content-Type': 'application/octet-stream'
      }
    );
  }
}
