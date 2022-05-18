import { Archivos } from "src/models/archivo"
import { ManejoErrors } from "../errores/error-manejo"
import { Clase } from "./clase"
import { TipoVar } from "./enum-var"
import { Funcion } from "./funcion"

export class TableSimbol {
    
    clases: Array<Clase>
    claseTem: Clase = new Clase()
    errores!:ManejoErrors
    scope:number = 0
    parser!: any  
    parseG!:any
    parametrosBusqued:Array<any> = new  Array
    scopeVerific = 0
    control: Array<number> = new Array
    scopeMax = 1
    archivos:Array<Archivos> = new Array
    nombresImports: Array<string> = new Array
    textoSalida:string = ""
    


    constructor(errores: ManejoErrors, archivos:Array<Archivos>){
        this.clases = new Array
        this.errores = errores
        this.archivos = archivos
        this.claseTem.setErrors(errores)
    }
    
    
    public agregarClase(){
        let clase = new Clase()
        clase.funciones = this.claseTem.funciones
        clase.variables = this.claseTem.variables
        this.clases.push(clase)
        this.claseTem.limpiarArrays();
    }

    public anlizarImport(nameImport:string){
        let index = this.importValido(nameImport)
        if ( index != -1) {
            this.archivos[index].yaCompilado = true
            this.nombresImports.push(this.archivos[index].name)
            this.errores.setNombreArch(this.archivos[index].name)
            this.parseG.parse(this.archivos[index].texto)
            this.nombresImports.pop()
            this.errores.setNombreArch(this.nombresImports[this.nombresImports.length-1])
            this.errores.limpiarEnEspera()
        }
        this.claseTem.valorInzerteza = 0.5
    }

    private importValido(nameImport:string):number{
        let pos = -1
        console.log(nameImport)
        for (let index = 0; index < this.archivos.length; index++) {
            const archivo = this.archivos[index];
            if (nameImport == archivo.name) {
                pos = index
                break
            }
        }
        if (pos == -1) {
            this.errores.capturarErrorSemantico("El archivo no existe")
        }else if (this.archivos[pos].yaCompilado){
            //el archivo ya ha sido compilado xd
            pos == -1
        }
        return pos
    }
    

    public capturarVariableGlobal(tipo: TipoVar, contenido: any){
        if (!this.varExistsInTable()) {
            this.claseTem.capturarVariableGlobal(tipo, contenido)
        }
    }

    
    public verificarFuncion(){
        if (!this.claseTem.funcionYaExiste()) {
            for (let index = 0; index < this.clases.length; index++) {
                const clase = this.clases[index];
                if (clase.funcionYaExiste()) {
                    break
                }
            }
        }
    }
    
  
    private varExistsInTable():boolean{
        let yaExiste = false
        for (let i = 0; i < this.claseTem.items.length; i++) {
            const item = this.claseTem.items[i];
            for (let index = 0; index < this.clases.length; index++) {
                const clase = this.clases[index];
                if(clase.varYaExistente(item+"")){
                    yaExiste = true
                    break
                }
            }
            
        }
        return yaExiste
    }
    
    
    public asignarValorVarGlobal(identificador: string, contenido:any){
        let encontrado = this.claseTem.asignarValorVarGlobal(identificador,contenido)
        if (!encontrado) {
            for (let index = 0; index < this.clases.length; index++) {
                const clase = this.clases[index];
                if (clase.asignarValorVarGlobal(identificador, contenido)) {
                    encontrado = true
                    break;
                }
            }
        } 
        if (!encontrado) {
           this.errores.caputuraDeRepitencia("La variable no ha sido declarada",identificador) 
        }
    }

    

  
    public contenidoVariable(identificador: string): any{
        let contenido:any
        let indexVar = -1
        if (this.scope == 0 ) {
           indexVar =  this.claseTem.indexVariable(identificador)
            //buscar de manera global
            if (indexVar == -1) {
                for (let index = 0; index < this.clases.length; index++) {
                    const clase = this.clases[index];
                    let pos = clase.indexVariable(identificador)
                    if (pos != -1) {
                        contenido = clase.variables[pos].contenido
                        indexVar = pos
                        break
                    }
                }
            } else {
                contenido = this.claseTem.variables[indexVar].contenido
            }
               
        } else {
      
            
            let indexInterno = -1
            if (this.claseTem.funciones.length != 0) {
                indexInterno =  this.claseTem.funciones[this.claseTem.funciones.length-1].indexVariable(identificador)
            }
            indexVar = indexInterno
            if (indexInterno == -1) {
                indexVar =  this.claseTem.indexVariable(identificador)
                if (indexVar == -1) {
                    for (let index = 0; index < this.clases.length; index++) {
                        const clase = this.clases[index];
                        let pos = clase.indexVariable(identificador)
                        if (pos != -1) {
                            contenido = clase.variables[pos].contenido
                            indexVar = pos
                            break
                        }
                    }
                } else {
                    contenido = this.claseTem.variables[indexVar].contenido
                }
            } else {
                if (indexInterno < this.claseTem.funciones[this.claseTem.funciones.length-1].parametros.length ) {
                    contenido = this.claseTem.funciones[this.claseTem.funciones.length-1].parametros[indexInterno].contenido
                }else{
                    contenido = this.claseTem.funciones[this.claseTem.funciones.length-1].variables[indexInterno-this.claseTem.funciones[this.claseTem.funciones.length-1].parametros.length].contenido
                }
                
            }
        }
        if (indexVar == -1) {
    
            this.errores.capturaExpresiones("La variable no ha declarado", identificador)
            contenido = 0
        }else if (contenido == null) {
            this.errores.capturaExpresiones("La variable no se ha inicializado", identificador)
            contenido = 0
        }
        return contenido
    }

