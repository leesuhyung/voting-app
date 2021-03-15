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
  startDate: Date | null;
  endDate: Date | null;
  status: VOTE_STATUS;
  creator: UserInterface;
  voteItems: VoteItemInterface[];
}

export class Vote implements VoteInterface {
  id = '';
  title = '';
  startDate = null;
  endDate = null;
  status = VOTE_STATUS.WAIT;
  creator = {} as UserInterface;
  voteItems = [] as VoteItemInterface[];

  constructor(vote?: VoteInterface) {
    vote && Object.assign(this, vote);
    if (!this.id) {
      this.id = uuid4();
      while (
        this.voteItems.length < process.env.VUE_APP_DEFAULT_VOTE_ITEM_COUNT
      ) {
        this.voteItems.push(new VoteItem());
      }
    }

    if (this.creator.id) {
      this.creator = new User(this.creator);
    }

    if (this.voteItems.length) {
      for (let voteItem of this.voteItems) {
        if (!(voteItem instanceof VoteItem)) {
          voteItem = new VoteItem(voteItem);
        }
      }
    }
  }
}
