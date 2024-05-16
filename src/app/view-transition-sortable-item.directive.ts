import {
  Directive,
  ElementRef,
  HostBinding,
  OnInit,
  computed,
  inject,
  input,
} from '@angular/core';

@Directive({
  selector: '[appSortableItem]',
  standalone: true,
})
export class ViewTransitionSortableItemDirective implements OnInit {
  private elementRef = inject(ElementRef);

  private sanitizedStyles = computed(() => {
    return `

      @media (prefers-reduced-motion: no-preference) {
        .item-${this.id()} {
          view-transition-name: item-${this.id()};
        }

        ::view-transition-old(item-${this.id()}):only-child {
          animation: scale-out .25s ease-out forwards;
        }

        ::view-transition-new(item-${this.id()}):only-child {
          opacity: 0;
          animation:
            fade-in .01s ease-in forwards,
            scale-out .4s ease-in reverse;
        }
      }

      ::view-transition-group(item-${this.id()}) {
        animation-delay: ${this.id() * 20}ms;
      }
`;
  });

  @HostBinding('class')
  private get itemClass() {
    return `item-${this.id()}`;
  }

  public id = input.required<number>({ alias: 'appSortableItem' });

  public ngOnInit(): void {
    const styleChild = document.createElement('style');
    styleChild.innerHTML = this.sanitizedStyles();
    this.elementRef.nativeElement.append(styleChild);
  }
}
