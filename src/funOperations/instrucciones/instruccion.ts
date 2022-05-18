import { TipoInstruc } from "./enuminstruc"

export class Instruccion {
    scope:number
    tipo: TipoInstruc
    instruccionesAnidadas = ""
    condicionSi = false

    constructor(scope:number, tipo:TipoInstruc){
        this.scope = scope
        this.tipo = tipo
    }


    


}