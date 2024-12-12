import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private imageUrl = 'https://picsum.photos/200/300';
  private http = inject(HttpClient);
  imageSubject$: BehaviorSubject<string> = new BehaviorSubject('');

  fetchImage(): Observable<Blob> {
    return this.http.get(this.imageUrl, { responseType: 'blob' });
  }
}
