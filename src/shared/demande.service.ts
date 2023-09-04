import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import { AuthService } from "./auth.service";
import {Observable} from "rxjs";
import {Reponse} from "./reponse.model";

@Injectable({
  providedIn: 'root'
})
export class DemandeService {

  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,private authService: AuthService
  ) {
  }

  create(
    type: string,
    reason: string,
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    placeOfBirth: string,
    fathersName: string,
    mothersName: string,
    address: string,
    sex: string
  ) {
    console.log(reason);
    console.log(firstName);
    console.log(lastName);
    console.log(dateOfBirth);
    console.log(placeOfBirth);
    console.log(fathersName);
    console.log(mothersName);
    console.log(address);
    console.log(sex);
    let url = '';
    switch (type) {
      case "CIN":
        url = this.apiUrl + "request/cin/initiate";
        break;
      case "BIRTH CERTIFICATE":
        url = this.apiUrl + "request/birthCertificate/initiate";
        break;
      case "RESIDENCE CERTIFICATE":
        url = this.apiUrl + "request/residenceCertificate/initiate";
        break;
      default:
        url = this.apiUrl + "request/cin/initiate";
        break;
    }
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(url, {
      reason,
      firstName,
      lastName,
      dateOfBirth,
      placeOfBirth,
      fathersName,
      mothersName,
      address,
      sex
    }, {headers});
  }

  addAttachment(
    formData: FormData
  ) {
    console.log(formData);
    const url = this.apiUrl + "request/cin/complete";
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(url, formData, {headers});
  }

  getDemandes(page: number, limit: number, mot:string = ''): Observable<Reponse> {
    const url = this.apiUrl + "request/list";
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams()
      .set('mot', mot)
      .set('page', page)
      .set('size', limit);
    return this.http.get<Reponse>(url, {headers,params});
  }

  generateCodeQr(item:any) {
    const url = this.apiUrl + "request/generatePdf/" + item;
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(url, {headers, responseType: 'blob' });
  }

  deleteRequest(item:any): Observable<Reponse> {
    const url = this.apiUrl + "request/cancel";
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Reponse>(url,{'requestId':item},{headers});
  }

  getDemandeById(item:any): Observable<Reponse> {
    const url = this.apiUrl + "request/" + item;
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Reponse>(url, {headers});
  }
}
