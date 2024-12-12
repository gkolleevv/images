import { TestBed } from '@angular/core/testing';
import { SharedService } from './shared.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('SharedService', () => {
  let service: SharedService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SharedService],
    });
    service = TestBed.inject(SharedService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchImage', () => {
    it('should fetch an image as a Blob', () => {
      const mockBlob = new Blob(['test-image'], { type: 'image/jpeg' });

      service.fetchImage().subscribe((blob) => {
        expect(blob).toEqual(mockBlob);
      });

      const req = httpMock.expectOne('https://picsum.photos/200/300');
      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toBe('blob');

      req.flush(mockBlob);
    });

    it('should handle an HTTP error', () => {
      const errorMessage = '404 error';

      service.fetchImage().subscribe({
        next: () => fail('Expected an error, but the request succeeded.'),
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne('https://picsum.photos/200/300');
      expect(req.request.method).toBe('GET');
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('imageSubject$', () => {
    it('should emit and retrieve the correct value', () => {
      const testImageUrl = 'http://example.com/image.jpg';

      service.imageSubject$.next(testImageUrl);
      service.imageSubject$.subscribe((url) => {
        expect(url).toBe(testImageUrl);
      });
    });
  });
});
