import { Component, OnInit } from '@angular/core';
import { Category } from './../shared/category.model';
import { CategoryService } from './../shared/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  categories: Category[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.listar();
  }
  
  listar(){
    this.categoryService.get().subscribe(
      categories => this.categories = categories,
      () => alert("Erro ao listar as categorias")
    )
  }

  delete(id: number){
    this.categoryService.delete(id).subscribe(
      () => this.listar(),
      () => alert("Erro ao excluir a categoria")
    )
  }

}
