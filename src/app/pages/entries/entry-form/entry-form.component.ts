import { CategoryService } from './../../categories/shared/category.service';
import { EntryService } from './../shared/entry.service';
import { Entry } from './../shared/entry.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import { Category } from '../../categories/shared/category.model';



@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submitingForm: boolean =  false;
  entry: Entry = new Entry();
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
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
    this.loadCategories();
  }
  

  ngAfterContentChecked(){
    this.setPageTitle();
  }
  
  submitForm(){
    this.submitingForm = true;
    if(this.currentAction == 'new')
      this.createEntry();
    else
      this.updateEntry();
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
  
  private updateEntry() {
    const entry = Object.assign(new Entry(),this.entryForm.value);
    console.log(entry);
    this.entryService.update(entry)
      .subscribe(
        entryResponse => {this.actionAfterSuccess(entryResponse)},
        error => {this.actionAfterError()}
      );
  }
  
  private createEntry() {
    const entry = Object.assign(new Entry(),this.entryForm.value);
    this.entryService.create(entry)
      .subscribe(
        entryResponse => {this.actionAfterSuccess(entryResponse)},
        error => {this.actionAfterError()}
      );
  }

  private actionAfterSuccess(entry){
    this.messageService.add({severity:'success', summary:'Solciitação processada com sucesso !'});

    this.router.navigateByUrl('entries');
    this.router.navigate(['entries',entry.id,'edit']);
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

  private buildEntryForm() {
    
    this.entryForm = this.formBuilder.group({
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

  private  loadEntry() {
    if(this.currentAction == 'edit'){
      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get('id')))
      )
      .subscribe(
        (entry) => {
          this.entry = entry;
          this.entryForm.patchValue(entry);
        },
        (error) => {
          this.messageService.add({severity:'error', summary:'Ocorreu um erro no servidor, tente novamente mais tarde'});
        }
      )
    }
  }

  private setPageTitle() {
    if(this.currentAction == 'new'){
      this.pageTitle = "Cadastrar novo lançamento";
    }
    else{
      const entryName = this.entry.name || "";
      this.pageTitle = `Editando lançamento: ${entryName}`;
    }
  }
  
  

}
