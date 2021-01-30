import { Injectable } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { ApiService } from './api.service';
import { RequestParamsFleet, RequestParamsFleetRoutes } from '@app/data/schema/query'
import { ResponseFleetLastData, ResponseFleetRawData } from '@app/data/schema/response'
@Injectable({
  providedIn: 'root'
})

export class TrackingService {
  constructor(
    private apiService: ApiService
  ) {
  }

  public getLastData(query: RequestParamsFleet): Observable<ResponseFleetLastData> {
    return this.apiService.get('getLastData', query);
  }
  public getRawData(query: RequestParamsFleetRoutes): Observable<ResponseFleetRawData> {
    return this.apiService.get('getRawData', query);
  }
  public getShortestDistance(query: any): Observable<any> {
    query.units = 'METRIC';
    return this.apiService.getDistance(query);
  }
}