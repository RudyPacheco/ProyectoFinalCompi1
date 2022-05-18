export class Archivos {
    texto:string
    yaCompilado:boolean = false
    name:string

    constructor(texto:string, name:string){
        this.texto = texto
        this.name = name
    }
}