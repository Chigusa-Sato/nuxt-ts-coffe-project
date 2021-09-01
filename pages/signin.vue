<template>
  <div>
    <div
      type="text"
      class="
        bg-white
        container
        mx-auto
        p-10
        max-w-xs
        rounded-lg
        overflow-hidden
        shadow
        flex flex-col
      "
    >
      <div><h1>ログイン</h1></div>
      <div>
        <label for="email">メール</label
        ><input
          type="text"
          v-model="userInfo.email"
          class="w-3/6 m-1 rounded-md border border-gray-300 focus:outline-none"
        />
      </div>
      <div>
        <label for="password">パスワード</label
        ><input
          type="text"
          v-model="userInfo.password"
          class="w-3/6 m-1 rounded-md border border-gray-300 focus:outline-none"
        />
      </div>
      <div>
        <button
          @click="login"
          class="
            text-white
            font-semibold
            bg-green-500
            py-2
            px-4
            rounded-lg
            shadow-md
            transition
            duration-200
            transform-gpu
            hover:scale-105
          "
        >
          ログイン
        </button>
      </div>
      <div>
        <nuxt-link to="/signup" class="text-blue-700 underline"
          >Not a user? Sign-up</nuxt-link
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { userLoginType } from '../types/userInfoType';
import { UserStore } from '../store';
import { auth } from '~/plugins/firebase';

type DataType = {
  userInfo: userLoginType;
};

export default Vue.extend({
  middleware: 'authenticated',
  data(): DataType {
    return {
      userInfo: {
        email: '',
        password: '',
      },
    };
  },
  methods: {
    login(): void {
      if (typeof this.userInfo !== undefined) {
        console.log(typeof this.userInfo);
        auth
          .signInWithEmailAndPassword(
            this.userInfo.email,
            this.userInfo.password
          )
          .then((authUser) => {
            console.log(authUser.user);
            if (
              authUser.user === null ||
              authUser.user.email === null ||
              authUser.user.uid === null
            )
              return;
            UserStore.loginAct(authUser.user.email, authUser.user.uid).then(
              () => this.$router.push('/')
            );
          });
      } else {
        console.log('undefined');
      }
    },
  },
});
</script>
