import { CategoryService } from './../../categories/shared/category.service';
import { EntryService } from './../shared/entry.service';
import { Entry } from './../shared/entry.model';
import { Component, OnInit, Injector } from '@angular/core';
import {Validators} from '@angular/forms';
import { Category } from '../../categories/shared/category.model';
import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-component/base-resource-form.compnent';



@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent extends BaseResourceFormComponent<Entry> implements OnInit {

  
  categories: Array<Category>;
  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  };

  ptBr = {
    
    monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
    monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun', 'Jul','Ago','Set','Out','Nov','Dez'],
    dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
    dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
    dayNamesMin: ['D','S','T','Q','Q','S','S'],
    weekHeader: 'Semana',
    firstDay: 0, 
    today:'Hoje',
    clear:'limpar'
     
};

  constructor(
    protected entryService: EntryService,
    protected injector: Injector,
    private categoryService: CategoryService
  ) { 
    super(entryService,new Entry(),injector,Entry.fromJson);
  }

  ngOnInit() {
    this.loadCategories();
    super.ngOnInit();
  }
  
 
  get typeOptions(): Array<any>{
    return Object.entries(Entry.types).map(
      ([key,value]) => {
        return {
          key: key,
          value: value,
        }  
      }
    )
  }
 
  //private methods

  loadCategories() {
    this.categoryService.get().subscribe(
      categories => {
        this.categories = categories;
      }
    )
  }
    

  protected buildResourceForm() : void {
    
    this.resourceForm = this.formBuilder.group({
      id:[null],
      name: [null, [Validators.required, Validators.minLength(3)]],
      categoryId: [null, [Validators.required]],
      category:[null],
      paid: [true, [Validators.required]],
      date: [null, [Validators.required]],
      type: ['expense', [Validators.required]],
      description: [null],
      amount: [null, [Validators.required]]
    } )
  }

  protected setCreationTitle(): string{
    return 'Cadastrar novo lançamento';
  }

  protected setEditionTitle(): string{
    return `Editar lancamento ${this.resource.name}`;
  }
}
