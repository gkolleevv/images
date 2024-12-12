import {Directive, OnDestroy} from "@angular/core";
import {Subject} from "rxjs";

@Directive()
export abstract class UnsubBase implements OnDestroy {
  unsubscribe$ = new Subject<void>();

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
