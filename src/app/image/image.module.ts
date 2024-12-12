import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ImageComponent} from "./image.component";
import {ImageRoutingModule} from "./image-routing.module";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [
    ImageComponent
  ],
  imports: [
    CommonModule,
    ImageRoutingModule,
    MatButtonModule,
  ],
  providers: [],
})
export class ImageModule { }
