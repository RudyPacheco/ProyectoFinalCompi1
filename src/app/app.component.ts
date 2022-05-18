import { Component } from '@angular/core';





@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedFile: File | null = null;
  title = 'proyecto-final-compi1';
  
  fileUploadInAngular(event: Event) {
    const files = (event.target as  HTMLInputElement).files;
    if (files != null) {
      this.selectedFile = files.item(0);
    }

}
}
