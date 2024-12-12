import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ImageComponent } from './image.component';
import { SharedService } from '../shared/shared.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

describe('ImageComponent', () => {
  let component: ImageComponent;
  let fixture: ComponentFixture<ImageComponent>;
  let sharedServiceSpy: jasmine.SpyObj<SharedService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const sharedServiceMock = jasmine.createSpyObj('SharedService', ['imageSubject$']);
    sharedServiceMock.imageSubject$ = new Subject<string>();

    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ImageComponent],
      providers: [
        { provide: SharedService, useValue: sharedServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    sharedServiceSpy = TestBed.inject(SharedService) as jasmine.SpyObj<SharedService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set image signal when a new image is emitted', () => {
      const testImage = 'http://example.com/test-image.jpg';
      sharedServiceSpy.imageSubject$.next(testImage);

      expect(component.image()).toBe(testImage);
    });
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

  describe('removeImage', () => {
    it('should remove an image from the saved images list and update local storage', () => {
      const testImages = ['image1.jpg', 'image2.jpg'];
      component['savedImages'].set(testImages);
      spyOn(localStorage, 'setItem');

      const imageToRemove = 'image1.jpg';
      component.removeImage(imageToRemove);

      const updatedImages = component['savedImages']();
      expect(updatedImages).toEqual(['image2.jpg']);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'images',
        JSON.stringify(['image2.jpg'])
      );
    });

    it('should navigate to /favorites after removing an image', () => {
      const testImages = ['image1.jpg', 'image2.jpg'];
      component['savedImages'].set(testImages);

      const imageToRemove = 'image1.jpg';
      component.removeImage(imageToRemove);

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/favorites']);
    });
  });
});
