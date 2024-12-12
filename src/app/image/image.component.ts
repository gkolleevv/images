import {Component, inject, OnInit, signal} from "@angular/core";
import {Router} from "@angular/router";
import {SharedService} from "../shared/shared.service";
import {UnsubBase} from "../shared/unsub.base";
import {takeUntil} from "rxjs";

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent extends UnsubBase implements OnInit{
  image = signal<string>('');
  private savedImages = signal<string[]>(this.loadSavedImages());
  private sharedService = inject(SharedService);
  private router = inject(Router);

  ngOnInit(): void {
    this.sharedService.imageSubject$.pipe(takeUntil(this.unsubscribe$)).subscribe((image) => {
        this.image.set(image);
    });
  }

  private loadSavedImages(): string[] {
    const images = localStorage.getItem('images');
    return images ? JSON.parse(images) : [];
  }

  removeImage(image: string): void {
    const currentImages = this.savedImages();
    const updatedImages = currentImages.filter((c) => c !== image);
    this.savedImages.set(updatedImages);
    localStorage.setItem('images', JSON.stringify(updatedImages));
    this.router.navigate(['/favorites']);
  }
}
