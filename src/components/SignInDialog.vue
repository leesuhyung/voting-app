<template>
  <v-dialog v-model="$dialog" max-width="200">
    <v-card class="pa-3 cyp-dialog__sign-in">
      <v-text-field
        autofocus
        hide-details
        class="mb-3"
        label="nickname"
        v-model="$userForm.nick"
        @keyup.enter.native.prevent="$emit('submit')"
      />

      <v-btn block :disabled="!$userForm.nick" @click="$emit('submit')">
        sign-in
      </v-btn>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from 'vue-property-decorator';
import { UserInterface } from '@/models/User';

@Component
export default class SignInDialog extends Vue {
  @PropSync('dialog', { type: Boolean }) $dialog!: boolean;
  @PropSync('userForm', { type: Object }) $userForm!: UserInterface;
}
</script>
