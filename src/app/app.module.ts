import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorCodigoComponent } from './editor-codigo/editor-codigo.component';
import { GaleriaImgComponent } from './galeria-img/galeria-img.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorCodigoComponent,
    GaleriaImgComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CodemirrorModule,
    
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
