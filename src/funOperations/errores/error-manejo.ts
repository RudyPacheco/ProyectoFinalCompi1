import { Token } from "./token"

export class ManejoErrors {
    
    errores:Array<Token>
    enEspera:Array<Token>
    nombreArch!:string
    instrucciones:string = ""
    capturarInstruciones:  boolean = false
    
    constructor(){
        this.errores = new Array
        this.enEspera = new Array
    }

  

    public capturarErrorSemantico(descripcion:string){
        if (this.enEspera.length > 1) {
            let tok = new Token()
            let tokTem: Token = this.enEspera[this.enEspera.length-2];
            tok.constructorToken(tokTem.lexeme,tokTem.line,tokTem.column,descripcion,"Semantico",this.nombreArch);
            this.errores.push(tok)
            this.limpiarEnEspera()
        }else if (this.enEspera.length != 0) {
            
        }
    }

    public caputuraDeRepitencia(descripcion:string, nombre:string){
        if (this.enEspera.length != 0) {
            let tok = new Token()
            let tokTem: Token = this.tokenDeError(nombre)
            tok.constructorToken(tokTem.lexeme,tokTem.line,tokTem.column,descripcion,"Semantico",this.nombreArch);
            this.errores.push(tok)
            this.limpiarEnEspera()
        } 
    }

    public capturaExpresiones(descripcion:string, nombre:string){
        if (this.enEspera.length != 0) {
            let tok = new Token()
            let tokTem: Token = this.tokenDeError(nombre)
            tok.constructorToken(tokTem.lexeme,tokTem.line,tokTem.column,descripcion,"Semantico",this.nombreArch);
            this.errores.push(tok)
            this.limpiarEnEspera()
        } 
    }

    private tokenDeError(nombre:string): Token{
        let toke = this.enEspera[this.enEspera.length-1];
        for (let index = 0; index < this.enEspera.length; index++) {
            const tmp = this.enEspera[index];
            if (tmp.lexeme == nombre) {
                toke = tmp
                break;
            }
        }
        return toke
    }

    public capturaTokens(lexeme:String, line:number, columm: number){
        if (lexeme != "\n") {
            let tok = new Token()
            tok.inicializarVal(lexeme,line,columm)
            this.enEspera.push(tok)
        }
        this.capturarLexemasInstruciones(lexeme+"")
    }

    public capturaTokenstring(lexeme:String, line:number, columm: number){
        let tok = new Token()
        tok.inicializarVal(lexeme,line,columm)
        this.enEspera.push(tok)
        this.capturarLexemasInstruciones("\""+lexeme+"\"")
    }
    
    public capturaToken(lexeme:String, line:number, columm: number){
        let tok = new Token()
        tok.inicializarVal(lexeme,line,columm)
        this.enEspera.push(tok)
    }

    public limpiarEnEspera(){
        this.enEspera.splice(0,this.enEspera.length)
    }

    public setNombreArch(nombre:string){
        this.nombreArch = nombre
    }


    public imprimiErrores(){
        for (let index = 0; index < this.errores.length; index++) {
            const element = this.errores[index];
            console.log(element.description+"  "+element.lexeme)
        }
    }

    public imprimiErrores2(){
        let textoS="";
        for (let index = 0; index < this.errores.length; index++) {
            const element = this.errores[index];
            textoS += "Tipo : Semantico Lexema : "+element.lexeme+" Fila : "+element.line +" Columna : "+element.column+" "+element.description+"\n";  
            console.log(element.description+"  "+element.lexeme)
        }
        console.log(textoS);
        return textoS;
    }

    public capturarLexemasInstruciones(lexeme:string){
        if (lexeme == "\t" || this.capturarInstruciones) {
            this.capturarInstruciones = true
            if (lexeme == "\n") {
                this.capturarInstruciones= false
            }
            this.instrucciones += ""+lexeme
        }

    }

    public limpiarInstruciones(){
        this.instrucciones = ""
    }

    public capturaErrorLexico(line:number, column:number, lexeme:string){
        let token = new Token()
        token.constructorToken(lexeme,line, column,"Este simbolo no pertenece al lenguaje","Lexico", this.nombreArch)
        this.errores.push(token)
    }

    public capturarErrorSintactico(line:number, column:number, lexeme:string){
        let token = new Token()
        if (lexeme == "") {
            if (this.enEspera.length != 0) {
                lexeme = this.enEspera[this.enEspera.length-1].lexeme+ ""
            }
        }
        lexeme = "\""+lexeme+"\""
        token.constructorToken(lexeme,line, column,"El token no pertenece a la estructura","Sintactico", this.nombreArch)
        this.errores.push(token)
    }
    

}