import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { HomepageComponent } from './homepage/homepage.component';
import { SignupComponent } from './signup/signup.component';
import { InformationComponent } from "./information/information.component";
import {ListComponent} from "./demande/list/list.component";
import {CreateComponent} from "./demande/create/CIN/create.component";
import {ListCreateComponent} from "./demande/list-create/list-create.component";
import { authGuard } from "../shared/auth.guard";


const routes: Routes = [
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'homepage', component: HomepageComponent , canActivate: [authGuard]},
  { path: 'information', component: InformationComponent , canActivate: [authGuard]},
  { path: 'demande', component: ListComponent , canActivate: [authGuard]},
  { path: 'create', component: ListCreateComponent , canActivate: [authGuard]},
  { path: '', redirectTo: '/signin', pathMatch: 'full' }, // Redirection par défaut vers la page de connexion
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
