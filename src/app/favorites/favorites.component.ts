import {Component, inject, signal} from "@angular/core";
import {SharedService} from "../shared/shared.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent {
  favorites = signal<string[]>(this.loadSavedImages());
  private sharedService = inject(SharedService);
  private router = inject(Router);

  private loadSavedImages(): string[] {
    return JSON.parse(localStorage.getItem('images') || '[]');
  }

  onImageClick(imageUrl: string): void {
    this.sharedService.imageSubject$.next(imageUrl);
    this.router.navigate(['/image-detail']);
  }
}
