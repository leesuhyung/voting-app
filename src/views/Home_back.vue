<template>
  <v-container fluid>
    <v-btn fab absolute large dark bottom right @click="openVoteDialog">
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <v-card v-for="(vote, index) of votes" :key="vote.id" class="ma-3">
      <v-card-text>
        <v-text-field label="투표제목" v-model="vote.title" />

        <div class="d-flex justify-space-between">
          <v-card
              v-for="voteItem of vote.voteItems"
              :key="voteItem.id"
              width="100%"
              class="mx-2"
          >
            <v-card-text>
              <v-text-field
                  label="항목명"
                  v-model="voteItem.name"
                  class="mb-3"
              />
              <v-text-field label="투표수" readonly :value="voteItem.vote" />
            </v-card-text>
            <v-card-actions>
              <v-btn small @click="updateVoteItem(voteItem)">UPT</v-btn>
              <v-btn small :disabled="!verifyUser">VOTE</v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn small @click="updateVote(vote)">UPT</v-btn>
        <v-btn small @click="removeVote(index)">DEL</v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="userDialog" max-width="200">
      <v-card class="pa-3">
        <v-text-field
            autofocus
            hide-details
            class="mb-3"
            label="nickname"
            v-model="userForm.nick"
            @keyup.enter.native.prevent="setUser"
        />

        <v-btn block :disabled="!userForm.nick" @click="setUser">
          sign-in
        </v-btn>
      </v-card>
    </v-dialog>

    <v-dialog v-model="voteDialog" max-width="200">
      <v-card class="pa-3">
        <v-text-field
            autofocus
            hide-details
            class="mb-3"
            label="vote title"
            v-model="voteForm.title"
            @keyup.enter.native.prevent="addVote"
        />

        <v-btn block :disabled="!voteForm.title" @click="addVote">
          add vote
        </v-btn>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { VoteInterface } from '@/models/Vote';
import { VoteItemInterface } from '@/models/VoteItem';
import { User, UserInterface } from '@/models/User';

@Component
export default class Home extends Vue {
  @Watch('userDialog')
  onChangeUserDialog() {
    this.userForm.nick = '';
  }

  @Watch('voteDialog')
  onChangeVoteDialog() {
    this.voteForm.title = '';
  }

  private voteDialog = false;
  private userDialog = false;
  private voteForm = {
    title: '',
  } as VoteInterface;
  private userForm = {
    nick: '',
  } as UserInterface;

  private beforeAction(): boolean {
    if (!this.verifyUser) {
      this.userDialog = true;
      return false;
    }

    return true;
  }

  private openVoteDialog() {
    if (this.beforeAction()) {
      this.voteDialog = true;
    }
  }

  private async addVote() {
    await this.$store.dispatch('addVote', this.voteForm);
    this.voteDialog = false;
  }

  private updateVote(updateVote: VoteInterface) {
    this.$store.dispatch('updateVote', updateVote);
  }

  private removeVote(index: number) {
    this.$store.dispatch('removeVote', index);
  }

  private updateVoteItem(updateVoteItem: VoteItemInterface) {
    this.$store.dispatch('updateVoteItem', updateVoteItem);
  }

  private async setUser() {
    await this.$store.dispatch('setUser', this.userForm);
    this.userDialog = false;
  }

  get votes(): VoteInterface[] {
    return this.$store.getters['votes'];
  }

  get verifyUser(): boolean {
    return this.$store.getters['verifyUser'];
  }

  get user(): User {
    return this.$store.getters['user'];
  }
}
</script>
<style lang="scss" scoped>
.v-btn--fab.v-size--large.v-btn--absolute.v-btn--bottom {
  bottom: 16px;
}
</style>
