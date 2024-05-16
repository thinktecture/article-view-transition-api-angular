import {
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  computed,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { MemberService } from '../member.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ViewTransitionSortableItemDirective } from '../view-transition-sortable-item.directive';
import { ViewTransitionDirective } from '../view-transition.directive';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { runViewTransition } from '../view-transition.service';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    AsyncPipe,
    ReactiveFormsModule,
    ViewTransitionDirective,
    ViewTransitionSortableItemDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly memberService = inject(MemberService);
  private readonly fb = inject(FormBuilder);

  public filterForm = this.fb.group({
    filter: 'all',
  });

  private allMembers = this.memberService.loadMembers();
  private formChangeSignal = toSignal(this.filterForm.valueChanges);
  private filter = computed(() => this.formChangeSignal()?.filter ?? 'all');

  public members$ = toObservable(this.filter).pipe(
    runViewTransition(),
    map((filter) => {
      switch (filter) {
        case 'all':
          return this.allMembers;
        case 'odd':
          return this.allMembers.filter(({ id }) => id % 2 !== 0);
        case 'even':
          return this.allMembers.filter(({ id }) => id % 2 === 0);
        default:
          return this.allMembers;
      }
    }),
  );
}
