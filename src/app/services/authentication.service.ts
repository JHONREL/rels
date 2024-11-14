import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  //Login Function
  login(data: any): Observable<User> {
    return this.http.post<User>('http://localhost/rels/pdo/api/login', data);
  }

  registration(data: any): Observable<string> {
    return this.http.post<string>(
      'http://localhost/rels/pdo/api/register',
      data
    );
  }
}
