import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class HttpGeneralService {

  private appWebServiceUrlExternalWebApi!: string;

  constructor(private http: HttpClient) {

  }


  PostData<T>(url: string, bodyParams: any, uriParamsArr: HttpParams) {
    return this.http.post<T>(url, bodyParams, { params: uriParamsArr });
  }

  GetData<T>(url: string, uriParamsArr?: HttpParams, id?: any) {

    return this.http.get<T>(url, { params: uriParamsArr });
  }

  PutData<T>(url: string, bodyParams: any, uriParamsArr: HttpParams) {
    return this.http.put<T>(url, bodyParams, { params: uriParamsArr });
  }

  DeleteData<T>(url: string, uriParamsArr: HttpParams, id: any = null) {

    if (id != null) url = url + `/` + id;
    return this.http.delete<T>(url, { params: uriParamsArr });

  }

  PostHttpWebApi(url: string, bodyParams: any) {
    return this.http.post(url, bodyParams);
  }

  PutchData<T>(url: string, bodyParams: any) {
    return this.http.patch<T>(url, bodyParams);
  }


}
