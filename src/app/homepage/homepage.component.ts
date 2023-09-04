import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
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
import {NewsService} from "../../shared/news.service";
import {News} from "../../shared/news.model";
import {CdkFixedSizeVirtualScroll, CdkVirtualScrollViewport,ScrollingModule} from '@angular/cdk/scrolling';
import { filter, map, pairwise, tap } from 'rxjs';
import { AuthService } from '../../shared/auth.service';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  standalone: true,
  imports: [
    MatCardModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    CdkDropListGroup, CdkDropList, NgFor, CdkDrag,DragDropModule,CdkFixedSizeVirtualScroll,CdkVirtualScrollViewport,ScrollingModule
  ],
})
export class HomepageComponent implements OnInit {
  userName!: string;

  errorMessage?: string ;

  news:News[] = [];

  //pagination
  page: number=0;
  limit: number=5;
  totalDocs: number = 0;
  totalPages: number = 0;
  hasPrevPage: boolean = false;
  prevPage: number = 0;
  hasNextPage: boolean = false;
  nextPage: number = 0;

  @ViewChild('scroller') scroller!: CdkVirtualScrollViewport;

  constructor(
    private newsService:NewsService,
    private ngZone: NgZone,
    private router: Router,
    private authService: AuthService
  ) {

  }

  onSuccessList = (reponse: any) =>{
    if(reponse.code == HttpStatusCode.Ok){
      this.news = this.news.concat(reponse.data.content);
      this.setPageProperties(reponse.data);
    }else{
      this.errorMessage = reponse.message;
      console.log(this.errorMessage);
    }
  }

  getNews() {
    this.newsService.getNews(this.page,this.limit).subscribe(
      this.onSuccessList
    );
  }

  ngOnInit(): void {
    this.userName = this.authService.getUserName();
    this.getNews();
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

  logout(): void{
    this.authService.logout();
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
          this.getAddNewsForScroll();
        });
      });
  }

  getAddNewsForScroll() {
    this.newsService.getNews(this.page,this.limit).subscribe(
      this.onSuccessList
    );
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
