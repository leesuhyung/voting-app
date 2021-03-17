<template>
  <v-dialog v-model="$dialog" max-width="400">
    <v-card class="pa-3">
      <v-form ref="form" v-model="valid" @submit="submit">
        <span class="text-body-2"
          >{{ $voteForm.id ? 'Edit' : 'Add' }} vote</span
        >
        <v-text-field
          autofocus
          class="mb-3"
          label="vote title"
          hide-details="auto"
          v-model="$voteForm.title"
          :rules="[v => !!v || 'vote title is required.']"
        />

        <v-card color="grey lighten-3" flat class="pa-3 mb-3">
          <span class="text-caption">Vote items</span>
          <div v-for="(voteItem, index) of $voteForm.voteItems" :key="index">
            <v-text-field
              hide-details
              class="mb-3"
              :label="`${index + 1} item name`"
              v-model="voteItem.name"
            />
          </div>
        </v-card>

        <div class="d-flex mb-8">
          <v-dialog
            ref="startDateDialog"
            :return-value.sync="$voteForm.startDate"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="$voteForm.startDate"
                label="start date"
                prepend-icon="mdi-calendar"
                readonly
                hide-details="auto"
                :rules="[
                  v =>
                    v && $voteForm.endDate
                      ? v < $voteForm.endDate ||
                        'start date must be less than end date.'
                      : true,
                ]"
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="$voteForm.startDate" no-title>
              <v-spacer></v-spacer>
              <v-btn
                text
                color="primary"
                @click="$refs.startDateDialog.isActive = false"
              >
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.startDateDialog.save($voteForm.startDate)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>

          <v-dialog
            ref="endDateDialog"
            :return-value.sync="$voteForm.endDate"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                class="ml-2"
                v-model="$voteForm.endDate"
                label="end date"
                prepend-icon="mdi-calendar"
                readonly
                hide-details="auto"
                :rules="[
                  v =>
                    v && $voteForm.startDate
                      ? v > $voteForm.startDate ||
                        'end date must be greater than start date.'
                      : true,
                ]"
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="$voteForm.endDate" no-title>
              <v-spacer></v-spacer>
              <v-btn
                text
                color="primary"
                @click="$refs.endDateDialog.isActive = false"
              >
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.endDateDialog.save($voteForm.endDate)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </div>

        <v-btn type="submit" block :disabled="!valid" @click="submit">
          {{ $voteForm.id ? 'edit' : 'add' }} vote
        </v-btn>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, PropSync, Ref, Vue, Watch } from 'vue-property-decorator';
import { VoteInterface } from '@/models/Vote';

@Component
export default class VoteFormDialog extends Vue {
  @Ref('form') readonly $form!: HTMLFormElement;
  @PropSync('dialog', { type: Boolean }) $dialog!: boolean;
  @PropSync('voteForm', { type: Object }) $voteForm!: VoteInterface;
  @Watch('$dialog')
  onChangeDialog() {
    this.$form && this.$form.resetValidation();
  }

  private valid = false;

  private submit() {
    if (this.$form.validate()) {
      this.$emit('submit');
    }
  }
}
</script>
