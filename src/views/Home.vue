<template>
  <div>
    {{ votes }}
    <v-btn @click="addVote">ADD VOTE</v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { VoteInterface } from '@/models/Vote';

@Component
export default class Home extends Vue {
  addVote() {
    const vote = {
      title: 'first vote',
    } as VoteInterface;
    this.$store.dispatch('addVote', vote);
  }

  get votes(): VoteInterface[] {
    return this.$store.getters['votes'];
  }
}
</script>
