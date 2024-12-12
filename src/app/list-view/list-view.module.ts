import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ListViewComponent} from "./list-view.component";
import {ListViewRoutingModule} from "./list-view-routing.module";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@NgModule({
  declarations: [
   ListViewComponent
  ],
  imports: [
    CommonModule,
    ListViewRoutingModule,
    MatProgressSpinnerModule,
    MatProgressSpinnerModule
  ],
  providers: [],
})
export class ListViewModule { }
