import { Component, OnInit, ViewChild } from '@angular/core';
import { nodoTree } from 'src/models/nodoTree';
import Swal from 'sweetalert2';
import { arbolS } from '../service/arbolS';
import {graphviz} from 'd3-graphviz';
import { errorModel } from 'src/models/errorModel';
import { graficaModel } from 'src/models/graficaModel';
import { graficoService } from '../service/graficasService';
import { ManejoErrors } from 'src/funOperations/errores/error-manejo';
import { OperationCasteo } from 'src/funOperations/operaciones/operacion-casteo';
import { TableSimbol } from 'src/funOperations/tablaSimbolos/tabla-simbolo';
import { OperationLogica } from 'src/funOperations/operaciones/operacion-logica';
import { Funcion } from 'src/funOperations/tablaSimbolos/funcion';
import { TipoVar } from 'src/funOperations/tablaSimbolos/enum-var';
import { operationIncerteza } from 'src/funOperations/operationIncerteza';
import { Archivos } from 'src/models/archivo';
import { ComunicationService } from '../service/archivos-service';
declare var parserAnalisis:any;
declare var require:any;
let arbol = new arbolS;
let errores:errorModel[]=[];



@Component({
  selector: 'app-editor-codigo',
  templateUrl: './editor-codigo.component.html',
  styleUrls: ['./editor-codigo.component.css']
})
export class EditorCodigoComponent implements OnInit {
  selectedFile: File | null = null;
  texto:any;
  obj: any;
  textoSalida:any;
  divMensajes:any;
  entrada!: String;
  nameArchivoActual!: string
  listaGraficos!:graficaModel[];
  archivos:Array<Archivos> = new Array
  constructor(private imagenService:graficoService, private comunication:ComunicationService) {
    this.listaGraficos=imagenService.listaGraficos;
    this.archivos = comunication.archivos;
    this.texto=comunication.archivoSelect.texto;
    this.textoSalida=comunication.textoSalida;
   }


  ngOnInit(): void {
    this.textoSalida=""
  }


  fileUploadInAngular(event: Event) {
    
    const files = (event.target as  HTMLInputElement).files;
    if (files != null) {
      this.selectedFile = files.item(0);
    }
    this.imprimir();

}

  imprimir(){
    console.log(this.selectedFile);
    let fileReader = new FileReader();
    let text = this.selectedFile?.text();


    fileReader.onload = (e) =>{
      const contenido = e.target?.result;
   
      console.log(fileReader.result);
      this.texto=fileReader.result;
      let arch = new Archivos(this.texto,this.selectedFile?.name+"");
     // this.archivos.push(arch);
      this.comunication.archivos.push(arch);
      this.comunication.archivoSelect=arch;
    }
    if (this.selectedFile!=null) {
     
    fileReader.readAsText(this.selectedFile); 
   // this.texto="prueba 2";
    }else{
      console.log("archivo nulo");
      
    }
  }


  setEditorContent(event: any) {
    // console.log(event, typeof event);
    this.comunication.archivoSelect.texto=this.texto;
    console.log(this.texto);
  }


  descargar(data:any ){
    const a = document.createElement("a");
    const contenido=data;
    const enlc = new Blob([contenido],{type:"text/plain"})
    const url = window.URL.createObjectURL(enlc);
    a.href=url;
    a.download = this.comunication.archivoSelect.name +".crl";
    a.click();
    URL.revokeObjectURL(url);

    

    

  }


  nuevoArchivo(){
    let archivo = new Archivos("","Nuevo");
    this.comunication.archivos.push(archivo);

    
  }



  public settearText(name:string){
    for (let index = 0; index < this.comunication.archivos.length; index++) {
      const archivo = this.comunication.archivos[index];
      if (archivo.name == this.nameArchivoActual) {
        archivo.texto = this.entrada+""
        break
      }
    }
    this.archivos = this.comunication.archivos
    for (let index = 0; index < this.comunication.archivos.length; index++) {
      const archivo = this.comunication.archivos[index];
      if (name == archivo.name) {
        this.nameArchivoActual = archivo.name
        this.entrada = archivo.texto
      }
    }

  }

  public cambiarPestania(index:any){

    let archivo = this.archivos[index];
    if (archivo != undefined) {
      this.comunication.archivoSelect=archivo;
      this.texto=archivo.texto;
      console.log("si entro")
    }


  }

  public cerrarPestania(index:any){
    this.comunication.archivos.splice(index,1);
    console.log(this.comunication.archivos.length);
    if (this.comunication.archivos.length===0) {
      this.texto="";
    }else{
      if (this.comunication.archivos[index]===undefined) {
        let archivo = this.comunication.archivos[index-1];
        this.comunication.archivoSelect=archivo;
        this.texto=archivo.texto;
      }else{
        let archivo = this.comunication.archivos[index];
        this.comunication.archivoSelect=archivo;
        this.texto=archivo.texto;
      }

    }


  }

