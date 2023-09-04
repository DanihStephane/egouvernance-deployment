import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { AuthService } from "../../shared/auth.service";
import { SnackbarService } from "../../shared/snackbar.service";
import { TOKEN_STORAGE, FIRSTNAME_STORAGE, LASTNAME_STORAGE } from '../../shared/constants'

@Component({
  providers:[
    AuthService,
    SnackbarService
  ],
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {

  email: string = "nantenaina@gmail.com";
  password: string = "123456";

  constructor(private authService:AuthService, private router: Router,private snackbarService: SnackbarService) { }

  onSubmit() {
    const onSuccess = (res: any)=>{
      this.authService.saveSession(res.data);
      this.router.navigate(['/homepage']);
    };
    this.authService.signin(this.email, this.password)
      .subscribe(
        onSuccess,
        err=> this.snackbarService.openSnackBar('Votre authentification est incorrect, veiller recommencer', 'Fermer', 3000)
      )
  }
}
