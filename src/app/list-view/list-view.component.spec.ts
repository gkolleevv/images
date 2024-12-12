import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { ListViewComponent } from './list-view.component';
import { SharedService } from '../shared/shared.service';
import { of, throwError } from 'rxjs';

describe('ListViewComponent', () => {
  let component: ListViewComponent;
  let fixture: ComponentFixture<ListViewComponent>;
  let sharedServiceSpy: jasmine.SpyObj<SharedService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('SharedService', ['fetchImage']);

    await TestBed.configureTestingModule({
      declarations: [ListViewComponent],
      providers: [
        { provide: SharedService, useValue: spy }
      ],
    }).compileComponents();

    sharedServiceSpy = TestBed.inject(SharedService) as jasmine.SpyObj<SharedService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call loadImages on init', () => {
      spyOn<any>(component, 'loadImages');
      component.ngOnInit();
      expect(component['loadImages']).toHaveBeenCalled();
    });
  });

  describe('onScroll', () => {
    it('should set isAtBottomSignal when scrolled to the bottom', () => {
      spyOn(component['isAtBottomSignal'], 'set');
      const event = new Event('scroll');
      Object.defineProperty(window, 'scrollY', { value: 1000, writable: true });
      Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });

      window.dispatchEvent(event);

      expect(component['isAtBottomSignal'].set).toHaveBeenCalledWith(true);
    });
  });

  describe('loadImages', () => {
    it('should add images to the list on successful fetch', fakeAsync(() => {
      const mockBlob = new Blob(['image data'], { type: 'image/jpeg' });
      sharedServiceSpy.fetchImage.and.returnValue(of(mockBlob));

      component['loadImages']();
      tick();

      expect(component.images().length).toBe(25);
      expect(sharedServiceSpy.fetchImage).toHaveBeenCalledTimes(25);
    }));

    it('should handle fetch error gracefully', fakeAsync(() => {
      sharedServiceSpy.fetchImage.and.returnValue(throwError(() => new Error('Fetch error')));

      spyOn(console, 'error');
      component['loadImages']();
      tick();

      expect(console.error).toHaveBeenCalledWith('Failed to load image', jasmine.any(Error));
      expect(component.isLoadingSignal()).toBe(false);
    }));
  });

  describe('onImageClick', () => {
    it('should save clicked image URL to local storage', () => {
      const imageUrl = 'http://example.com/image.jpg';
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([]));
      spyOn(localStorage, 'setItem');

      component.onImageClick(imageUrl);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'images',
        JSON.stringify([imageUrl])
      );
    });

    it('should not save duplicate image URLs', () => {
      const imageUrl = 'http://example.com/image.jpg';
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([imageUrl]));
      spyOn(localStorage, 'setItem');

      component.onImageClick(imageUrl);

      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });
});
