<template>
  <v-container fluid>
    <v-btn @click="addVote">ADD VOTE</v-btn>

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

    <v-dialog v-model="dialog" max-width="200">
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

    {{ user }}
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { VoteInterface } from '@/models/Vote';
import { VoteItemInterface } from '@/models/VoteItem';
import { User, UserInterface } from '@/models/User';

@Component
export default class Home extends Vue {
  @Watch('dialog')
  onChangeDialog() {
    this.userForm.nick = '';
  }

  private dialog = false;
  private userForm = {
    nick: '',
  } as UserInterface;
  private valid = false;

  private beforeAction(): boolean {
    if (!this.verifyUser) {
      this.dialog = true;
      return false;
    }

    return true;
  }

  addVote() {
    if (this.beforeAction()) {
      const vote = {
        title: 'new vote',
      } as VoteInterface;
      this.$store.dispatch('addVote', vote);
    }
  }

  updateVote(updateVote: VoteInterface) {
    this.$store.dispatch('updateVote', updateVote);
  }

  removeVote(index: number) {
    this.$store.dispatch('removeVote', index);
  }

  updateVoteItem(updateVoteItem: VoteItemInterface) {
    this.$store.dispatch('updateVoteItem', updateVoteItem);
  }

  private async setUser() {
    await this.$store.dispatch('setUser', this.userForm);
    this.dialog = false;
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
