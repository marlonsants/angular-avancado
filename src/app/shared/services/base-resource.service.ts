import { Injector } from '@angular/core';
import { BaseResourceModel } from '../models/base-resource.model';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';

export abstract class BaseResourceService<T extends BaseResourceModel>{

    protected http: HttpClient;
    
    constructor(
        protected apiPath: string,
        protected injector: Injector,
        protected jsonDataToResourceFn: (jsonData: any) => T
        ){

        this.apiPath = apiPath;
        this.http = this.injector.get(HttpClient);
    }

    get(): Observable<T[]>{
        return this.http.get(this.apiPath).pipe(
          map(this.jsonDataToResources.bind(this)),
          catchError(this.handleError)
          
        )
      }
    
    getById(id: number): Observable<T>{
    return this.http.get(`${this.apiPath}/${id}`).pipe(
        map(this.jsonDataToResource.bind(this)),
        catchError(this.handleError)
        
    )
    }

    create(resource: T): Observable<T>{
    return this.http.post(this.apiPath,resource).pipe(
        map(this.jsonDataToResource.bind(this)),
        catchError(this.handleError)
        
    )
    }

    update(resource: T): Observable<T>{
    return this.http.put(`${this.apiPath}/${resource.id}`,resource).pipe(
        map(()=> resource),
        catchError(this.handleError),
        
    )
    }

    delete(id: number): Observable<any>{
    return this.http.delete(`${this.apiPath}/${id}`).pipe(
        map(()=> null),
        catchError(this.handleError)
        
    )
    }
    //protected methods

    protected jsonDataToResources(jsonData: any[] ): T[]{
        const resources: T[] = [];
        jsonData.forEach(element => {
            const resource = this.jsonDataToResourceFn(element);
            resources.push(resource);
          }
        );
        return resources;
      }

    protected jsonDataToResource(jsonData: any): T{
    return this.jsonDataToResourceFn(jsonData);
    }

    protected handleError(error: any): Observable<any>{
    console.log("Erro na requisicao => ",error);

    return throwError(error);
    }
    
    
}