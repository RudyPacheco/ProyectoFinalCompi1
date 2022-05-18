import { ManejoErrors } from "../errores/error-manejo"
import { TipoVar } from "./enum-var"
import { Funcion } from "./funcion"
import { Variables } from "./variable"

export class Clase {

    funciones: Array<Funcion>
    variables: Array<Variables>
    items: Array<String>
    errores!:ManejoErrors
    textSali:string = ""
    valorInzerteza = 0.5

    constructor(){
        this.funciones = new Array
        this.variables = new Array
        this.items = new Array
    }

    public limpiarArrays(){
        this.funciones.splice(0,this.funciones.length)
        this.variables.splice(0,this.variables.length)
    }

    public capturarVariableGlobal(tipo: TipoVar, contenido: any){
        for (let index = 0; index < this.items.length; index++) {
            const item = this.items[index];
            if (!this.varYaExistente(item+"")) {
                let variable = new Variables(item,tipo,"clasGlobal",this.errores,contenido)
                this.variables.push(variable) 
            } 
        }
        this.limpiarItems();
    }

    public capturaItems(item:string){
        if (this.items.indexOf(item) != -1) {
           //error no puedes declarar 2 veces la misma vairable
            this.errores.caputuraDeRepitencia("No se puede declarar 2 veces la misma variable :3",item)
        }else{
            this.items.push(item)
        }
    }

    public limpiarItems(){
        this.items.splice(0,this.items.length)
    }

    public varYaExistente(nombre: string): boolean{
        let yaExiste = false;
        for (let index = 0; index < this.variables.length; index++) {
            const variable = this.variables[index];
            if (nombre == variable.nombre) {
                //error vaiable ya existente
                this.errores.caputuraDeRepitencia("La variable ya ha sido declarada!",variable.nombre+"");
                yaExiste = true
                break
            }
        }
        return yaExiste
    }


    public asignarValorVarGlobal(identificador: string, contenido:any): boolean{
        let encontrado = false
        for (let index = 0; index < this.variables.length; index++) {
            const variable = this.variables[index];
            if (variable.nombre == identificador) {
                variable.validacionContenido(contenido)
                encontrado = true
                break;
            }
        }
        return encontrado
    } 

    public setErrors(errores: ManejoErrors){
        this.errores = errores
        
    }

    public instanciaNewFuncion(identificador:string, tipo:TipoVar){
        this.funciones.push(new Funcion(identificador, tipo, this.errores))
        this.funciones[this.funciones.length-1].valoInzer = this.valorInzerteza
    }  
    
    public capturarParametros(identificador:string, tipo:TipoVar){
        if (this.funciones.length != 0 && !this.funciones[this.funciones.length-1].paramRepit(identificador) ) {
            this.funciones[this.funciones.length-1].parametros.push(new Variables(identificador,tipo,this.funciones[this.funciones.length-1].identificado+"",this.errores,this.contenidoParametroTems(tipo)))
        }
    }

    private contenidoParametroTems(tipo:TipoVar): any{
        let contenido
        switch (tipo) {
            case TipoVar.BOOLEAN:
                contenido = true
                break;
            case TipoVar.CHAR:
                contenido = "h"
                break;
            case TipoVar.STRING:
                contenido = "ssss"
                break;
            case TipoVar.INT:
                contenido = 1
                break;
            case TipoVar.DOUBLE:
                contenido = 1.5
                break;
            default:
                break;
        }

        return contenido
    }

    public funcionYaExiste():boolean{
        let yaexiste = false
        let funcionNueva = this.funciones[this.funciones.length-1]
        for (let index = 0; index < this.funciones.length-1; index++) {
            const funcion = this.funciones[index];
            if (this.nombresIguales(funcionNueva, funcion)) {
                if (this.tipoIgual(funcionNueva, funcion)) {
                    if (this.comparacionParametros(funcionNueva, funcion)) {
                        this.errores.capturaExpresiones("La funcion ya existe", funcionNueva.identificado+"")
                        yaexiste = true
                        break
                    }
                }else{
                  //verificar si parametros diferentes  
                    if (this.comparacionParametros(funcionNueva, funcion)) {
                        this.errores.capturaExpresiones("La funcion ya existe con otro tipo de retono, conflicto de llamado de funciones", funcionNueva.identificado+"")
                        yaexiste = true
                        break
                    }
                }
            }
        }
        return yaexiste
    }

    private comparacionParametros(funtio1:Funcion, funtion2:Funcion): boolean{
        let sonIguales = true
        if (funtio1.parametros.length == funtion2.parametros.length) {
            for (let index = 0; index < funtio1.parametros.length; index++) {
                const param = funtio1.parametros[index];
                if (param.tipo !=  funtion2.parametros[index].tipo) {
                    sonIguales = false
                    break
                } 
            }
        }

        return sonIguales
    }

    private comparacionNombrTipo(funtio1:Funcion, funtion2:Funcion): boolean{
        return (funtio1.identificado == funtion2.identificado && funtio1.tipo == funtion2.tipo)
    }

    private nombresIguales(funtio1:Funcion, funtion2:Funcion){
        return funtio1.identificado == funtion2.identificado
    }

    private tipoIgual(funtio1:Funcion, funtion2:Funcion){
        return funtio1.tipo == funtion2.tipo
    } 


    public indexVariable(identificador: string): number{
        let inde = -1
        for (let index = 0; index < this.variables.length; index++) {
            const variable = this.variables[index];
            if (identificador == variable.nombre) {
                inde = index
                break
            }
        }
        return inde
    }
    
    public capturarVariableFuncion(tipo: TipoVar, contenido:any){
        if (this.funciones.length != 0) {
           for (let index = 0; index < this.items.length; index++) {
               const item = this.items[index];
               if (!this.funciones[this.funciones.length-1].varExistente(item+"")) {
                   this.funciones[this.funciones.length-1].variables.push(new Variables(item,tipo,this.funciones[this.funciones.length-1].identificado+"",this.errores,contenido))
               }
           }
        }
        this.limpiarItems()
    }


    public hayFunciones(): boolean{
        return  this.funciones.length != 0
    }

    public capturarInstruccioneFuncion(){
        if (this.hayFunciones()) {
            this.funciones[this.funciones.length-1].caputrarInstrucciones()
        }
    }

    public valorVariable(identificador: string): any{
        let contenido =  null
        for (let index = 0; index < this.variables.length; index++) {
            const variable = this.variables[index];
            if (variable.nombre == identificador) {
                contenido = variable.contenido
                break
            }
        }
        return contenido
    }


    public valorFuncion(identificado:string, parametrosBusqued:Array<any>, parser:any, conRetono:boolean, ejecu:boolean): any{
        let contenido = null
        if (this.hayFunciones()) {
            for (let index = 0; index < this.funciones.length; index++) {
                const funcion = this.funciones[index];
                if (funcion.busquedaParamId(identificado, parametrosBusqued)) {
                    if (!funcion.isFuncion()) {
                        if (conRetono) {
                            //error no es funcion por lo tanto no tiene retorno
                            this.errores.capturarErrorSemantico("Uso incorecto del metodo, no tiene retorno "+identificado);
                            contenido =0
                        } else {
                            if (ejecu) {
                                funcion.realizarInstrucciones(parser, funcion)
                            }
                            contenido = 0
                        }
                    }else {
                        if (ejecu) {
                            funcion.realizarInstrucciones(parser, funcion)
                            //retornar valor verdadero
                            contenido = funcion.getRetorno()
                        }else{
                            contenido = funcion.retornoBasura() 
                        }
                    }
                    break
                }
            }
        }
        return contenido
    }

}