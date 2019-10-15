import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { OnInit, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import { BaseResourceModel } from '../../models/base-resource.model';


export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit {

  currentAction: string;
  resourceForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submitingForm: boolean =  false;
  
  route: ActivatedRoute;
  router: Router;
  formBuilder: FormBuilder;
  messageService: MessageService;

  constructor(
    protected resourceService: BaseResourceService<T>,
    public resource: T,
    protected injector: Injector,
    protected jsonDataToResourceFn: (jsonData: any) => T 
    
  ) { 
      this.route = this.injector.get(ActivatedRoute);
      this.router = this.injector.get(Router);
      this.formBuilder = this.injector.get(FormBuilder);
      this.messageService = this.injector.get(MessageService);
  }

  ngOnInit() {
    this.setCurrentAction();
    this.buildResourceForm();
    this.loadResource();
  }

  ngAfterContentChecked(){
    this.setPageTitle();
  }
  
  submitForm(){
    this.submitingForm = true;
    if(this.currentAction == 'new')
      this.createResource();
    else
      this.updateResource();
  }
  
 
  //private methods

  private updateResource() {
    const resource = this.jsonDataToResourceFn(this.resourceForm.value);
    this.resourceService.update(resource)
      .subscribe(
        resourceResponse => {this.actionAfterSuccess(resourceResponse)},
        error => {this.actionAfterError()}
      );
  }
  
  private createResource() {
    const resource = this.jsonDataToResourceFn(this.resourceForm.value);
    this.resourceService.create(resource)
      .subscribe(
        resourceResponse => {this.actionAfterSuccess(resourceResponse)},
        error => {this.actionAfterError()}
      );
  }

  private actionAfterSuccess(resource){

    const componentBasePath: string = this.route.snapshot.parent.url[0].path;
    this.messageService.add({severity:'success', summary:'Solciitação processada com sucesso !'});

    this.router.navigateByUrl(componentBasePath);
    this.router.navigate([componentBasePath,resource.id,'edit']);
  }

  private actionAfterError() {
    this.messageService.add({severity:'error', summary:'Ocorreu um erro no servidor, tente novamente mais tarde'});
  }

  private setCurrentAction() {
    if(this.route.snapshot.url[0].path == 'new')
      this.currentAction = 'new';
    else
      this.currentAction = 'edit';
  }
  
  private  loadResource() {
    if(this.currentAction == 'edit'){
      this.route.paramMap.pipe(
        switchMap(params => this.resourceService.getById(+params.get('id')))
      )
      .subscribe(
        (resource) => {
          this.resource = resource;
          this.resourceForm.patchValue(resource)
        },
        (error) => {
          this.messageService.add({severity:'error', summary:'Ocorreu um erro no servidor, tente novamente mais tarde'});
        }
      )
    }
  }

  protected setPageTitle() {
    if(this.currentAction == 'new'){
      this.pageTitle = this.setCreationTitle();
    }
    else{
      
      this.pageTitle = this.setEditionTitle();
    }
  }

  protected setCreationTitle(): string{
      return 'Novo';
  }

  protected setEditionTitle(): string{
    return 'Edição';
}
  
protected abstract buildResourceForm() : void
  

}
