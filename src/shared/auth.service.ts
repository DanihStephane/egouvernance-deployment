import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import { FIRSTNAME_STORAGE, LASTNAME_STORAGE, TOKEN_STORAGE } from './constants';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
  }

  signin(email: string, password: string) {
    console.log(email);
    console.log(password);
    const url = this.apiUrl + "user/login";
    return this.http.post(url, {
      email,
      password
    });
  }

  signup(
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    address: string,
    dateOfBirth: string,
    password: string
  ) {
    console.log(firstName);
    console.log(lastName);
    console.log(email);
    console.log(phoneNumber);
    console.log(address);
    console.log(dateOfBirth);
    console.log(password);
    const url = this.apiUrl + "user/register";
    return this.http.post(url, {
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      dateOfBirth,
      password
    });
  }

  isLoggedIn(){
    const isUserLoggedIn = new Promise((resolve, reject) => {
      const token = localStorage.getItem(TOKEN_STORAGE);
      var res: boolean = (token)? true: false;
      resolve(res);
    });
    // on renvoie la promesse qui dit si on est connecté
    return isUserLoggedIn;
  }

  saveSession(data: any){
    localStorage.setItem(FIRSTNAME_STORAGE, data.firstName);
    localStorage.setItem(LASTNAME_STORAGE, data.lastName);
    localStorage.setItem(TOKEN_STORAGE, data.token);
  }

  getUserName(): string{
    let userName = localStorage.getItem(FIRSTNAME_STORAGE);
    let lastName = localStorage.getItem(LASTNAME_STORAGE);
    return userName + " " + lastName;
  }

  getToken(): string | null{
    return localStorage.getItem(TOKEN_STORAGE);
  }

  logout(){
    localStorage.clear();
    this.router.navigateByUrl("/signin");
  }
}
