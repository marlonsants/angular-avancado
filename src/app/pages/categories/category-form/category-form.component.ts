import { CategoryService } from './../shared/category.service';
import { Category } from './../shared/category.model';
import { Component, Injector } from '@angular/core';
import { Validators} from '@angular/forms';
import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-component/base-resource-form.compnent';


@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent extends BaseResourceFormComponent<Category> {
   
  constructor(protected categoryService: CategoryService, protected injector: Injector) { 
    
    super(categoryService,new Category(),injector,Category.fromJson);
  }

  protected buildResourceForm() : void {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required,Validators.minLength(2)]],
      description: [null]
    })
  }

  protected setCreationTitle(): string{
    return 'Cadastrar nova categoria';
  }

  protected setEditionTitle(): string{
    return `Editar categoria ${this.resource.name}`;
  }


 

 
  
  

}