    public asignarValorVarFunOGlobal(identificador: string, contenido:any){
        if (this.claseTem.hayFunciones() && !this.claseTem.funciones[this.claseTem.funciones.length-1].asignarValorVariable(identificador, contenido)) {
            this.asignarValorVarGlobal(identificador,contenido);
        }
        this.scope = 0
    }

    public validarSi(valor:any){
        if ("boolean" != typeof valor) {
            this.errores.capturarErrorSemantico("La expresion en SI debe ser de tipo boolean")
        }
    }


  public valoFuncion(identificador: string, conRetorno: boolean, ejectar:boolean): any{
    let contenido = this.claseTem.valorFuncion(identificador, this.parametrosBusqued, this.parser, conRetorno, ejectar) 
    if (contenido == null) {
        for (let index = 0; index < this.clases.length; index++) {
            const clase = this.clases[index];
            contenido = clase.valorFuncion(identificador, this.parametrosBusqued, this.parser,conRetorno, ejectar)
            if (contenido != null) {
                break
            }
        }
    }
    if (contenido == null) {

        this.errores.capturarErrorSemantico("La funcion no se a declarado " + identificador)
        contenido = 0
    }
    this.limpiarParametros()
    return contenido
  }

  public limpiarParametros(){
      this.parametrosBusqued.splice(0,this.parametrosBusqued.length)
  }

  public capturarParametros(contenido:any){
    this.parametrosBusqued.push(contenido)
  }

  public verificadorScope(isSi: boolean, isNo: boolean, actuliza: boolean, id:string){
 
    if (this.scopeVerific > this.scopeMax+1) {

        this.errores.caputuraDeRepitencia("error de identacion ", id)
    }else{
        if (isSi) {
            this.control.push(this.scopeVerific)
        }
        if (isNo) {
            let index = this.control.indexOf(this.scopeVerific)
            if (index != -1) {
                this.control[index] = 0
            } else {
                //error necesita un si para poder tener un No
                this.errores.caputuraDeRepitencia("Debe existir un SI para usar SINO", id)
                
            }
        }
        if (actuliza) {
            this.scopeMax = this.scopeVerific
        }else if (this.scopeVerific <= this.scopeMax) {
            this.scopeMax = this.scopeVerific
            for (let index = 0; index < this.control.length; index++) { 
                if (this.control[index] >= this.scopeMax) {
                    this.control[index] = 0
                }
            }
        }
    }
    
    this.scopeVerific = 0
  }

    public controlCero(){
        this.scopeMax = 1
        this.control.splice(0,this.control.length)
    }

   public contenidoVariableIstr(identificador:string, funcion:Funcion): any{
        let contenido = funcion.valorVariable(identificador)
        if (contenido == null ) {
            contenido = this.claseTem.valorVariable(identificador);
            if (contenido == null) {
                for (let index = 0; index < this.clases.length; index++) {
                    const clase = this.clases[index];
                    contenido = clase.valorVariable(identificador)
                    if (contenido != null) {
                        break;
                    }
                }
            }
        }
        if (contenido == null) {
            contenido = 0
        }
        return contenido
   }
  
  public verificadorRetorno(valor:any){
      let tipo = this.claseTem.funciones[this.claseTem.funciones.length-1].tipo;
       if (tipo == TipoVar.VOID) {
           this.errores.capturarErrorSemantico("error en el retorno del Metodo")
           this.claseTem.funciones[this.claseTem.funciones.length-1].retorno = 0;
       }else{
        if ("number" == typeof valor ) {
            if (Number.isInteger(valor) && tipo != TipoVar.INT) {
                this.errores.capturarErrorSemantico("error en el retorno de la funcion")
            }else if (!Number.isInteger(valor) && tipo != TipoVar.DOUBLE) {
              this.errores.capturarErrorSemantico("error en el retorno de la funcion")
            }
         } else if("string" == typeof valor && valor.length == 1) {
             if (tipo != TipoVar.CHAR) {
              this.errores.capturarErrorSemantico("error en el retorno de la funcion")
             }
         }else if ("string" == typeof valor && valor.length != 1) {
          if (tipo != TipoVar.STRING) {
              this.errores.capturarErrorSemantico("error en el retorno de la funcion")
             }
         }else{
             if ("boolean" == typeof valor && tipo != TipoVar.BOOLEAN) {
              this.errores.capturarErrorSemantico("error en el retorno de la funcion") 
             }
         }
         this.claseTem.funciones[this.claseTem.funciones.length-1].retornoBasura()
       }
       
  }

  public verificarReturnMetod(){
    let tipo = this.claseTem.funciones[this.claseTem.funciones.length-1].tipo;
    if (tipo != TipoVar.VOID) {
        this.errores.capturarErrorSemantico("error en el retorno de la funcion") 
        this.claseTem.funciones[this.claseTem.funciones.length-1].retorno = 0
    }
  }

  public actulizarValorVAr(idd:string, contenido:any){
    for (let index = 0; index < this.claseTem.variables.length; index++) {
        const vari = this.claseTem.variables[index];
        if (vari.nombre == idd) {
            vari.contenido = contenido
            break
        }
    }
  }

  public existReturn(){
    if (this.claseTem.funciones[this.claseTem.funciones.length-1].retorno == null && this.claseTem.funciones[this.claseTem.funciones.length-1].tipo != TipoVar.VOID) {
        this.errores.capturarErrorSemantico("la funcion esta retornando")
    }
  }

    

    
}