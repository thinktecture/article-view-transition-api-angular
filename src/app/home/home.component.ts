import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { MemberService } from '../member.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly memberService = inject(MemberService);
  public members = this.memberService.loadMembers();
  public selectedId = signal<number>(0);

  public select(id: number): void {
    this.selectedId.set(id);
  }
}
