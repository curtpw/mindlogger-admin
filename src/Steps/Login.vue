<template>
  <v-container>
    <v-layout
      row
      wrap
    >
      <v-flex v-if="notLoggedIn">
        <LoginForm
          v-if="!createAccount"
          @createAccount="toggleCreateAccount"
        />
        <CreateUserForm
          v-else
          @login="toggleCreateAccount"
        />
      </v-flex>
      <v-flex v-else>
        <v-card>
          <v-card-text>
            <h1 style="text-align: center">
              Hello, {{ auth.user.login }}
            </h1>
            <p>
              Click "continue" or <v-btn
                color="primary"
                @click="logout"
              >
                Logout
              </v-btn>
            </p>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style>
  .error {
    color: 'red';
  }
</style>

<script>
import _ from 'lodash';
import LoginForm from '../Components/Authentication/LoginForm.vue';
import CreateUserForm from '../Components/Authentication/CreateUserForm.vue';

export default {
  name: 'Login',

  components: {
    LoginForm,
    CreateUserForm
  },

  data: () => ({
    username: '',
    password: '',
    error: '',
    createAccount: false
  }),

  computed: {
    /**
     * only let the user continue if they are authenticated
     */
    readyToContinue() {
      if (!_.isEmpty(this.auth)) {
        return true;
      }
      return false;
    },
    /**
     * a boolean value for whether or not the user is logged in
     */
    notLoggedIn() {
      return _.isEmpty(this.auth);
    },
    /**
     * return the auth value from the store.
     */
    auth() {
      return this.$store.state.auth;
    }
  },

  methods: {
    /**
     * nothing to do when continue is pressed
     */
    continueAction() {

    },
    toggleCreateAccount() {
      this.createAccount = !this.createAccount;
    },
    /**
     * clear the store on logout.
     */
    logout() {
      this.$store.commit('setAuth', {});
    }
  },

};
</script>


