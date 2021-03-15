import { v4 as uuid4 } from 'uuid';

export interface UserInterface {
  id: string;
  nick: string;
}

export class User implements UserInterface {
  id = '';
  nick = '';

  constructor(user?: UserInterface) {
    user && Object.assign(this, user);
    if (!this.id) {
      this.id = uuid4();
    }
  }
}
