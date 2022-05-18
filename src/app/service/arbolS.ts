import { nodoTree } from "src/models/nodoTree";

export class arbolS {

    nodos: nodoTree[] = [];
    hijos: nodoTree[] = [];
    nodoAux = new nodoTree("","",[]);



    constructor() {
    
    }


    crearNodo(valor:any,tipo:any,valorp:any,tipop:any) {
 /*        if (this.nodoAux.valor==="") {
            this.nodoAux=new nodoTree(valor,tipo,tipop,valorp);
        }else{
            if (this.nodoAux.hijos.includes(new nodoTree(valor,tipo,tipop,valorp))) {
                
            }
        }

       let nodoA = new nodoTree(valor,tipo,tipop,valorp);
       this.nodos.push(nodoA); */
    }

    public agregarNodo(nodo:nodoTree){
        this.nodos.push(nodo);
    }

    public limpiarNodos(){
        this.nodos=[]
    }


}