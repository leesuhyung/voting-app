<template>
  <v-app>
    <v-app-bar app>
      VOTE APP
      <v-spacer />
      <div v-if="verifyUser" class="d-flex">
        <div class="d-flex align-center">
          <v-icon>
            mdi-account-circle
          </v-icon>
          {{ user.nick }}
        </div>
        <v-btn class="ml-2" color="grey" text @click="signOut">
          sign-out
        </v-btn>
      </div>
    </v-app-bar>

    <v-main class="grey lighten-3">
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { User } from '@/models/User';

@Component
export default class App extends Vue {
  get verifyUser(): boolean {
    return this.$store.getters['verifyUser'];
  }

  get user(): User {
    return this.$store.getters['user'];
  }

  private signOut() {
    this.$store.dispatch('removeUser');
  }
}
</script>
