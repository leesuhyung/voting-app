import { v4 as uuid4 } from 'uuid';
import { User } from '@/models/User';
import { VoteItem, VoteItemInterface } from '@/models/VoteItem';

export enum VOTE_STATUS {
  WAIT = 'wait',
  LIVE = 'live',
  FINISH = 'finish',
}

export interface VoteInterface {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  creator: User;
  voteItems: VoteItem[];
  status(): VOTE_STATUS;
}

export class Vote implements VoteInterface {
  id = '';
  title = '';
  startDate!: Date;
  endDate!: Date;
  creator = {} as User;
  voteItems = [] as VoteItem[];

  constructor(vote?: VoteInterface) {
    vote && Object.assign(this, vote);
    if (!this.id) {
      this.id = uuid4();
      while (
        this.voteItems.length < process.env.VUE_APP_DEFAULT_VOTE_ITEM_COUNT
      ) {
        this.voteItems.push(
          new VoteItem({ voteId: this.id } as VoteItemInterface),
        );
      }
    }

    if (this.creator.id) {
      this.creator = new User(this.creator);
    }

    if (this.voteItems.length) {
      this.voteItems = this.voteItems.map(voteItem => new VoteItem(voteItem));
    }
  }

  status(): VOTE_STATUS {
    if (this.startDate && this.endDate) {
      if (
        Date.now() >= this.startDate.getTime() &&
        Date.now() < this.endDate.getTime()
      ) {
        return VOTE_STATUS.LIVE;
      } else if (Date.now() >= this.endDate.getTime()) {
        return VOTE_STATUS.FINISH;
      }
    }

    return VOTE_STATUS.WAIT;
  }
}
