import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  API_URL = environment.apiUrl;
  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  constructor(
    private http: HttpClient
  ) {
  }

  public get(url: string, query: any): Observable<any> {
    return this.http.get(API_URL + url, { headers: this.headers, params: query }).pipe(
      catchError(this.handleError)
    );
  }

  public getDistance(query: any): Observable<any> {
    query.key = environment.googleMapApi;
    return this.http.get('https://maps.googleapis.com/maps/api/distancematrix/json', { headers: this.headers, params: query }).pipe(
      catchError(this.handleError)
    );
  }
  // Error 
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(error.error);
  }

}
