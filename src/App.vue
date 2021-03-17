<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list-item>
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>John Leider</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title>gdgdgdgd</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      VOTE APP
      <v-spacer />
      <v-menu
        v-if="verifyUser"
        open-on-hover
        bottom
        right
        offset-x
        offset-y
        max-width="80"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-chip label v-bind="attrs" v-on="on">
            <v-icon left>
              mdi-account-circle
            </v-icon>
            {{ user.nick }}
          </v-chip>
        </template>

        <v-list>
          <v-list-item dense @click="signOut">
            <v-list-item-title>sign-out</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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
  drawer = false;

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
