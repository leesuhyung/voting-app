import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { User, UserInterface } from '@/models/User';
import { Vote, VoteInterface } from '@/models/Vote';
import { VoteItemInterface } from '@/models/VoteItem';

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
    // todo: +voting (투표 VoteItem.vote++) (voters 에 유저 추가) (voters 에 이미 유저가 있으면 에러)
    addVote(state: State, vote: VoteInterface) {
      state.votes.push(new Vote(vote));
    },
    updateVote(state: State, updatedVote: VoteInterface) {
      state.votes = state.votes.map(vote => {
        if (vote.id === updatedVote.id) {
          return Object.assign(vote, updatedVote);
        }

        return vote;
      });
    },
    removeVote(state: State, index: number) {
      state.votes.splice(index, 1);
    },
    updateVoteItem(state: State, updateVoteItem: VoteItemInterface) {
      state.votes = state.votes.map(vote => {
        if (vote.id === updateVoteItem.voteId) {
          vote.voteItems = vote.voteItems.map(voteItem => {
            if (voteItem.id === updateVoteItem.id) {
              return Object.assign(voteItem, updateVoteItem);
            }

            return voteItem;
          });
        }

        return vote;
      });
    },
    setUser(state: State, user: UserInterface) {
      state.user = new User(user);
    },
    removeUser(state: State) {
      state.user = {} as UserInterface;
    },
  },
  actions: {
    addVote({ commit }, vote: VoteInterface) {
      commit('addVote', vote);
    },
    updateVote({ commit }, updatedVote: VoteInterface) {
      commit('updateVote', updatedVote);
    },
    removeVote({ commit }, index: number) {
      commit('removeVote', index);
    },
    updateVoteItem({ commit }, updateVoteItem: VoteItemInterface) {
      commit('updateVoteItem', updateVoteItem);
    },
    setUser({ commit }, user: UserInterface) {
      commit('setUser', user);
    },
    removeUser({ commit }) {
      commit('removeUser');
    },
  },
  getters: {
    votes: (state: State): VoteInterface[] => {
      return state.votes.map(vote => new Vote(vote));
    },
    user: (state: State): UserInterface => {
      if (Object.keys(state.user).length) {
        return new User(state.user);
      }

      return {} as UserInterface;
    },
    verifyUser: (state: State): boolean => !!Object.keys(state.user).length,
  },
  modules: {},
});
