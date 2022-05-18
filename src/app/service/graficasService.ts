import { Injectable } from "@angular/core";
import { graficaModel } from "src/models/graficaModel";

@Injectable({
    providedIn:'root'
})
export class graficoService {

    listaGraficos:graficaModel[]=[];
    constructor() {
        
    }
}