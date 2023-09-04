import {Component, NgZone, ViewChild, Inject, LOCALE_ID, Injectable,ChangeDetectorRef  } from '@angular/core';
import {Router} from "@angular/router";
import {CreateComponent} from "../create/CIN/create.component";
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

import {MatMenuModule} from '@angular/material/menu';
import {NgFor} from '@angular/common';

import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import {HttpStatusCode} from "@angular/common/http";
import {NewsService} from "../../../shared/news.service";
import {News} from "../../../shared/news.model";
import {Demande} from "../../../shared/demande.model";
import {CdkFixedSizeVirtualScroll, CdkVirtualScrollViewport,ScrollingModule} from '@angular/cdk/scrolling';
import { filter, map, pairwise, tap } from 'rxjs';
import { AuthService } from '../../../shared/auth.service';
import {DemandeService} from "../../../shared/demande.service";

import { DatePipe } from '@angular/common';

import { saveAs } from 'file-saver';

import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig,MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {DetailComponent} from "../detail/detail.component";

@Injectable({
  providedIn: 'root',
})

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  standalone: true,
  imports: [
    MatCardModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    //Modal
    DialogModule,
    MatIconModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatMenuModule,
    CdkDropListGroup, CdkDropList, NgFor, CdkDrag,DragDropModule,CdkFixedSizeVirtualScroll,CdkVirtualScrollViewport,ScrollingModule,
    DatePipe,
    MatDialogModule,
    FormsModule
  ],
  providers: [
    SnackbarService,
    DatePipe,
    MatDialogModule
  ]
})
export class ListComponent {

  userName!: string;

  errorMessage?: string ;

  news:News[] = [];

  demandes:Demande[] = [];

  //pagination
  page: number=0;
  limit: number=5;
  totalDocs: number = 0;
  totalPages: number = 0;
  hasPrevPage: boolean = false;
  prevPage: number = 0;
  hasNextPage: boolean = false;
  nextPage: number = 0;

  today:string | null ;

  pdfUrl!: string;

  searchQuery: string = '';

  @ViewChild('scroller') scroller!: CdkVirtualScrollViewport;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private demandeService:DemandeService,
    private ngZone: NgZone,
    private authService: AuthService,
    private datePipe: DatePipe,
    private snackbarService:SnackbarService,
    @Inject(LOCALE_ID) private locale: string,
    private cdr: ChangeDetectorRef
  ) {
    this.today = this.datePipe.transform(new Date(), 'dd MMMM yyyy', '', this.locale);
  }

  onSuccessList = (reponse: any) =>{
    if(reponse.code == HttpStatusCode.Ok){
      this.demandes = this.demandes.concat(reponse.data.content);
      for (let key in this.demandes) {
        if (this.demandes.hasOwnProperty(key)) {
          const dateArray = this.demandes[key].requestDate;
          if (dateArray != null) {
            if (dateArray.length <= 7){
              const dateObject = new Date(Number(dateArray[0]), Number(dateArray[1]) - 1, Number(dateArray[2]), Number(dateArray[3]), Number(dateArray[4]), Number(dateArray[5]), Number(dateArray[6]));
              this.demandes[key].requestDate = this.datePipe.transform(dateObject, 'dd MMMM yyyy', '', this.locale);
            }
          }
          switch (this.demandes[key].requestType.code){
            case 'CIN':
              this.demandes[key].illustration = '../../../assets/images/cin.png';
              break;
            case 'BIRTH CERTIFICATE':
              this.demandes[key].illustration = '../../../assets/images/actnaissance.png';
              break;
            case 'RESIDENCE CERTIFICATE':
              this.demandes[key].illustration = '../../../assets/images/residence.png';
              break;
            default:
              this.demandes[key].illustration = '../../../assets/images/cin.png';
          }
        }
      }
      this.setPageProperties(reponse.data);
      console.log(this.demandes);
    }else{
      this.errorMessage = reponse.message;
      console.log(this.errorMessage);
    }
  }

  getDemandes() {
    this.demandeService.getDemandes(this.page,this.limit).subscribe(
      this.onSuccessList
    );
  }

  ngOnInit(): void {
    this.userName = this.authService.getUserName();
    this.getDemandes();
  }

  setPageProperties(data: any){
    this.page = data.number;
    this.limit = data.size;
    this.totalDocs = data.totalDocs;
    this.totalPages = data.totalPages;
    this.hasPrevPage = data.hasPrevPage;
    this.prevPage = data.prevPage;
    this.hasNextPage = data.hasNextPage;
    this.nextPage = data.nextPage;
  }

  ngAfterViewInit() {
    console.log("after view init");
    if(!this.scroller) return;
    this.scroller.elementScrolled()
      .pipe(
        tap(event => {
        }),
        map(event => {
          return this.scroller.measureScrollOffset('bottom');
        }),
        tap(y => {
        }),
        pairwise(),
        tap(([y1, y2]) => {
        }),
        filter(([y1, y2]) => {
          return y2 < y1 && y2 < 100;
        }),
      )
      .subscribe((val) => {
        this.ngZone.run(() => {
          if(this.page > this.totalPages) return;
          this.page = (this.page + 1);
          this.getAddDemandeForScroll();
        });
      });
  }

  getAddDemandeForScroll() {
    this.demandeService.getDemandes(this.page,this.limit).subscribe(
      this.onSuccessList
    );
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

  viewDetails(item: any) {
    let dialogRef = this.dialog.open(DetailComponent, {
      data: { itemId: item }
    });
  }

  deleteRequest(item: any) {
    this.demandeService.deleteRequest(item).subscribe(
      this.onSuccessCanceled,
      err=> this.snackbarService.openSnackBar('La demande ne peut pas être annuler', 'Fermer', 3000)
    );
  }

  onSuccessCanceled = (reponse: any) =>{
    if(reponse.code == HttpStatusCode.Ok){
      this.snackbarService.openSnackBar('Le demande a été annuler', 'Fermer', 3000);
      this.demandes = [];
      this.page = 0;
      this.demandeService.getDemandes(this.page,this.limit,this.searchQuery).subscribe(
        this.onSuccessList
      );
    }else{
      this.snackbarService.openSnackBar('L annulation a été refuser', 'Fermer', 3000);
      console.log(this.errorMessage);
    }
  }

  gererateCodeQr(item: any) {
    this.ngZone.run(() => {
      this.demandeService.generateCodeQr(item).subscribe(
        this.onSuccessGenerated,
        err=> this.snackbarService.openSnackBar('Le Code QR ne peut pas être générer pour cette demande', 'Fermer', 3000)
      );
    });
  }

  onSuccessGenerated = (reponse: any) =>{
    const pdfBlob = new Blob([reponse], { type: 'application/pdf' });
    saveAs(pdfBlob);
  }

  performSearch() {
    console.log('Effectuer la recherche pour :', this.searchQuery);
    this.demandes = [];
    this.page = 0;
    if(this.searchQuery){
      this.demandeService.getDemandes(this.page,this.limit,this.searchQuery).subscribe(
        this.onSuccessList
      );
    }else {
      this.demandeService.getDemandes(this.page,this.limit).subscribe(
        this.onSuccessList
      );
    }
  }
}
