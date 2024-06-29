
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { HttpParams } from '@angular/common/http';
import { HttpGeneralService } from 'src/app/services/http-general.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { DataQuery } from '../models/dataQueryModel';
import { StartApiData } from '../models/resultDataModel';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { CombinationElement } from '../combinations-table/combinations-table.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';

export class combinationTimes {
  key!: String;
  value!: any;
}

@Component({

  selector: 'app-stepper-editable',
  templateUrl: './stepper-editable.component.html',
  styleUrls: ['./stepper-editable.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    DatePipe,
  ],
})
export class StepperEditableComponent implements OnInit {
  private restURL = 'https://localhost:7136/api/NumberCombinations';
  public resultStartApi = new StartApiData();
  public stepsNCombinations: any = 0;
  public nextNCombinations: any;
  public combinationTimesSteps: any;
  public backCombination: any;

  public counterCombination: number = 0;
  displayedColumns: string[] = ['position', 'description', 'combination'];

  public dataApi: any;
  public data: any = [];
  public numberOption: any = 0;
  public pageSize: number = 10
  public tableItems: Array<CombinationElement> = [];
  public lastCombination: any;
  public combinationNumber: any = 0;
  public combinationsTotal: number = 0;
  pageIndex = 0;
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  pageEvent!: PageEvent;
  resultsLength = 0;
  isLoadingResults = false;
  dataSource: any;

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', [Validators.pattern("^[0-9]*$"), Validators.min(1),
    Validators.max(20)]],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: [[0], Validators.required],
  });
  nextFormGroup = this._formBuilder.group({
    nextCtrl: [[]],
  });
  isEditable = false;
  paginator: any;

  constructor(private service: HttpGeneralService, private _formBuilder: FormBuilder) {

  }

  onSubmitFirstStep() {
    this.counterCombination = 1;
    this.getStart();
  }

  getAllByN() {
    this.counterCombination = 0;
    this.data = [];
    this.dataSource = new MatTableDataSource<any>([]);
    this.getStart();
    this.onPaginatorStep();
  }

  getStart() {
    let paramValue = new DataQuery();
    paramValue.N = this.firstFormGroup.value.firstCtrl;

    if (paramValue.N > 11) {
      this.showFirstLastButtons = false;
    }
    let uriParamsArr = new HttpParams().set('DataQuery.N', paramValue.N);
    if (this.firstFormGroup.valid) {
      this.isLoadingResults = true;
      this.service.GetData(`${this.restURL}/StartApi`, uriParamsArr).subscribe((result: any) => {
        this.resultStartApi = result.data;
        this.combinationsTotal = this.resultStartApi.allPossibleCombinationsCount;
        this.resultsLength = this.stepsNCombinations = this.combinationsTotal;
        this.secondFormGroup.get('secondCtrl')?.setValue(this.resultStartApi.startCombination);
        this.pageIndex = 0;
      });
    }
  }

  onPaginatorStep() {
    let paramValue = new DataQuery();

    paramValue.N = this.firstFormGroup.value.firstCtrl;
    if (this.firstFormGroup.valid && paramValue.N > 0) {
      let pageNumber = this.pageIndex + 1;
      this.combinationNumber = 0;
      this.service.GetData(`${this.restURL}/GetAll?DataQuery.N=${paramValue.N}&PageNumber=${pageNumber}&PageSize=${this.pageSize}`).subscribe((result: any) => {
        this.dataApi = result.data;
        this.tableItems = new Array<CombinationElement>();
        if (this.dataApi.combinationsPage.dataPage && this.dataApi.combinationsPage.dataPage.length > 0) {
          this.combinationNumber = this.pageSize * this.pageIndex;
          for (let i = 0, optionNum = this.combinationNumber; i < this.pageSize && i < this.dataApi.combinationsPage.dataPage.length; i++, optionNum++) {
            let item: CombinationElement = {
              position: optionNum + 1,
              description: `combination ${optionNum + 1}`,
              combination: this.dataApi.combinationsPage.dataPage[i],
            };
            this.lastCombination = this.dataApi.combinationsPage.dataPage[i];
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

  onClickBack() {
    if (this.counterCombination > this.stepsNCombinations) {
      this.counterCombination = 1;
    } else {
      this.counterCombination--;
    }
    this.secondFormGroup.get('secondCtrl')?.setValue(this.backCombination);
  }

  onSubmitNextCombination() {
    let dataQuery = {
      "dataQuery": {
        "currentCombination":
          this.nextFormGroup.value.nextCtrl
      }
    };
    if (this.nextFormGroup.valid) {
      this.service.PostHttpWebApi(`${this.restURL}/GetNextApi`, dataQuery).subscribe((result: any) => {
        this.nextNCombinations = result.data.combination;
        if (this.nextNCombinations) {
          this.backCombination = this.nextFormGroup.value.nextCtrl;
          this.nextFormGroup.get('nextCtrl')?.setValue(this.nextNCombinations);
          if (this.counterCombination <= this.stepsNCombinations)
            this.counterCombination++;
          else this.counterCombination = 0;
        }
        console.log('Next Step', this.nextFormGroup.value);
      });
    }
    console.log('FORM', this.nextFormGroup.value);
  }

  onSubmitSecondCombination() {
    let dataQuery = {
      "dataQuery": {
        "currentCombination":
          this.secondFormGroup.value.secondCtrl
      }
    };

    if (this.secondFormGroup.valid) {
      this.service.PostHttpWebApi(`${this.restURL}/GetNextApi`, dataQuery).subscribe((result: any) => {
        this.nextNCombinations = result.data.combination;
        if (this.nextNCombinations) {
          this.backCombination = this.nextFormGroup.value.nextCtrl;
          this.nextFormGroup.get('nextCtrl')?.setValue(this.nextNCombinations);
          if (this.counterCombination <= this.stepsNCombinations)
            this.counterCombination++;
        }
      });
    }
  }

  onPaginatorFirstCombination() {
    if (!!this.secondFormGroup.value.secondCtrl) {
      const arrCombination = this.secondFormGroup.value.secondCtrl;
      console.log(arrCombination);
      let dataQuery = {
        "pageNumber": 1,
        "pageSize": this.pageSize,
        "dataQuery": {
          "currentCombination": arrCombination
        }
      };
      console.log('this.secondFormGroup', this.secondFormGroup);
      this.pageIndex = 0;
      if (this.secondFormGroup.valid) {
        this.GetNextRecords(dataQuery);
      }
    }
  }

  onPaginatorNext() {
    if (!!this.nextFormGroup.value.nextCtrl) {
      const arrCombination = this.nextFormGroup.value.nextCtrl;
      console.log(arrCombination);
      let dataQuery = {
        "pageNumber": 1,
        "pageSize": this.pageSize,
        "dataQuery": {
          "currentCombination": arrCombination
        }
      };
      console.log('this.nextFormGroup', this.nextFormGroup);
      this.pageIndex = 0;
      if (this.nextFormGroup.valid) {
        this.GetNextRecords(dataQuery);
      }
    }
  }

  onPaginatorNextInTable() {
    let dataQuery = {
      "pageNumber": 1,
      "pageSize": this.pageSize,
      "dataQuery": {
        "currentCombination": this.lastCombination
      }
    };
    this.GetNextRecords(dataQuery);
  }

  GetNextRecords(dataQuery: any) {
    this.service.PostHttpWebApi(`${this.restURL}/GetAllNextApiByCurrent`, dataQuery).subscribe((result: any) => {
      this.dataApi = result.data;
      this.tableItems = new Array<CombinationElement>();
      this.resultsLength = this.dataApi.combinationsTotal;
      if (this.dataApi.combinations && this.dataApi.combinations.length > 0) {
       // let optionDesc: number = this.nextNCombinations + this.pageIndex;
        let optionDesc: number = this.counterCombination + this.pageIndex * this.pageSize;
        this.resultsLength = this.resultsLength - this.counterCombination;
        for (let i = 0, optionNum = optionDesc; i < this.pageSize && i < this.dataApi.combinations.length; i++, optionNum++) {
          let item: CombinationElement = {
            position: optionNum + 1,
            description: `combination ${optionNum + 1}`,
            combination: this.dataApi.combinations[i],
          };
          this.lastCombination = this.dataApi.combinations[i];
          this.tableItems.push(item);
        }
        console.log(' this.tableItems', this.tableItems);
      }
      this.isLoadingResults = false;
      this.data = this.tableItems;
      this.dataSource = new MatTableDataSource<any>(this.tableItems);
    });
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.resultsLength = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    //   let pageNumber = this.paginator.getNumberOfPages()
    this.onPaginatorNextInTable();
  }

  resetNumber() {
    location.reload();
  }

  ngOnChanges(changes: any) {
  }
  ngOnInit(): void {
  }

}
