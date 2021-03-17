<template>
  <v-dialog v-model="$dialog" max-width="400">
    <v-card class="pa-3">
      <span class="text-body-2">Detail Vote</span>

      <v-card-title v-text="vote.title" />

      <v-card color="grey lighten-3" flat class="pa-3 mb-3">
        <span class="text-caption">Vote items</span>
        <div v-for="(voteItem, index) of vote.voteItems" :key="index">
          <p>
            {{ voteItem.name }}
          </p>
        </div>
      </v-card>

      <div class="d-flex mb-8">
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-subtitle>start date</v-list-item-subtitle>
            <v-list-item-title v-text="vote.startDate" />
          </v-list-item-content>
        </v-list-item>

        <v-list-item two-line class="ml-2">
          <v-list-item-content>
            <v-list-item-subtitle>end date</v-list-item-subtitle>
            <v-list-item-title v-text="vote.endDate" />
          </v-list-item-content>
        </v-list-item>
      </div>

      <v-btn block @click="$dialog = false">
        close
      </v-btn>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator';
import { VoteInterface } from '@/models/Vote';

@Component
export default class VoteDetailDialog extends Vue {
  @Prop() vote!: VoteInterface;
  @PropSync('dialog', { type: Boolean }) $dialog!: boolean;
}
</script>
