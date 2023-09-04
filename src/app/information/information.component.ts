import { Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../shared/auth.service";

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent {
  userName!: string;
  constructor(
    private router: Router,
    private authService: AuthService
  ) {

  }

  ngOnInit(): void {
    this.userName = this.authService.getUserName();
  }

  logout(): void{
    this.authService.logout();
  }

  homePage(): void{
    this.router.navigate(['/homepage']);
  }

  demande(): void{
    this.router.navigate(['/demande']);
  }

  information(): void{
    this.router.navigate(['/information']);
  }
}
