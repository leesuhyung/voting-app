<template>
  <v-card class="mb-2">
    <v-list-item three-line :ripple="false" @click="toggle = !toggle">
      <v-list-item-content>
        <v-list-item-title v-text="vote.title" />
        <v-list-item-subtitle>
          <v-icon small>mdi-pencil</v-icon>
          {{ vote.creator.nick }}
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          <v-icon small>mdi-calendar</v-icon>
          <span v-if="vote.startDate && vote.endDate">
            {{ vote.startDate }} ~ {{ vote.endDate }}
          </span>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-btn
          v-if="user.id === vote.creator.id"
          small
          text
          @click.stop="$emit('edit', vote)"
        >
          EDIT
        </v-btn>
        <v-btn
          v-if="user.id === vote.creator.id"
          small
          color="red"
          text
          @click.stop="$emit('remove')"
        >
          DELETE
        </v-btn>
      </v-list-item-action>
    </v-list-item>

    <div class="pa-3 pt-0" v-if="toggle">
      <v-divider class="mb-3" />
      <v-card
        flat
        v-for="voteItem of vote.voteItems"
        :key="voteItem.id"
        :dark="isActiveVoteItem(voteItem)"
        :color="isActiveVoteItem(voteItem) ? 'secondary' : 'grey lighten-3'"
        @click="selectVoteItem(voteItem)"
        class="pa-2 mt-2 d-flex justify-space-between"
      >
        <div>
          <v-icon small v-if="isActiveVoteItem(voteItem)">mdi-check</v-icon>
          {{ voteItem.name }}
        </div>
        <div v-if="vote.isStatusLive() || vote.isStatusFinish()">
          <v-icon small>
            mdi-account
          </v-icon>
          {{ voteItem.vote }}
        </div>
      </v-card>
      <v-btn
        v-if="vote.isStatusLive()"
        block
        color="secondary"
        class="mt-2"
        :disabled="wasVote || !selectedVoteItem.id"
        @click="submit"
      >
        {{ wasVote ? 'VOTED' : 'VOTE' }}
      </v-btn>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { VoteInterface } from '@/models/Vote';
import { UserInterface } from '@/models/User';
import { VoteItemInterface } from '@/models/VoteItem';

@Component
export default class VoteCard extends Vue {
  @Prop() vote!: VoteInterface;
  @Watch('toggle')
  onChangeToggle(v: boolean) {
    if (!v) this.selectedVoteItem = {} as VoteItemInterface;
  }

  private toggle = false;
  private selectedVoteItem = {} as VoteItemInterface;

  get user(): UserInterface {
    return this.$store.getters['user'];
  }

  get verifyUser(): boolean {
    return this.$store.getters['verifyUser'];
  }

  get wasVote(): boolean {
    const voters = this.vote.voteItems.flatMap(voteItem => voteItem.voters);
    return !!voters.find(voter => voter.id === this.user.id);
  }

  private beforeAction(): boolean {
    if (!this.verifyUser) {
      this.$emit('signIn');
      return false;
    }

    return true;
  }

  private selectVoteItem(voteItem: VoteItemInterface): boolean | void {
    if (!this.vote.isStatusLive()) return false;

    if (this.beforeAction()) {
      if (this.wasVote) {
        return false;
      }

      this.selectedVoteItem = voteItem;
    }
  }

  private isActiveVoteItem(voteItem: VoteItemInterface): boolean {
    return (
      this.selectedVoteItem.id === voteItem.id ||
      !!voteItem.voters.find(voter => voter.id === this.user.id)
    );
  }

  private async submit(): Promise<void> {
    this.selectedVoteItem.vote++;
    this.selectedVoteItem.voters.push(this.user);
    await this.$store.dispatch('updateVoteItem', this.selectedVoteItem);
    this.selectedVoteItem = {} as VoteItemInterface;
  }
}
</script>
