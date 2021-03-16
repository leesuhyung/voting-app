import { User } from '@/models/User';
import { v4 as uuid4 } from 'uuid';

export interface VoteItemInterface {
  id: string;
  voteId: string;
  name: string;
  vote: number;
  voters: User[];
}

export class VoteItem implements VoteItemInterface {
  id = '';
  voteId = '';
  name = '';
  vote = 0;
  voters = [] as User[];

  constructor(voteItem?: VoteItemInterface) {
    voteItem && Object.assign(this, voteItem);
    if (!this.id) {
      this.id = uuid4();
    }

    if (this.voters.length) {
      this.voters = this.voters.map(voter => new User(voter));
    }
  }
}
