import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../shared/auth.service";
import { SnackbarService } from "../../shared/snackbar.service";
import { TOKEN_STORAGE, FIRSTNAME_STORAGE, LASTNAME_STORAGE } from '../../shared/constants'

@Component({
  providers:[
    AuthService,
    SnackbarService
  ],
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  address: string = '';
  dateOfBirth: string = '';
  password: string = '';

  constructor(private authService:AuthService, private router: Router,private snackbarService: SnackbarService) { }

  onSubmit() {
    const onSuccess = (res: any)=>{
      this.router.navigate(['/signin']);
    };
    this.authService.signup(
      this.firstName ?? '',
      this.lastName ?? '',
      this.email ?? '',
      this.phoneNumber ?? '',
      this.address ?? '',
      this.dateOfBirth ?? '',
      this.password ?? ''
    )
      .subscribe(
        onSuccess,
        err => {
          const error: any = err; // Vous pouvez également ignorer cette ligne si vous n'avez pas besoin de typer 'err'.
          this.snackbarService.openSnackBar('Votre inscription est incorrecte, veuillez recommencer', 'Fermer', 3000);
        }
      )
  }
}
