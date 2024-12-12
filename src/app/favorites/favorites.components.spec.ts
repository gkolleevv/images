import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FavoritesComponent } from './favorites.component';
import { SharedService } from '../shared/shared.service';
import { Router } from '@angular/router';

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;
  let sharedServiceSpy: jasmine.SpyObj<SharedService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const sharedServiceMock = jasmine.createSpyObj('SharedService', ['imageSubject$']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [FavoritesComponent],
      providers: [
        { provide: SharedService, useValue: sharedServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    sharedServiceSpy = TestBed.inject(SharedService) as jasmine.SpyObj<SharedService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadSavedImages', () => {
    it('should load saved images from local storage', () => {
      const testImages = ['image1.jpg', 'image2.jpg'];
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(testImages));

      const savedImages = component['loadSavedImages']();
      expect(savedImages).toEqual(testImages);
    });

    it('should return an empty array if no images are saved in local storage', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);

      const savedImages = component['loadSavedImages']();
      expect(savedImages).toEqual([]);
    });
  });

  describe('onImageClick', () => {
    it('should emit the image URL to the imageSubject$', () => {
      const imageUrl = 'http://example.com/image.jpg';
      sharedServiceSpy.imageSubject$.next = jasmine.createSpy();

      component.onImageClick(imageUrl);

      expect(sharedServiceSpy.imageSubject$.next).toHaveBeenCalledWith(imageUrl);
    });

    it('should navigate to the image-detail route', () => {
      const imageUrl = 'http://example.com/image.jpg';

      component.onImageClick(imageUrl);

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/image-detail']);
    });
  });
});
