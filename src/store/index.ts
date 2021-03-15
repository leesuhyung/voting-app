import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { UserInterface } from '@/models/User';
import { Vote, VOTE_STATUS, VoteInterface } from '@/models/Vote';

Vue.use(Vuex);

interface State {
  user: UserInterface;
  votes: VoteInterface[];
}

export default new Vuex.Store<State>({
  state: {
    user: {} as UserInterface,
    votes: [] as VoteInterface[],
  },
  plugins: [createPersistedState()],
  mutations: {
    // todo: +removeVote +updateVote (이름,시작/종료일 변경)
    // todo: +updateVoteItem (이름변경)
    // todo: +voting (투표 VoteItem.vote++) (voters 에 유저 추가) (voters 에 이미 유저가 있으면 에러)
    addVote(state: State, vote: VoteInterface) {
      state.votes.push(new Vote(vote));
    },
  },
  actions: {
    addVote({ commit }, vote: VoteInterface) {
      commit('addVote', vote);
    },
  },
  getters: {
    votes: (state: State): VoteInterface[] => {
      return state.votes.map(vote => {
        if (vote.startDate && vote.endDate) {
          if (Date.now() < vote.startDate.getTime()) {
            vote.status = VOTE_STATUS.WAIT;
          } else if (
            Date.now() >= vote.startDate.getTime() &&
            Date.now() < vote.endDate.getTime()
          ) {
            vote.status = VOTE_STATUS.LIVE;
          } else if (Date.now() >= vote.endDate.getTime()) {
            vote.status = VOTE_STATUS.FINISH;
          }
        }

        return vote;
      });
    },
  },
  modules: {},
});
