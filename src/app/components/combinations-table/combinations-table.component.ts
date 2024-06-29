
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { DataQuery } from '../models/dataQueryModel';
import { HttpGeneralService } from 'src/app/services/http-general.service';
import { FormBuilder, Validators } from '@angular/forms';
import { CombinationsPage, GetAllApi, StartApiData, TableApiData } from '../models/resultDataModel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-combinations-table',
  styleUrls: ['./combinations-table.component.css'],
  templateUrl: './combinations-table.component.html',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    CommonModule,
    NgIf,
    NgFor,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,],
})
export class CombinationsTableComponent {
  displayedColumns: string[] = ['position', 'description', 'combination'];

  public dataApi: any;
  public data: any = [];
  public resultStartApi = new StartApiData();
  public numberParam: any = 0;
  public pageSize: number = 10
  public tableItems: Array<CombinationElement> = [];

  pageIndex = 0;
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  pageEvent!: PageEvent;
  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;

  public firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(1),
    Validators.max(20)]],
  });
  public secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });


  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  private restURL = 'https://localhost:7136/api/NumberCombinations';
  dataSource: any;
  constructor(private service: HttpGeneralService, private _formBuilder: FormBuilder) { }

  onPaginatorStep() {
    let paramValue = new DataQuery();

    paramValue.N = this.firstFormGroup.value.firstCtrl;
    if (this.firstFormGroup.valid && paramValue.N > 0) {
      let pageNumber = this.pageIndex + 1;
      this.service.GetData(`${this.restURL}/GetAll?DataQuery.N=${paramValue.N}&PageNumber=${pageNumber}&PageSize=${this.pageSize}`).subscribe((result: any) => {
        this.dataApi = result.data;
        this.tableItems = new Array<CombinationElement>();
        if (this.dataApi.combinationsPage.dataPage && this.dataApi.combinationsPage.dataPage.length > 0) {
          let optionDesc: number = this.pageSize * this.pageIndex;
          for (let i = 0, optionNum = optionDesc; i < this.pageSize && i < this.dataApi.combinationsPage.dataPage.length; i++, optionNum++) {
            let item: CombinationElement = {
              position: optionNum + 1,
              description: `combination ${optionNum + 1}`,
              combination: this.dataApi.combinationsPage.dataPage[i],
            };
            this.tableItems.push(item);
          }
          console.log(' this.tableItems', this.tableItems);
        }
        this.isLoadingResults = false;
        this.data = this.tableItems;
        this.dataSource = new MatTableDataSource<any>(this.tableItems);
      });
    }
  }


  onPaginatorStepByCurrentCombination() {

    if (!!this.secondFormGroup.value.secondCtrl) {
      this.pageIndex = 0;
      const arrCombination = this.secondFormGroup.value.secondCtrl.split(',').filter(Boolean).map(num => parseInt(num.trim(), 10));
      console.log(arrCombination);
      let dataQuery = {
        "pageNumber": 1,
        "pageSize": this.pageSize,
        "dataQuery": {
          "currentCombination": arrCombination
        }
      };
      console.log('this.secondFormGroup', this.secondFormGroup);
      if (this.secondFormGroup.valid) {
        this.service.PostHttpWebApi(`${this.restURL}/GetAllNextApiByCurrent`, dataQuery).subscribe((result: any) => {
          this.dataApi = result.data;
          this.tableItems = new Array<CombinationElement>();
          this.resultsLength = this.dataApi.combinationsTotal;
          if (this.dataApi.combinations && this.dataApi.combinations.length > 0) {
            let optionDesc: number = this.pageSize * this.pageIndex;
            for (let i = 0, optionNum = optionDesc; i < this.pageSize && i < this.dataApi.combinations.length; i++, optionNum++) {
              let item: CombinationElement = {
                position: optionNum + 1,
                description: `combination ${optionNum + 1}`,
                combination: this.dataApi.combinations[i],
              };
              this.tableItems.push(item);
            }
            console.log(' this.tableItems', this.tableItems);
          }
          this.isLoadingResults = false;
          this.data = this.tableItems;
          this.dataSource = new MatTableDataSource<any>(this.tableItems);
        });
      }
    }
  }

  getAllByN() {
    let paramValue = new DataQuery();
    this.data = [];
    this.dataSource = new MatTableDataSource<any>([]);
    paramValue.N = this.firstFormGroup.value.firstCtrl;
    this.isLoadingResults = true;
    if (paramValue.N > 11) {
      this.showFirstLastButtons = false;
    }
    let uriParamsArr = new HttpParams().set('DataQuery.N', paramValue.N);
    if (this.firstFormGroup.valid) {
      this.service.GetData(`${this.restURL}/StartApi`, uriParamsArr).subscribe((result: any) => {
        this.resultStartApi = result.data;
        this.resultsLength = this.resultStartApi.allPossibleCombinationsCount;
        this.pageIndex = 0;
        this.onPaginatorStep();
      });
    }
  }


  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.resultsLength = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    let pageNumber = this.paginator.getNumberOfPages()
    this.onPaginatorStep();
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      let p = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  resetNumber() {
    location.reload();
  }
  ngOnChanges(changes: any) {
    console.log('changes', changes);
  }
}

export class CombinationElement {
  position!: number;
  description!: string;
  combination!: number[];
}
