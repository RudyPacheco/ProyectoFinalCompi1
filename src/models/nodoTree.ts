export class nodoTree{
    valor:any;
    tipo:any;
    hijos: nodoTree[];
    padreTipo:any;
    padreValor:any;

   /*  constructor(valor :any,tipo:any,padreT?:any,padreV?:any){
        this.valor=valor;
        this.tipo=tipo;
        
            this.hijos=[];
        
        if (padreT) {
            this.padreTipo=padreT;
        }
        if (padreV) {
            this.padreValor=padreV;
        }

    } */
    constructor(valor :any,tipo:any,hijos:nodoTree[]){
        this.valor=valor;
        this.tipo=tipo;
        this.hijos=hijos;

    }
    

    agregarHijo(hijo:any){
        this.hijos.push(hijo);
    }


}