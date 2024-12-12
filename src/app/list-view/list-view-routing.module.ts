import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {ListViewComponent} from "./list-view.component";

const routes: Routes = [
  {
    path: '', component: ListViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListViewRoutingModule {}
