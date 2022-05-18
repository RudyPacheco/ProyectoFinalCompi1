import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorCodigoComponent } from './editor-codigo/editor-codigo.component';
import { GaleriaImgComponent } from './galeria-img/galeria-img.component';

const routes: Routes = [
  {path:'', component:EditorCodigoComponent},
  {path:'imagenes',component:GaleriaImgComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
