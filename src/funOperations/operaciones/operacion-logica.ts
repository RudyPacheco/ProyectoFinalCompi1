import { ManejoErrors } from "../errores/error-manejo";
import { TipoVar } from "../tablaSimbolos/enum-var";
import { Funcion } from "../tablaSimbolos/funcion";
import { TipoRelacion } from "./enum-relacion";

export class OperationLogica {

    tipoVal!:TipoVar
    errores: ManejoErrors

    constructor(errores: ManejoErrors){
        this.errores = errores
    }

    public expresionEquals(valor1: any, valor2: any): boolean{
        let resultado:boolean = false
        if (this.isMismotipo(valor1, valor2)) {
            switch (this.tipoVal) {
                case TipoVar.INT:
                    resultado = this.relacionalNumber(valor1,valor2,TipoRelacion.EQUALS);
                    break;
                case TipoVar.BOOLEAN:
                    resultado = this.relacionalNumber(this.calcValorBoolean(valor1), this.calcValorBoolean(valor2),TipoRelacion.EQUALS);
                    break;
                case TipoVar.STRING:
                    resultado = this.relacionString(valor1,valor2,TipoRelacion.EQUALS);
                    break;
                case TipoVar.CHAR:
                    resultado = this.relacionString(valor1,valor2,TipoRelacion.EQUALS);
                    break;
                case TipoVar.DOUBLE:
                    resultado = this.relacionalNumber(valor1,valor2,TipoRelacion.EQUALS);
                    break;
                default:
                    break;
            }
        }
        return resultado
    }

    public expresionAnd(valor1: any, valor2: any): boolean{
        let result: boolean = false
        if(this.sonBooleanos(valor1, valor2)){
            if(valor1 && valor2){
                result = true
            }
        }
        return result
    }

    public expresionOR(valor1: any, valor2: any): boolean{
        let result: boolean = false
        if(this.sonBooleanos(valor1, valor2)){
            if(valor1 || valor2){
                result = true
            }
        }
        return result
    }

    public expresionXOR(valor1: any, valor2: any): boolean{
        let result: boolean = false
        if(this.sonBooleanos(valor1, valor2)){
            if(valor1 && valor2){
                result = false
            }else if (valor1 || valor2) {
                result = true
            }
        }
        return result
    }

    public expresionNegation(valor1: any): boolean{
        if ("boolean" == typeof valor1) {
            return !valor1
        } else {
      
            this.errores.capturaExpresiones("Solo se pueden negar booleans", valor1+"")
            return valor1
        }
    }

    public expresioMayorQ(valor1: any, valor2: any): boolean{
        let resultado:boolean = false
        if (this.isMismotipo(valor1, valor2)) {
            switch (this.tipoVal) {
                case TipoVar.INT:
                    resultado = this.relacionalNumber(valor1,valor2,TipoRelacion.MAYORQ);
                    break;
                case TipoVar.BOOLEAN:
                    resultado = this.relacionalNumber(this.calcValorBoolean(valor1), this.calcValorBoolean(valor2),TipoRelacion.MAYORQ);
                    break;
                case TipoVar.STRING:
                    resultado = this.relacionString(valor1,valor2,TipoRelacion.MAYORQ);
                    break;
                case TipoVar.CHAR:
                    resultado = this.relacionString(valor1,valor2,TipoRelacion.MAYORQ);
                    break;
                case TipoVar.DOUBLE:
                    resultado = this.relacionalNumber(valor1,valor2,TipoRelacion.MAYORQ);
                    break;
                default:
                    break;
            }
        }
        return resultado
    }
 
    public expresioMenorQ(valor1: any, valor2: any): boolean{
        let resultado:boolean = false
        if (this.isMismotipo(valor1, valor2)) {
            switch (this.tipoVal) {
                case TipoVar.INT:
                    resultado = this.relacionalNumber(valor1,valor2,TipoRelacion.MENORQ);
                    break;
                case TipoVar.BOOLEAN:
                    resultado = this.relacionalNumber(this.calcValorBoolean(valor1), this.calcValorBoolean(valor2),TipoRelacion.MENORQ);
                    break;
                case TipoVar.STRING:
                    resultado = this.relacionString(valor1,valor2,TipoRelacion.MENORQ);
                    break;
                case TipoVar.CHAR:
                    resultado = this.relacionString(valor1,valor2,TipoRelacion.MENORQ);
                    break;
                case TipoVar.DOUBLE:
                    resultado = this.relacionalNumber(valor1,valor2,TipoRelacion.MENORQ);
                    break;
                default:
                    break;
            }
        }
        
        return resultado
    }

