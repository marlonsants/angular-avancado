import { OnInit } from '@angular/core';
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { BaseResourceModel } from '../../models/base-resource.model';


export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  resources: T[] = [];

  constructor(protected resourceService: BaseResourceService<T>) { }

  ngOnInit() {
    this.listar();
  }
  
  listar(){
    this.resourceService.get().subscribe(
      resources => this.resources = resources.sort((a,b) => b.id - a.id) ,
      () => alert("Erro ao listar as categorias")
    )
  }

  delete(id: number){
    this.resourceService.delete(id).subscribe(
      () => this.listar(),
      () => alert("Erro ao excluir a categoria")
    )
  }

}
