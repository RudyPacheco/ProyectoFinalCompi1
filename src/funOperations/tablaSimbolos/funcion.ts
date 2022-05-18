import { arbolS } from "src/app/service/arbolS"
import { nodoTree } from "src/models/nodoTree"
import { ManejoErrors } from "../errores/error-manejo"
import { TipoInstruc } from "../instrucciones/enuminstruc"
import { Instruccion } from "../instrucciones/instruccion"
import { TipoVar } from "./enum-var"
import { TableSimbol } from "./tabla-simbolo"
import { Variables } from "./variable"

export class Funcion {

    variables: Array<Variables>
    identificado: String
    tipo:TipoVar
    retorno: any = null 
    parametros: Array<Variables>
    errores: ManejoErrors
    instrucciones :string = ""
    instrucs : Instruccion = new Instruccion(1, TipoInstruc.LIBRE)
    scope = 0 
    itemsMostrar: Array<string> = new Array
    textoSalida:string = ""
    identificadores: Array<string> = new Array
    contenidVar!:any
    valoInzer = 0.5

    constructor(identificador: String, tipo: TipoVar, errores: ManejoErrors){
        this.variables = new Array
        this.identificado = identificador
        this.tipo = tipo
        this.parametros = new Array
        this.errores = errores;
    }

    public isFuncion(): boolean{
        return this.tipo != TipoVar.VOID
    }


    public retornoBasura(): any{
        let retorns
        switch (this.tipo) {
            case TipoVar.BOOLEAN:
                retorns = false
                this.retorno = false
                break;
            case TipoVar.INT:
                retorns = 0
                this.retorno = 0
                break;
            case TipoVar.DOUBLE:
                retorns = 0.1
                this.retorno = 0.0001
                break;
            case TipoVar.STRING:
                retorns = "ssss"
                this.retorno = "retonsssss"
                break;
            case TipoVar.CHAR:
                retorns = "s"
                this.retorno = "s"
                break
            default:
                break;
        }

        return retorns
    }
    
    public paramRepit(identificador:string): boolean{
        let repetido = false
        for (let index = 0; index < this.parametros.length; index++) {
            const parametro = this.parametros[index];
            if (identificador == parametro.nombre) {
                this.errores.capturarErrorSemantico("Parametro repetido en la funcion: "+this.identificado)
                repetido = true
                break
            }
        }

        return repetido
    }

    public indexVariable(identificador:string): number{
        let varia = this.parametros
        let pos = -1
        varia = varia.concat(this.variables)
        for (let index = 0; index < varia.length; index++) {
            const variable = varia[index];
            if (identificador == variable.nombre) {
                pos = index
                break
            }
        }

        return pos
    }
    
    public varExistente(identeificador: string): boolean {
        let yaExiste = false
        let varia = this.parametros
        varia = varia.concat(this.variables)
        for (let index = 0; index < varia.length; index++) {
            const variable = varia[index];
            if (variable.nombre == identeificador) {
                yaExiste = true
                //erro variable ya ha sido declarada en la funcion x
                this.errores.capturaExpresiones("La variable ya ha sido declarada", identeificador)
                break
            }
        }


        return yaExiste
    }

    public asignarValorVariable(identificador: string, contenido:any): boolean{
        let yaExiste = false
        let vari = this.parametros
        vari = vari.concat(this.variables)
        for (let index = 0; index < vari.length; index++) {
            const variable = vari[index];
            if (variable.nombre == identificador) {
                yaExiste = true
                variable.validacionContenido(contenido)
                break
            }
        }
        return yaExiste
    }

    public caputrarInstrucciones(){
        this.instrucciones = this.errores.instrucciones
        this.errores.limpiarInstruciones()
        this.errores.capturarInstruciones = false
    }

    public busquedaParamId(identificado:string, parametrosBusqued:Array<any>): boolean{
        if (identificado == this.identificado  && this.compararParametros(parametrosBusqued)) {
           this.actulizarContenidoParametros(parametrosBusqued)
            return true
        }else{
            return false
        }
    }

    private compararParametros(parametrosBusqued:Array<any>): boolean{
        let iguales = true
        if (parametrosBusqued.length == this.parametros.length) {
            for (let index = 0; index < parametrosBusqued.length; index++) {
                const parametroB = parametrosBusqued[index];
                if (this.tipoVar(parametroB) != this.parametros[index].tipo) {
                    iguales = false
                    break
                }
            } 
        }else{
            iguales = false
        }
        return iguales
    }

    private tipoVar(vari: any): TipoVar{
        if ("boolean"  == typeof vari) {
            return  TipoVar.BOOLEAN
        }else if ("string" == typeof vari && vari.length == 1) {
            return TipoVar.CHAR
        }else if ("number" == typeof  vari) {
           if (Number.isInteger(vari)) {
            return TipoVar.INT
           } else {
               return TipoVar.DOUBLE
           }
        }else{
            return TipoVar.STRING
        }
    }