    public expresioMayorOI(valor1: any, valor2: any): boolean{
        let resultado:boolean = false
        if (this.isMismotipo(valor1, valor2)) {
            switch (this.tipoVal) {
                case TipoVar.INT:
                    resultado = this.relacionalNumber(valor1,valor2,TipoRelacion.MAYORIQ);
                    break;
                case TipoVar.BOOLEAN:
                    resultado = this.relacionalNumber(this.calcValorBoolean(valor1), this.calcValorBoolean(valor2),TipoRelacion.MAYORIQ);
                    break;
                case TipoVar.STRING:
                    resultado = this.relacionString(valor1,valor2,TipoRelacion.MAYORIQ);
                    break;
                case TipoVar.CHAR:
                    resultado = this.relacionString(valor1,valor2,TipoRelacion.MAYORIQ);
                    break;
                case TipoVar.DOUBLE:
                    resultado = this.relacionalNumber(valor1,valor2,TipoRelacion.MAYORIQ);
                    break;
                default:
                    break;
            }
        }
        
        return resultado
    }

    public expresioMenorOI(valor1: any, valor2: any): boolean{
        let resultado:boolean = false
        if (this.isMismotipo(valor1, valor2)) {
            switch (this.tipoVal) {
                case TipoVar.INT:
                    resultado = this.relacionalNumber(valor1,valor2,TipoRelacion.MENORIQ);
                    break;
                case TipoVar.BOOLEAN:
                    resultado = this.relacionalNumber(this.calcValorBoolean(valor1), this.calcValorBoolean(valor2),TipoRelacion.MENORIQ);
                    break;
                case TipoVar.STRING:
                    resultado = this.relacionString(valor1,valor2,TipoRelacion.MENORIQ);
                    break;
                case TipoVar.CHAR:
                    resultado = this.relacionString(valor1,valor2,TipoRelacion.MENORIQ);
                    break;
                case TipoVar.DOUBLE:
                    resultado = this.relacionalNumber(valor1,valor2,TipoRelacion.MENORIQ);
                    break;
                default:
                    break;
            }
        }        
        return resultado
    }

    public expresioNoEquals(valor1: any, valor2: any): boolean{
        let resultado:boolean = false
        if (this.isMismotipo(valor1, valor2)) {
            switch (this.tipoVal) {
                case TipoVar.INT:
                    resultado = this.relacionalNumber(valor1,valor2,TipoRelacion.NOEQUALS);
                    break;
                case TipoVar.BOOLEAN:
                    resultado = this.relacionalNumber(this.calcValorBoolean(valor1), this.calcValorBoolean(valor2),TipoRelacion.NOEQUALS);
                    break;
                case TipoVar.STRING:
                    resultado = this.relacionString(valor1,valor2,TipoRelacion.NOEQUALS);
                    break;
                case TipoVar.CHAR:
                    resultado = this.relacionString(valor1,valor2,TipoRelacion.NOEQUALS);
                    break;
                case TipoVar.DOUBLE:
                    resultado = this.relacionalNumber(valor1,valor2,TipoRelacion.NOEQUALS);
                    break;
                default:
                    break;
            }
        }
        
        return resultado
    }

    private relacionString(valor1: string, valor2: string, relation: TipoRelacion): boolean{
        let resultado:boolean = false
        switch (relation) {
            case TipoRelacion.EQUALS:
                if (valor1 == valor2) {
                    resultado = true
                }
                break;
            case TipoRelacion.MAYORQ:
                if(valor1 > valor2){
                    resultado = true
                }
                break;
            case TipoRelacion.MENORQ:
                if(valor1 <  valor2){
                    resultado = true
                }
                break;
            case TipoRelacion.MAYORIQ:
                if(valor1 >= valor2){
                    resultado = true
                }
                break;
            case TipoRelacion.MENORIQ:
                if(valor1 <=  valor2){
                    resultado = true
                }
                break;
            case TipoRelacion.NOEQUALS:
                if(valor1 != valor2){
                    resultado = true
                }
                break;
            default:
                break;
        }
        

        return resultado
    }

    private calcValorBoolean(valor: boolean): number{
        if (valor) {
            return 1;
        } else {
            return 0
        }
    }

