import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/photos',
    pathMatch: 'full'
  },
  {
    path: 'photos',
    loadChildren: () => import('./list-view/list-view.module').then(m => m.ListViewModule)
  },
  {
    path: 'favorites',
    loadChildren: () => import('./favorites/favorites.module').then(m => m.FavoritesModule)
  },
  {
    path: 'image-detail',
    loadChildren: () => import('./image/image.module').then(m => m.ImageModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
