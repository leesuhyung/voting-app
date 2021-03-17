import { v4 as uuid4 } from 'uuid';
import { User, UserInterface } from '@/models/User';
import { VoteItem, VoteItemInterface } from '@/models/VoteItem';

export enum VOTE_STATUS {
  WAIT = 'wait',
  LIVE = 'live',
  FINISH = 'finish',
}

export interface VoteInterface {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  creator: UserInterface;
  voteItems: VoteItemInterface[];
  status(): VOTE_STATUS;
  isStatusFinish(): boolean;
  isStatusLive(): boolean;
}

export class Vote implements VoteInterface {
  id = '';
  title = '';
  startDate = '';
  endDate = '';
  creator = {} as UserInterface;
  voteItems = [] as VoteItemInterface[];

  constructor(vote?: VoteInterface) {
    vote && Object.assign(this, vote);
    if (!this.id) {
      this.id = uuid4();
    }

    if (this.creator.id) {
      this.creator = new User(this.creator);
    }

    if (this.voteItems.length) {
      this.voteItems = this.voteItems.map(
        voteItem => new VoteItem(Object.assign(voteItem, { voteId: this.id })),
      );
    }
  }

  status(): VOTE_STATUS {
    if (this.startDate && this.endDate) {
      const today = new Date().toISOString().substr(0, 10);

      if (today >= this.startDate && today < this.endDate) {
        return VOTE_STATUS.LIVE;
      } else if (today >= this.endDate) {
        return VOTE_STATUS.FINISH;
      }
    }

    return VOTE_STATUS.WAIT;
  }

  isStatusFinish(): boolean {
    return this.status() === VOTE_STATUS.FINISH;
  }

  isStatusLive(): boolean {
    return this.status() === VOTE_STATUS.LIVE;
  }
}