    private relacionalNumber(valor1: number, valor2: number, relation: TipoRelacion): boolean{
        let resultado:boolean = false
        switch (relation) {
            case TipoRelacion.EQUALS:
                if(valor1 == valor2){
                    resultado = true
                }
                break;
            case TipoRelacion.MAYORQ:
                if(valor1 > valor2){
                    resultado = true
                }
                break;
            case TipoRelacion.MENORQ:
                if(valor1 <  valor2){
                    resultado = true
                }
                break;
            case TipoRelacion.MAYORIQ:
                if(valor1 >= valor2){
                    resultado = true
                }
                break;
            case TipoRelacion.MENORIQ:
                if(valor1 <=  valor2){
                    resultado = true
                }
                break;
            case TipoRelacion.NOEQUALS:
                if(valor1 != valor2){
                    resultado = true
                }
                break;
            default:
                break;
        }
        return resultado
    }

    private isMismotipo(valor1: any, valor2: any):boolean{
        let mismoTipo:boolean = false
        if("string" == typeof valor1 && "string" == typeof valor2){
            if(valor1.length ==1 && valor2.length == 1){
                this.tipoVal = TipoVar.CHAR
                mismoTipo = true
            }else if(valor1.length !=1 && valor2.length != 1){
                mismoTipo = true
                this.tipoVal = TipoVar.STRING
            }else{
             
                this.errores.capturaExpresiones("Los valores deben de ser del mismo tipo", valor2+"")
                mismoTipo = false
            }
        }else if ("boolean" == typeof valor1 && "boolean" == typeof valor2) {
            this.tipoVal = TipoVar.BOOLEAN
            mismoTipo = true
        } else if ("number" == typeof valor1 && "number" == typeof valor2) {
            if(Number.isInteger(valor1) && Number.isInteger(valor2)){
                this.tipoVal = TipoVar.INT
                mismoTipo = true
            }else if (!Number.isInteger(valor1) && !Number.isInteger(valor2)) {
                this.tipoVal = TipoVar.DOUBLE
                mismoTipo = true
            } else {
              
                this.errores.capturaExpresiones("Los valores deben de ser del mismo tipo", valor2+"")
                mismoTipo = false
            }
        } else{
   
            this.errores.capturaExpresiones("Los valores deben de ser del mismo tipo", valor2+"")
            mismoTipo = false
        }
        
        if (!mismoTipo) {
            this.errores.capturaExpresiones("Los valores deben de ser del mismo tipo", valor2+"")
        }

        return mismoTipo
    }

    private sonBooleanos(valor1: any, valor2: any): boolean{
        if("boolean" == typeof valor1 && "boolean" == typeof valor2){
            return true
        }else{
    
            this.errores.capturaExpresiones("Los valores deben de ser del tipo Boolean", valor2+"")

            return false
        }
    }


    public comparacionIncerteza(val1:any,val2:any, fun:Funcion):any{
        let incerteza=fun.valoInzer
        let resultado=false;
        if (val1 != undefined && val2 != undefined) {
            if (typeof val1 === 'number' && typeof val2 === 'number') {
                let dif=val1 - val2;
                let aux = Math.abs(dif);
                if (incerteza>aux) {
                    resultado=true;
                }      
            }else if (typeof val1 === 'string' && typeof val2 === 'string') {
                let texto1=val1.trim();
                let texto2=val2.trim();
                let aux1 = texto1.toLowerCase();
                let aux2 = texto2.toLowerCase();
                if (aux1===aux2) {
                    resultado = true;
                }

            }else{
                console.log("error de tipo")
                this.errores.capturarErrorSemantico("El tipo de valores no es valido para la comparacion");
            }
        }else{
            //error
            console.log("error incerteza")
            this.errores.capturarErrorSemantico("Valores nulos o indefinidos");
        }
        return resultado;
    }

    public comparacionIncertezaF(val1:any,val2:any):any{
        let incerteza=0.5
        let resultado=false;
        if (val1 != undefined && val2 != undefined) {
            if (typeof val1 === 'number' && typeof val2 === 'number') {
                let dif=val1 - val2;
                let aux = Math.abs(dif);
                if (incerteza>aux) {
                    resultado=true;
                }      
            }else if (typeof val1 === 'string' && typeof val2 === 'string') {
                let texto1=val1.trim();
                let texto2=val2.trim();
                let aux1 = texto1.toLowerCase();
                let aux2 = texto2.toLowerCase();
                if (aux1===aux2) {
                    resultado = true;
                }

            }else{
                console.log("error de tipo")
                this.errores.capturarErrorSemantico("El tipo de valores no es valido para la comparacion");
            }
        }else{
            //error
            console.log("error incerteza")
            this.errores.capturarErrorSemantico("Valores nulos o indefinidos");
        }
        return resultado;
    }
}