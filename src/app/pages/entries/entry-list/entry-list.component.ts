import { Component, OnInit } from '@angular/core';
import { Entry } from './../shared/entry.model';
import { EntryService } from './../shared/entry.service';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit {

  entries: Entry[] = [];

  constructor(private entryService: EntryService) { }

  ngOnInit() {
    this.listar();
  }
  
  listar(){
    this.entryService.get().subscribe(
      entries => this.entries = entries.sort((a,b) => b.id - a.id) ,
      () => alert("Erro ao listar as categorias")
    )
  }

  delete(id: number){
    this.entryService.delete(id).subscribe(
      () => this.listar(),
      () => alert("Erro ao excluir a categoria")
    )
  }

}
