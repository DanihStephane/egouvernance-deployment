import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  // injection par programme (au lieu de le faire dans
  // le constructeur d'un composant)
  // let authService = inject(AuthService);
  let router = inject(Router);

  let authService = inject(AuthService);

  return authService.isLoggedIn().then(
    authentifie => {
      // return true;
      if(authentifie){
        return true;
      }else{
        router.navigate(["/signin"]);
        return false;
      }
    }
  );
};
