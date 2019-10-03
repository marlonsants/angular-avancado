import { EntryService } from './../shared/entry.service';
import { Entry } from './../shared/entry.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import {MessageService} from 'primeng/api';



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

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCatgoryForm();
    this.loadEntry();
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
  
 
  //private methods

  private updateEntry() {
    const entry = Object.assign(new Entry,this.entryForm.value);
    this.entryService.update(entry)
      .subscribe(
        entryResponse => {this.actionAfterSuccess(entryResponse)},
        error => {this.actionAfterError()}
      );
  }
  
  private createEntry() {
    const entry = Object.assign(new Entry,this.entryForm.value);
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

  private buildCatgoryForm() {
    this.entryForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      categoryId: [null, [Validators.required]],
      paid: [null, [Validators.required]],
      date: [null, [Validators.required]],
      type: [null, [Validators.required]],
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
          this.entryForm.patchValue(entry)
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
