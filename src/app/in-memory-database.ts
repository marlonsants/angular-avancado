import {InMemoryDbService} from 'angular-in-memory-web-api';

export class InMemoryDataBase implements InMemoryDbService {
    createDb(){
        const categories = [
            {id: 1, name: "Lazer", description: "Praia, viagem, parque aquatico"},
            {id: 2, name: "Moradia", description: "Pagamentos das contas de casa"},
            {id: 3, name: "Saúde", description: "Palno de saúde e remedios"},
            {id: 4, name: "Salário", description: "Recebimento de salário"},
            {id: 5, name: "Freelas", description: "Trabalhos com freelancer"}
        ];

        return {categories};
        
    }

}