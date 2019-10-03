import { Category } from '../../categories/shared/category.model';

export class Entry{
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public type?: string,
        public amount?: number,
        public date?: string,
        public paid?: boolean,
        public categoryId?: number,
        public category?: Category
    ){  }

    static types = {
        revenue: "Receita",
        expense: "Despesa"
    }

    public paidText(): string{
        return this.paid ? "Pago" : "Pendente";
    } 
        
    
}