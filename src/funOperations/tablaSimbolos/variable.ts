import { ManejoErrors } from "../errores/error-manejo"
import { TipoVar } from "./enum-var"

export class Variables {
    
    nombre!:String
    tipo!: TipoVar
    funtionPadre!: string
    contenido!:any
    errores!:ManejoErrors

    constructor(nombre: String, tipo: TipoVar, funtionPadre: string, errores:ManejoErrors, contenido: any){
        this.nombre = nombre;
        this.errores = errores
        this.funtionPadre = funtionPadre;
        this.tipo = tipo;
        if (contenido != null) {
            this.validacionContenido(contenido);
        } else {
            this.contenido = contenido;
        }
    }

    public validacionContenido(contenido: any){
        switch (this.tipo) {
            case TipoVar.BOOLEAN:
                this.destinoBoolean(contenido)
                break;
            case TipoVar.CHAR:
                this.destinoChar(contenido)
                break;
            case TipoVar.STRING:
                this.destinoString(contenido)
                break;
            case TipoVar.INT:
                this.destinoInt(contenido)
                break;
            case TipoVar.DOUBLE:
                this.destinoDouble(contenido)
                break;
            default:
                break;
        }
    }

    private destinoString(contenido:any){
        if ("boolean" == typeof contenido) {
            if (contenido) {
                this.contenido = "1"
            } else {
                this.contenido = "0"
            }
        } else {
            this.contenido = contenido+"";
        }
    }

    private destinoDouble(contenido: any){
        if ("string" == typeof contenido && contenido.length != 1) {
  
            this.errores.capturarErrorSemantico("Tipo Incorrecto, no se puede asignar un string a una Double :)");
        } else if("number" == typeof contenido) {
            this.contenido= contenido
        } else if ("boolean" == typeof contenido) {
            if (contenido) {
                this.contenido = 1
            } else {
                this.contenido = 0
            }
        } else if ("string" == typeof contenido && contenido.length == 1){
            this.contenido = contenido.charCodeAt(0)
        }
    }

    private destinoBoolean(contenido:any){
        if ("string" == typeof contenido && contenido.length != 1) {

            this.errores.capturarErrorSemantico("Tipo incorrecto, no se puede asignar un String a un Boolean")
        } else if("number" == typeof contenido) {
     
           this.errores.capturarErrorSemantico("Tipo Incorrecto, no se puede asignar un Int/Double a una Boolean :)");
        } else if ("boolean" == typeof contenido) {
            this.contenido = contenido
        } else if ("string" == typeof contenido && contenido.length == 1){
  
            this.errores.capturarErrorSemantico("Tipo Incorrecto, no se puede asignar un Chat a una Boolean :)");
        }
    }

    private destinoInt(contenido:any){
        if ("string" == typeof contenido && contenido.length != 1) {
    
            this.errores.capturarErrorSemantico("Tipo Incorrecto, no se puede asignar un string a una Int :)");
        } else if("number" == typeof contenido) {
            if (Number.isInteger(contenido)) {
                this.contenido = contenido
            } else {
                this.contenido = Math.trunc(contenido)
            }
        } else if ("boolean" == typeof contenido) {
            if (contenido) {
                this.contenido = 1
            } else {
                this.contenido = 0
            }
        } else if ("string" == typeof contenido && contenido.length == 1){
            this.contenido = contenido.charCodeAt(0) 
        }
    }

    private destinoChar(contenido:any){
        if ("string" == typeof contenido && contenido.length != 1) {
          
            this.errores.capturarErrorSemantico("Tipo Incorrecto, no se puede asignar un string a una Char :)");
        } else if("number" == typeof contenido) {
            if (Number.isInteger(contenido)) {
                if (contenido <= 255 && contenido >= 0) {
                    this.contenido = String.fromCharCode(contenido)
                } else {
                    //erro el valor esta fuera de rango en la tabla ascii
                    this.errores.capturarErrorSemantico("Sobrepaso el rango de tabla ASCII XD");
                }
                this.contenido = contenido
            } else {
                //error no se puede asignar un double a un char
                this.errores.capturarErrorSemantico("Tipo Incorrecto, no se puede asignar un Double a una Char :)");
            }
        } else if ("boolean" == typeof contenido) {
            //error no se puede asignar un boolean a un char
            this.errores.capturarErrorSemantico("Tipo Incorrecto, no se puede asignar un boolean a una Char :)");
        } else if ("string" == typeof contenido && contenido.length == 1){
            this.contenido = contenido 
        }
    }

    
}