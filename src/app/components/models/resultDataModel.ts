
import { TypeofExpr } from "@angular/compiler"
export class Root {
    messages!: Message[];
    status!: number;
    data!: StartApiData;
}

export class Message {
    logLevel!: number;
    text!: string;
}

export class StartApiData {
    allPossibleCombinationsCount!: number;
    startCombination!: number[];
}
export class GetAllApi {
    messages!: Message[];
    status!: number;
    data!: TableApiData;
}
export class TableApiData {
    combination: any;
    combinationsCount!: number;
    combinations: any;
    combinationsPage!: CombinationsPage;
}

export class CombinationsPage {
    totalPages!: number;
    totalRecords!: number;
    dataPage!: number[][];
    pageNumber!: number;
    pageSize!: number;
}
