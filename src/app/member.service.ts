import { Injectable } from '@angular/core';
import { DATA, TTMember } from './data';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private members = DATA;

  private defaultMember: TTMember = {
    id: 999,
    name: 'Default',
    imageUrl: '',
    url: 'home',
  };

  public getById(id: string | undefined): TTMember {
    if (id) {
      const [member] = this.members.filter((m) => m.id === Number(id));

      return member ? member : this.defaultMember;
    }
    return this.defaultMember;
  }

  public loadMembers(): TTMember[] {
    return DATA;
  }
}
