import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class DecryptService {
    // Definie l'url de l'API
    algo = "";
    apiURL = 'http://localhost:3000';


    constructor(private http: HttpClient, public router: Router) { }

    // login(user): Observable<User> {
    //     return this.http.post<User>(this.apiURL + '/user', JSON.stringify(user), this.httpOptions)
    //       .pipe(
    //         retry(1),
    //         catchError(this.handleError)
    //       )
    //   }



}