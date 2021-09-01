<template>
  <nav class="space-x-10 space-y-5 w-10">
    <ul class="m-0 p-0">
      <li class="block mb-5"><img src="~/assets/img/4.png" class="w-2/3 mt-4 mb-0 mr-auto ml-auto" /></li>
      <li class="block mb-3 font-bold text-center">
        <router-link to="/">Home</router-link>
      </li>
      <li class="block mb-3 font-bold text-center">
        <router-link to="/Cart">カート</router-link>
      </li>
      <li class="block mb-3 font-bold text-center" v-if="userInfoFromStore">
        <router-link to="/OrderLog">注文履歴</router-link>
      </li>
      <li class="block mb-3 font-bold text-center">
        <router-link to="/signup">会員登録</router-link>
      </li>
      <li class="block mb-3 font-bold text-center" v-if="!userInfoFromStore">
        <router-link to="/signin">ログイン</router-link>
      </li>
      <li class="block mb-3 text-center" v-if="userInfoFromStore">
        <router-link to="/"><button class="font-bold" @click="logout">ログアウト</button></router-link>
      </li>
      <li
        v-if="userInfoFromStore"
        class="block mb-3 text-center font-bold text-yellow-700"
      >
        {{userInfoFromStore.name }}
      </li>
    </ul>
  </nav>
</template>

<script>
import { UserStore } from '../store';
import Vue from 'vue';
export default Vue.extend({
  methods: {
    logout() {
      if (this.userInfoFromStore) {
        UserStore.logout();
      }
    },
  },
  computed: {
    userInfoFromStore() {
      return UserStore.getUserInfo;
    },
    uidFromStore(){
      return UserStore.getUid;
    }
  },
});
</script>
