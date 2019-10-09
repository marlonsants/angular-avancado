import { Injector } from '@angular/core';
import { BaseResourceModel } from '../models/base-resource.model';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';

export abstract class BaseResourceService<T extends BaseResourceModel>{

    protected http: HttpClient;
    
    constructor(protected apiPath: string, protected injector: Injector){
        this.apiPath = apiPath;
        this.http = this.injector.get(HttpClient);
    }

    get(): Observable<T[]>{
        return this.http.get(this.apiPath).pipe(
          catchError(this.handleError),
          map(this.jsonDataToResources)
        )
      }
    
    getById(id: number): Observable<T>{
    return this.http.get(`${this.apiPath}/${id}`).pipe(
        catchError(this.handleError),
        map(this.jsonDataToResource)
    )
    }

    create(resource: T): Observable<T>{
    return this.http.post(this.apiPath,resource).pipe(
        catchError(this.handleError),
        map(this.jsonDataToResource)
    )
    }

    update(resource: T): Observable<T>{
    return this.http.put(`${this.apiPath}/${resource.id}`,resource).pipe(
        catchError(this.handleError),
        map(()=> resource)
    )
    }

    delete(id: number): Observable<any>{
    return this.http.delete(`${this.apiPath}/${id}`).pipe(
        catchError(this.handleError),
        map(()=> null)
    )
    }
    //protected methods

    protected jsonDataToResources(jsonData: any[] ): T[]{
    const resources = [];
    jsonData.forEach(element => resources.push(element as T));
    return resources;
    }

    protected jsonDataToResource(jsonData: any): T{
    return jsonData as T;
    }

    protected handleError(error: any): Observable<any>{
    console.log("Erro na requisicao => ",error);

    return throwError(error);
    }
    
    
}