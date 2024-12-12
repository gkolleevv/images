import {Component, HostListener, inject, OnInit, signal} from "@angular/core";
import {SharedService} from "../shared/shared.service";
import {takeUntil} from "rxjs";
import {UnsubBase} from "../shared/unsub.base";

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent extends UnsubBase implements OnInit {
  images = signal<string[]>([]);
  isLoading = signal(false);
  private isAtBottom = signal(false);
  private sharedService = inject(SharedService);

  ngOnInit(): void {
    this.loadImages();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollPosition = window.scrollY + window.innerHeight;
    const bottomPosition = document.documentElement.scrollHeight;
    this.isAtBottom.set(scrollPosition >= bottomPosition - 100);

    if (this.isAtBottom() && !this.isLoading()) {
      this.isLoading.set(true);
      setTimeout(() => {
        this.loadImages();
      }, 300);
    }
  }

  private loadImages(): void {
    for (let i = 0; i < 20; i++) {
      this.sharedService.fetchImage().pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (blob) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64Image = reader.result as string;
            this.images.update((currentImages) => [...currentImages, base64Image]);
          };
          reader.readAsDataURL(blob);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Failed to load image', err);
          this.isLoading.set(false);
        }
      });
    }
  }

  onImageClick(imageUrl: string): void {
    this.saveToLocalStorage(imageUrl);
  }

  private saveToLocalStorage(imageUrl: string): void {
    const savedImages = JSON.parse(localStorage.getItem('images') || '[]');
    if (!savedImages.includes(imageUrl)) {
      savedImages.push(imageUrl);
      localStorage.setItem('images', JSON.stringify(savedImages));
    }
  }
}
