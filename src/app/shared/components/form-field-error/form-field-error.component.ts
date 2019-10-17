
import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-form-field-error',
  template: `
    <p class="text-danger">
      {{errorMessage}}
    </p>
  `,
  styleUrls: ['./form-field-error.component.css']
})
export class FormFieldErrorComponent implements OnInit {
  

  @Input('form-control') formControl: FormControl

  constructor() { }

  ngOnInit() {
  }

  get errorMessage(): string | null{
    if(this.mustShowErro()){
      if(this.formControl.errors.required)
        return 'Este campo é obrigatório';

      else if(this.formControl.errors.minlength){
        const requiredLength = this.formControl.errors.minlength.requiredLength;
        return `O campo deve ter no mínimo ${requiredLength} caracter(es)`;
      }

      else if(this.formControl.errors.email)
        return 'O email digitado não é válido';
        
    }
  }

  private mustShowErro(): boolean {
    return this.formControl.invalid && this.formControl.touched;
  }

}
