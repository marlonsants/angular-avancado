import { Entry } from './pages/entries/shared/entry.model';
import { Category } from './pages/categories/shared/category.model';
import {InMemoryDbService} from 'angular-in-memory-web-api';

export class InMemoryDataBase implements InMemoryDbService {
    createDb(){
        const categories: Category[] = [
            {id: 1, name: "Lazer", description: "Praia, viagem, parque aquatico"},
            {id: 2, name: "Moradia", description: "Pagamentos das contas de casa"},
            {id: 3, name: "Saúde", description: "Palno de saúde e remedios"},
            {id: 4, name: "Salário", description: "Recebimento de salário"},
            {id: 5, name: "Freelas", description: "Trabalhos com freelancer"}
        ];

        const entries: Entry[] = [
            {id: 1, name:"teste 1", categoryId: categories[0].id, category: categories[0], paid: true, date: "19/09/2019", type: "revenue", description: "descricao teste 1", amount: 70.50} as Entry,
            {id: 2, name:"teste 2", categoryId: categories[1].id, category: categories[1], paid: false, date: "19/08/2019", type: "expense", description: "descricao teste 2", amount: 80.50 } as Entry,
            {id: 3, name:"teste 3", categoryId: categories[2].id, category: categories[2], paid: true, date: "19/07/2019", type: "revenue", description: "descricao teste 3", amount: 90.50} as Entry,
            {id: 4, name:"teste 4", categoryId: categories[3].id, category: categories[3], paid: true, date: "19/06/2019", type: "expense", description: "descricao teste 4", amount: 100.50} as Entry,
            {id: 5, name:"teste 5", categoryId: categories[1].id, category: categories[1], paid: false, date: "19/05/2019", type: "expense", description: "descricao teste 5", amount: 110.50} as Entry,
            {id: 6, name:"teste 6", categoryId: categories[2].id, category: categories[2], paid: true, date: "19/04/2019", type: "revenue", description: "descricao teste 6", amount: 120.50} as Entry,
            {id: 7, name:"teste 7", categoryId: categories[3].id, category: categories[3], paid: false, date: "19/03/2019", type: "expense", description: "descricao teste 7", amount: 130.50} as Entry
        ]

        return {categories, entries};
        
    }

}