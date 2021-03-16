<template>
  <v-container fluid class="fill-height justify-center">
    <v-responsive max-width="200" width="100%">
      <v-form ref="form" v-model="valid" @submit="setUser" lazy-validation>
        <v-text-field
          dense
          outlined
          autofocus
          class="mb-2"
          hide-details="auto"
          label="nickname"
          placeholder="nickname"
          v-model="user.nick"
          :rules="[v => !!v || 'nickname is required.']"
        />

        <v-btn type="submit" color="primary" block :disabled="!user.nick">
          sign-in
        </v-btn>
      </v-form>
    </v-responsive>
  </v-container>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator';
import { UserInterface } from '@/models/User';

@Component
export default class SignIn extends Vue {
  @Ref('form') readonly $form!: HTMLFormElement;

  private user = {
    nick: '',
  } as UserInterface;
  private valid = false;

  private async setUser() {
    if (this.$form.validate()) {
      await this.$store.dispatch('setUser', this.user);
      await this.$router.push({ name: 'Home' });
    }
  }
}
</script>