  guardarArchivo(){
    
    this.descargar(this.texto);
  }


  ejecutarCodigo(){
    this.textoSalida=""
    errores=[]

    const parser= require("src/app/analizador/Interprete.js")
    const parserFun = require("src/app/analizador/InterpetreInstruc.js")

    let errores2 = new ManejoErrors();

    errores2.setNombreArch(this.comunication.archivoSelect.name);
    let opCast = new OperationCasteo(errores2);
    let opRelatins = new OperationLogica(errores2);
    let table = new TableSimbol(errores2,this.comunication.archivos);
    let fun!: Funcion
    //let coparacion = new operationIncerteza(table);

    let funciones: Array<Funcion> = new Array
    table.nombresImports.push(this.comunication.archivoSelect.name);

    arbol.limpiarNodos();

    parser.Parser.yy={opCast:opCast, opRelatins: opRelatins, table:table, tipoVar: TipoVar, errores:errores2};
    parserFun.Parser.yy={opCast:opCast, opRelatins: opRelatins, table:table, tipoVar: TipoVar, errores:errores, fun:fun, funciones:funciones,nodo:nodoTree,arbol:arbol} 
    table.parser = parserFun;
    table.parseG = parser;

      parser.parse(this.texto);

      table.valoFuncion("Principal",false,true);
      




   if (errores.length === 0 && errores2.errores.length === 0) {
     this.msjAnalisisCorrecto();
     this.generarDots();
     this.textoSalida = table.textoSalida;
     this.comunication.textoSalida=table.textoSalida;
    }else{

    this.msjAnalisisError();
    this.imprimirErrores();
    this.textoSalida += errores2.imprimiErrores2();
    this.comunication.textoSalida+=  errores2.imprimiErrores2();
   }


    console.log(errores.length);
    for (let index = 0; index < errores.length; index++) {
     console.log(errores[index]);
    }
    //this.graficar(texto,'#graph2'); 
   //this.graficar2("");
  }


  imprimirErrores(){
    let textoS="";
    for (let index = 0; index < errores.length; index++) {
      textoS+=errores[index].tipo+" Lexema :"+errores[index].lexema+" Fila :"+errores[index].fila+" Columna :"+errores[index].columna+"\n";
      
    }
    this.textoSalida+=textoS;
    this.comunication.textoSalida+=  textoS;
  }

  generarDots(){
    if (arbol.nodos.length!==0) {
     
    for (let index = 0; index < arbol.nodos.length ; index++) {
      let text = this.recorrer(arbol.nodos[index]);
      this.imagenService.listaGraficos.push(new graficaModel(text));
      
    } 
    }
  }

 


  recorrer(Nodo:nodoTree){
    let texto="";
    let contador =1;
    texto +="digraph {";
    texto+="Node0[label=\""+ Nodo.tipo +" | " + Nodo.valor +"\"];\n"; 
    recorrido("Node0",Nodo);
    texto+="}";
    return texto;


    function recorrido(nodoP:any,nodo:nodoTree){
      console.log(nodo.valor);
      console.log("recorrido"+ contador);
      if (nodo === undefined || nodo === null) return;
     
        nodo.hijos.forEach(nodito=> {
          if (typeof nodito.tipo === "undefined") return;
            let nombrehijo="Node"+contador;
            texto+=nombrehijo+"[label=\""+nodito.tipo +" | "+nodito.valor +"\"];\n";
            texto+=nodoP+"->"+nombrehijo+";\n";
            contador++;
            recorrido(nombrehijo,nodito);
  
        })
       
     

    }


  }

  recorrerTree(nodo:nodoTree){
    var id=1;
    console.log(id + '[label ="' + nodo.valor)

  }

  graficar(dot:any,div:any){

    graphviz(div).renderDot(dot);

  }


  graficar2(dot:any){

    graphviz('#graph2').renderDot('digraph {c -> a;b -> a}');

  }


  agregar(){
     
    let texto = this.recorrer(arbol.nodos[0]); 
  var  content = ' <div>'+ '<h1 class="subTitle"> preubaxd</h1> '+'</div>'
  this.divMensajes = content;
  this.imagenService.listaGraficos=[];
    this.imagenService.listaGraficos.push(new graficaModel(texto));
    this.imagenService.listaGraficos.push(new graficaModel(texto));
    this.imagenService.listaGraficos.push(new graficaModel(texto));

  }

  msjAnalisisCorrecto(){
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Analisis correcto',
      showConfirmButton: false,
      timer: 1500
    })
  }

  msjAnalisisError(){
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'El texto tiene errores',
      showConfirmButton: false,
      timer: 1500
    })
  }


}
