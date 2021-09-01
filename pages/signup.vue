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
      <div><h1 class="font-bold text-xl text-gray-700">会員登録</h1></div>
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
        <label for="name">名前</label
        ><input
          type="text"
          v-model="userInfo.name"
          class="w-3/6 m-1 rounded-md border border-gray-300 focus:outline-none"
        />
      </div>
      <div>
        <label for="tel">電話番号</label
        ><input
          type="text"
          v-model="userInfo.tel"
          class="w-3/6 m-1 rounded-md border border-gray-300 focus:outline-none"
        />
      </div>
      <div>
        <label for="postalcode">郵便番号</label
        ><input
          type="text"
          v-model="userInfo.postalcode"
          class="w-3/6 m-1 rounded-md border border-gray-300 focus:outline-none"
        />
      </div>

      <div>
        <label for="address">住所</label
        ><input
          type="text"
          v-model="userInfo.address"
          class="w-3/6 m-1 rounded-md border border-gray-300 focus:outline-none"
        />
      </div>
      <div>
        <button
          @click="signup"
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
          登録
        </button>
      </div>
      <div>
        <nuxt-link to="/signin" class="text-blue-700 underline"
          >Already a user? Sign-in</nuxt-link
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import firebase, { auth, db } from '~/plugins/firebase';
import { userInfoType } from '../types/userInfoType';
type DataType = {
  userInfo: userInfoType;
};

export default Vue.extend({
  data(): DataType {
    return {
      userInfo: {
        email: '',
        password: '',
        name: '',
        tel: '',
        postalcode: '',
        address: '',
        uid: '',
      },
    };
  },
  methods: {
    async signup(): Promise<void> {
      try {
        // メールとパスワードで会員登録
        if (
          this.userInfo.email === undefined ||
          this.userInfo.password === undefined
        )
          return;
        const authUser: firebase.auth.UserCredential =
          await auth.createUserWithEmailAndPassword(
            this.userInfo.email,
            this.userInfo.password
          );
        // dbに会員情報を保存
        if (authUser.user === null) return;
        await this.addAuthUserToDb(authUser.user.uid);
        //会員登録後、ログイン画面に遷移
        this.$router.push('/signin');
      } catch (error) {
        console.log(error.message + 'サインインエラー');
      }
    },
    addAuthUserToDb(
      uid: string
    ): Promise<
      firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
    > {
      return db.collection(`users/${uid}/userInfo`).add({
        email: this.userInfo.email,
        name: this.userInfo.name,
        tel: this.userInfo.tel,
        postalcode: this.userInfo.postalcode,
        address: this.userInfo.address,
        uid: uid,
      });
    },
  },
});
</script>
