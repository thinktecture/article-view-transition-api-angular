import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MemberService } from '../member.service';
import { ViewTransitionDirective } from '../view-transition.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ViewTransitionDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly memberService = inject(MemberService);
  public members = this.memberService.loadMembers();
}
