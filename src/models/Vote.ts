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
      const getToday = (): string => {
        const date = new Date();
        let m: number | string = date.getMonth() + 1;
        let d: number | string = date.getDate();
        m = m >= 10 ? m : `0${m}`;
        d = d >= 10 ? d : `0${d}`;
        return `${date.getFullYear()}-${m}-${d}`;
      };
      const today = getToday();

      if (today >= this.startDate && today < this.endDate) {
        return VOTE_STATUS.LIVE;
      } else if (today >= this.endDate) {
        return VOTE_STATUS.FINISH;
      }
    }

    return VOTE_STATUS.WAIT;
  }
}
