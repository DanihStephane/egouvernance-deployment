import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, filter, forkJoin, map, Observable, of, pairwise, tap} from 'rxjs';
import {environment} from "../environments/environment";
import { NEW } from './constants';
import {Reponse} from './reponse.model';
import {News} from "./news.model";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})

export class NewsService {
  news: News[] = [];
  uri_api = environment.apiUrl + NEW;

  constructor(
    private http: HttpClient,
    private authService: AuthService) {
  }

  getNews(page: number, limit: number): Observable<Reponse> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams()
      .set('page', page)
      .set('size', limit);
    return this.http.get<Reponse>(this.uri_api, {headers,params});
  }
}
