import { User, UserInterface } from '@/models/User';
import { v4 as uuid4 } from 'uuid';

export interface VoteItemInterface {
  id: string;
  name: string;
  vote: number;
  voters: UserInterface[];
}

export class VoteItem implements VoteItemInterface {
  id = '';
  name = '';
  vote = 0;
  voters = [] as UserInterface[];

  constructor(voteItem?: VoteItemInterface) {
    voteItem && Object.assign(this, voteItem);
    if (!this.id) {
      this.id = uuid4();
    }

    if (this.voters.length) {
      for (let voter of this.voters) {
        if (!(voter instanceof User)) {
          voter = new User(voter);
        }
      }
    }
  }
}
