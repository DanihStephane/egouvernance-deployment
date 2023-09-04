import { Component,OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { CreateComponent as CINCreateComponent } from "../create/CIN/create.component";
import { CreateComponent as BirthCertificateCreateComponent } from "../create/BIRTH-CERTIFICATE/create.component";
import { CreateComponent as ResidenceCertificateCreateComponent } from "../create/RESIDENCE-CERTIFICATE/create.component";
import { Dialog,  DialogModule } from '@angular/cdk/dialog';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import {MatSnackBarModule} from "@angular/material/snack-bar";
import {SnackbarService} from "../../../shared/snackbar.service";

import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from "../../../shared/auth.service";
import {MatMenuModule} from '@angular/material/menu';
import {CdkDrag, CdkDropList, CdkDropListGroup, DragDropModule} from "@angular/cdk/drag-drop";
import {DatePipe, NgFor} from "@angular/common";
import {CdkFixedSizeVirtualScroll, CdkVirtualScrollViewport, ScrollingModule} from "@angular/cdk/scrolling";
import {MatDialog,MatDialogModule } from "@angular/material/dialog";

@Component({
  selector: 'app-list-create',
  templateUrl: './list-create.component.html',
  styleUrls: ['./list-create.component.css'],
  standalone: true,
  imports: [
    MatCardModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    //Modal
    MatIconModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatMenuModule,
    CdkDropListGroup, CdkDropList, NgFor, CdkDrag,DragDropModule,CdkFixedSizeVirtualScroll,CdkVirtualScrollViewport,ScrollingModule,
    DatePipe,
    MatDialogModule
  ],
  providers: [
    SnackbarService
  ]
})
export class ListCreateComponent implements OnInit {
  userName!: string;
  constructor(
    private router: Router,
    public dialog: MatDialog,
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

  create(): void{
    this.router.navigate(['/create']);
  }

  openCreateDemandeModal(type : string): void {
    let dialogRef = null;
    switch (type) {
      case "CIN":
        dialogRef = this.dialog.open(CINCreateComponent);
        break;
      case "BIRTH CERTIFICATE":
        dialogRef = this.dialog.open(BirthCertificateCreateComponent);
        break;
      case "RESIDENCE CERTIFICATE":
        dialogRef = this.dialog.open(ResidenceCertificateCreateComponent);
        break;
      default:
        dialogRef = this.dialog.open(CINCreateComponent);
        break;
    }
  }
}
