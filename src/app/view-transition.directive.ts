import { Directive } from '@angular/core';
import { inject, input, computed } from '@angular/core';
import { ViewTransitionService } from './view-transition.service';

@Directive({
  selector: '[appViewTransition]',
  standalone: true,
  host: { '[style.view-transition-name]': 'viewTransitionName()' },
})
export class ViewTransitionDirective {
  private readonly viewTranistionService = inject(ViewTransitionService);

  public readonly name = input.required<string>({
    alias: 'appViewTransition',
  });
  public readonly id = input.required<number>();

  protected readonly viewTransitionName = computed(() => {
    const currentTransition = this.viewTranistionService.currentTransition();

    const apply =
      Number(currentTransition?.to.firstChild?.params['id']) === this.id() ||
      Number(currentTransition?.from.firstChild?.params['id']) === this.id();
    return apply ? this.name() : 'none';
  });
}