    private actulizarContenidoParametros(parametrosBusqued:Array<any>){
        for (let index = 0; index < this.parametros.length; index++) {
            const parametro = this.parametros[index];
            parametro.contenido = parametrosBusqued[index]
            
        }
    }

    public realizarInstrucciones(parser:any, funcion:Funcion){   
         parser.Parser.yy.fun= funcion
         parser.Parser.yy.funciones.push(funcion)
         parser.Parser.yy.table.limpiarParametros()
        if (this.instrucciones != "") {
            console.log(this.instrucciones)
            parser.parse(this.instrucciones)
        }else{
            //manejar un posible error que no tenga ningun istruccion (lista de pendientes xd)
        }
        this.textoSalida = ""
        if (parser.Parser.yy.funciones.length > 1) {
            parser.Parser.yy.funciones.pop()
            parser.Parser.yy.fun = parser.Parser.yy.funciones[parser.Parser.yy.funciones.length-1]
        }
    }

    public capturarValorSi(valor:any){
        this.instrucs = new  Instruccion(1,TipoInstruc.SI)
        this.instrucs.condicionSi = valor
    }

    public capturarValorSino(){
        this.instrucs.condicionSi = !this.instrucs.condicionSi
    }

 
    public valorVariable(identificador: string): any{
        let contenido = null
        let vari = this.parametros
        vari = vari.concat(this.variables)
        for (let index = 0; index < vari.length; index++) {
            const variable = vari[index];  
            if (identificador ==  variable.nombre)  {
                contenido = variable.contenido
                break
            }
        }

        return contenido
    }

    public capturarItems(valor:any){
        this.itemsMostrar.push(valor+"")
    }

    public realizarMostrar(table: TableSimbol){
        console.log(this.realizar())
        if (this.realizar()) {
            this.salidaMostrar()
            table.textoSalida += this.textoSalida
            this.textoSalida = ""
        }
       this.itemsMostrar.splice(0,this.itemsMostrar.length)
    }

    public realizar():boolean{
        console.log(this.scope)
        if (this.scope == 1) {
            this.instrucs.condicionSi =  false
            return true
        }else{
            return this.instrucs.condicionSi
        }
    }


    public salidaMostrar(){
        let corchetA = false
        if (this.itemsMostrar.length != 0) {
            const texto = this.itemsMostrar[0]
            for (let index = 0; index < texto.length; index++) {
                const char = texto.charAt(index)
                if (char != "{" && char != "}") {
                    if (corchetA && parseInt(char) != NaN) {
                        if (this.indiceValiod(parseInt(char),this.itemsMostrar.length)) {
                            this.textoSalida += this.itemsMostrar[Number(char)+1]
                            corchetA = false
                        }else{
                            this.textoSalida += "null"
                            corchetA = false
                        }
                    }else{
                        this.textoSalida += char
                        corchetA = false
                    }
                }else if (char == "{") {
                    corchetA = true
                }
            }
            this.textoSalida += "\n"
        }
    }

    private indiceValiod(indice:number, lenth:number):boolean{
        return indice < lenth-1
    }

    public capturarIdentificadores(identi:string){
        this.identificadores.push(identi)
    }

    public actulizarValorDeclara(){
        if (this.realizar()) {
            for (let index = 0; index < this.identificadores.length; index++) {
                const idd = this.identificadores[index];
                this.actulizarLocal(idd)
            }
        }
        this.identificadores.splice(0, this.identificadores.length)

    }

    private actulizarLocal(idd: string): boolean{
        let encontrado = false
        for (let index = 0; index < this.parametros.length; index++) {
            const variable = this.parametros[index];
            if (idd == variable.nombre) {
                encontrado = true
                variable.contenido = this.contenidVar
                break
            }
        }
        if (!encontrado) {
            for (let index = 0; index < this.variables.length; index++) {
                const variable = this.variables[index];
                if (idd == variable.nombre) {
                    encontrado = true
                    variable.contenido = this.contenidVar
                    break
                }
            }
        }
        return encontrado
    
    }

    public actulizarValorAsig(table:TableSimbol){
        if (this.realizar()) {
            if (this.identificadores.length != 0 && !this.actulizarLocal(this.identificadores[this.identificadores.length-1])) {
                table.actulizarValorVAr(this.identificadores[this.identificadores.length-1],this.contenidVar)
            } 
        } 
        this.identificadores.splice(0, this.identificadores.length)  
    }

    public capturarRetorno(valor:any){
        this.retorno = valor
    }

    public getRetorno(): any{
        if (this.retorno == null) {
            this.retornoBasura
        }
        return this.retorno
    }

    public agregarNodoArbol(arbol: arbolS, nodo:nodoTree){
        console.log("faasdfasfasdfas fadsfkasdjflasd ") 
        if (this.realizar()) {
            console.log("asignado nodo al arboñ")
            arbol.agregarNodo(nodo)
        }
    }
       
        
    }