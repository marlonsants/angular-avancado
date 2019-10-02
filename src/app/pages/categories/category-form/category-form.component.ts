import { CategoryService } from './../shared/category.service';
import { Category } from './../shared/category.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import {MessageService} from 'primeng/api';



@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submitingForm: boolean =  false;
  category: Category = new Category();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCatgoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked(){
    this.setPageTitle();
  }
  
  submitForm(){
    this.submitingForm = true;
    if(this.currentAction == 'new')
      this.createCategory();
    else
      this.updateCategory();
  }
  
 
  //private methods

  private updateCategory() {
    const category = Object.assign(new Category,this.categoryForm.value);
    this.categoryService.update(category)
      .subscribe(
        categoryResponse => {this.actionAfterSuccess(categoryResponse)},
        error => {this.actionAfterError()}
      );
  }
  
  private createCategory() {
    const category = Object.assign(new Category,this.categoryForm.value);
    this.categoryService.create(category)
      .subscribe(
        categoryResponse => {this.actionAfterSuccess(categoryResponse)},
        error => {this.actionAfterError()}
      );
  }

  private actionAfterSuccess(category){
    this.messageService.add({severity:'success', summary:'Solciitação processada com sucesso !'});

    this.router.navigateByUrl('categories');
    this.router.navigate(['categories',category.id,'edit']);
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

  private buildCatgoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required,Validators.minLength(2)]],
      description: [null]
    })
  }

  private  loadCategory() {
    if(this.currentAction == 'edit'){
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get('id')))
      )
      .subscribe(
        (category) => {
          this.category = category;
          this.categoryForm.patchValue(category)
        },
        (error) => {
          this.messageService.add({severity:'error', summary:'Ocorreu um erro no servidor, tente novamente mais tarde'});
        }
      )
    }
  }

  private setPageTitle() {
    if(this.currentAction == 'new'){
      this.pageTitle = "Cadastrar nova categoria";
    }
    else{
      const categoryName = this.category.name || "";
      this.pageTitle = `Editando Categoria: ${categoryName}`;
    }
  }
  
  

}
