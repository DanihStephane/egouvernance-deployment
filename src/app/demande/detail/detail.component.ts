import {Component, LOCALE_ID, OnInit, Optional} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { Router } from '@angular/router';
import {DialogRef} from "@angular/cdk/dialog";
import {DemandeService} from "../../../shared/demande.service";
import {Demande} from "../../../shared/demande.model";
import {HttpStatusCode} from "@angular/common/http";
import {SnackbarService} from "../../../shared/snackbar.service";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit  {
  constructor(
    public dialogRef: DialogRef,
    private router: Router,
    private demandeService:DemandeService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbarService:SnackbarService,
    private datePipe:DatePipe,
    @Inject(LOCALE_ID) private locale: string) {

  }
  itemId!: string;
  demande!:Demande;
  ngOnInit(): void {
    this.demandeService.getDemandeById(this.data.itemId).subscribe(
      (reponse: any) => {
        if (reponse.code == HttpStatusCode.Ok) {
          this.demande = reponse.data
          const dateArray = this.demande.requestInfoResponse.dateOfBirth;
          if (dateArray != null) {
            const dateObject = new Date(Number(dateArray[0]), Number(dateArray[1]) - 1, Number(dateArray[2]));
            this.demande.requestInfoResponse.dateOfBirth = this.datePipe.transform(dateObject, 'dd MMMM yyyy', '', this.locale);
          }
          const sex = this.demande.requestInfoResponse.sex;
          if (sex != null){
            if (sex === 'M'){
              this.demande.requestInfoResponse.sex = 'Homme';
            }else if(sex === 'F'){
              this.demande.requestInfoResponse.sex = 'Femme';
            }
          }
        } else {
          this.snackbarService.openSnackBar('La récupération du demande a échoué', 'Fermer', 3000);
        }
      },
      err=> this.snackbarService.openSnackBar('La récupération du demande a échoué', 'Fermer', 3000)
    );
  }
}
