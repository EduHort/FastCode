export interface Item{
    nome: string;
    preco: string;
    quantidade: string;
}

export interface Pedido{
    id: string;
    itens: Item[];
    hora: string;
    data: string;
}