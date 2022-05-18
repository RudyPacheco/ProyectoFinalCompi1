import { Injectable } from "@angular/core";
import { Archivos } from "src/models/archivo";

@Injectable({
    providedIn: 'root'
  })
  export class ComunicationService {
    archivos:Array<Archivos> = new Array
    archivoSelect:Archivos=new Archivos("","Nuevo");
    textoSalida="";
    
    
    constructor() { }
  


    }