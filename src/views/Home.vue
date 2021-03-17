<template>
  <v-container fluid>
    <v-btn
      class="cyp-btn__add-vote"
      fab
      absolute
      large
      dark
      bottom
      right
      @click="openVoteAddDialog"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <div v-for="(list, index) of lists" :key="index">
      <v-subheader v-text="list.status" class="text-body-1 font-weight-bold" />

      <VoteCard
        v-for="vote of list.votes"
        :key="vote.id"
        :vote="vote"
        @edit="openVoteEditDialog"
        @remove="removeVote(vote.id)"
        @signIn="userDialog = true"
      />
    </div>

    <SignInDialog
      :dialog.sync="userDialog"
      :user-form="userForm"
      @submit="setUser"
    />
    <VoteFormDialog
      :dialog.sync="voteFormDialog"
      :vote-form="voteForm"
      @submit="submit"
    />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { VOTE_STATUS, VoteInterface } from '@/models/Vote';
import { VoteItemInterface } from '@/models/VoteItem';
import { UserInterface } from '@/models/User';
import VoteCard from '@/components/VoteCard.vue';
import SignInDialog from '@/components/SignInDialog.vue';
import VoteFormDialog from '@/components/VoteFormDialog.vue';

@Component({
  components: {
    VoteCard,
    SignInDialog,
    VoteFormDialog,
  },
})
export default class Home extends Vue {
  @Watch('userDialog')
  onChangeUserDialog() {
    this.clearUserForm();
  }

  @Watch('voteFormDialog')
  onChangeVoteFormDialog(v: boolean) {
    if (!v) this.clearVoteForm();
  }

  private created() {
    this.clearVoteForm();
    this.clearUserForm();
  }

  private voteFormDialog = false;
  private voteForm = {} as VoteInterface;

  private userDialog = false;
  private userForm = {} as UserInterface;

  private beforeAction(): boolean {
    if (!this.verifyUser) {
      this.userDialog = true;
      return false;
    }

    return true;
  }

  private openVoteAddDialog() {
    if (this.beforeAction()) {
      this.voteFormDialog = true;
    }
  }

  private openVoteEditDialog(vote: VoteInterface) {
    if (this.beforeAction()) {
      this.voteForm = JSON.parse(JSON.stringify(vote));
      this.voteFormDialog = true;
    }
  }

  private async submit() {
    if (!this.voteForm.id) {
      Object.assign(this.voteForm, { creator: this.user });
      await this.$store.dispatch('addVote', this.voteForm);
    } else {
      await this.$store.dispatch('updateVote', this.voteForm);
    }
    this.voteFormDialog = false;
  }

  private removeVote(id: string) {
    this.$store.dispatch('removeVote', id);
  }

  private async setUser() {
    await this.$store.dispatch('setUser', this.userForm);
    this.userDialog = false;
  }

  private clearVoteForm() {
    this.voteForm = {
      title: '',
      startDate: '',
      endDate: '',
      creator: {} as UserInterface,
      voteItems: (() => {
        const voteItems = [];
        for (let i = 0; i < process.env.VUE_APP_DEFAULT_VOTE_ITEM_COUNT; i++) {
          voteItems.push({ name: '' } as VoteItemInterface);
        }

        return voteItems;
      })(),
    } as VoteInterface;
  }

  private clearUserForm() {
    this.userForm = {
      nick: '',
    } as UserInterface;
  }

  get lists(): { status: VOTE_STATUS; votes: VoteInterface[] }[] {
    const votes: VoteInterface[] = this.$store.getters['votes'];
    return Object.values(VOTE_STATUS).map((status: VOTE_STATUS) => {
      return {
        status,
        votes: votes.filter(vote => vote.status() === status),
      };
    });
  }

  get verifyUser(): boolean {
    return this.$store.getters['verifyUser'];
  }

  get user(): UserInterface {
    return this.$store.getters['user'];
  }
}
</script>
<style lang="scss" scoped>
.v-btn--fab.v-size--large.v-btn--absolute.v-btn--bottom {
  bottom: 16px;
}
</style>
