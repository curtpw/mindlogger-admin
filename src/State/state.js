import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import { Store } from "vuex";
import createPersistedState from 'vuex-persistedstate';

const state = {
  backend: 'https://mindlogger-dev.vasegurt.com/api/v1',
  allApplets: [],
  currentApplet: {},
  auth: {},
  groups: [],
  users: [],
  reviewers: [],
  continue: {},
};

const mutations = {
  setBackend(state, backend) {
    if (backend !== state.backend) {
      state.auth = {};
    }
    state.backend = backend;
  },
  setCurrentApplet(state, activitySet) {
    state.currentApplet = activitySet;
  },
  setAllApplets(state, activitySets) {
    state.allApplets = activitySets;
  },
  setAuth(state, auth) {
    state.auth = auth;
  },
  setSchedule(state, schedule) {
    state.currentApplet.schedule = schedule;
  },
  setGroups(state, groups) {
    state.groups = groups;
  },
  setUsers(state, users) {
    state.users = users;
  },
  setReviewers(state, reviewers) {
    state.reviewers = reviewers;
  },
  continue(state, params) {
    state.continue[params.component] = params.continue;
  }
};

const store = new Store({
  state,
  mutations,
  plugins: [createPersistedState()],
})

export default store;