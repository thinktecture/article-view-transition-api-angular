import { DOCUMENT } from '@angular/common';
import {
  AfterRenderPhase,
  Injectable,
  Injector,
  NgZone,
  afterNextRender,
  assertInInjectionContext,
  inject,
  signal,
} from '@angular/core';
import { ViewTransitionInfo } from '@angular/router';
import {
  MonoTypeOperatorFunction,
  Observable,
  from,
  map,
  switchMap,
} from 'rxjs';

//Extend Document because Typescript does not yet support startViewTransition
type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => Promise<void>) => void;
};

//Custom RxJs Operator to trigger ViewTransition and perform DOM Chages afterwards
export function runViewTransition<T>(
  viewTransitionService?: ViewTransitionService,
): MonoTypeOperatorFunction<T> {
  if (!viewTransitionService) {
    assertInInjectionContext(runViewTransition);
    viewTransitionService = inject(ViewTransitionService);
  }

  return <T>(source$: Observable<T>) =>
    source$.pipe(
      switchMap((data: T) => {
        const viewTransitionStarted = from(
          viewTransitionService.runViewTransition(),
        );
        return viewTransitionStarted.pipe(map(() => data));
      }),
    );
}

@Injectable({
  providedIn: 'root',
})
export class ViewTransitionService {
  private injector = inject(Injector);
  private document = inject<DocumentWithViewTransition>(DOCUMENT);

  currentTransition = signal<ViewTransitionInfo | null>(null);

  public runViewTransition(): Promise<void> {
    return this.injector.get(NgZone).runOutsideAngular(() => {
      if (!this.document.startViewTransition) {
        return new Promise((resolve) => setTimeout(resolve));
      }

      let resolveViewTransitionStarted: () => void;
      const viewTransitionStarted = new Promise<void>((resolve) => {
        resolveViewTransitionStarted = resolve;
      });

      this.document.startViewTransition(() => {
        resolveViewTransitionStarted();
        //View Transition waits until next change detection cycle to complete to ensure that
        //all changes were performed
        return this.createRenderPromise();
      });
      return viewTransitionStarted;
    });
  }

  /**
   * Creates a promise that resolves after next render.
   */
  private createRenderPromise() {
    return new Promise<void>((resolve) => {
      // Wait for the microtask queue to empty after the next render happens (by waiting a macrotask).
      // This ensures any follow-up renders in the microtask queue are completed before the
      // view transition starts animating.
      afterNextRender(() => setTimeout(resolve), {
        injector: this.injector,
        phase: AfterRenderPhase.Read,
      });
    });
  }
}
