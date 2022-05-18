import { Component, OnInit } from '@angular/core';
import { graficaModel } from 'src/models/graficaModel';
import { graficoService } from '../service/graficasService';
import {graphviz} from 'd3-graphviz';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-galeria-img',
  templateUrl: './galeria-img.component.html',
  styleUrls: ['./galeria-img.component.css']
})
export class GaleriaImgComponent implements OnInit {


  listaGraficos!:graficaModel[];
  imagenCreada: any;
  mostrarB=false;
  constructor(private imagenService:graficoService) {

    this.listaGraficos=imagenService.listaGraficos;

   }

  ngOnInit(): void {
    console.log(this.imagenService.listaGraficos.length);
    console.log(this.listaGraficos.length);
    if (!this.listaGraficos===undefined) {
    
    }

 
   //this.agregarGraficos();


  }



  agregarGraficos(){
    this.mostrarB=true;
    for (let index = 0; index < this.imagenService.listaGraficos.length; index++) {
      this.graficar(index+1,this.imagenService.listaGraficos[index].dot);
      
    }
  }


  graficar(div:any,dot:any){

    graphviz("#graph"+div).renderDot(dot);

  }


  descargar(index:any){
   
    html2canvas(document.querySelector("#graph"+index) as HTMLHtmlElement).then(canvas =>{
     this.imagenCreada = canvas.toDataURL();
     const a = document.createElement("a");
     a.href=canvas.toDataURL();
     a.download="";
     a.click();
     URL.revokeObjectURL(this.imagenCreada);
    })

  }


}
