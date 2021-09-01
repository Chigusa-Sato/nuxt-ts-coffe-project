<template>
  <div>
    <div class="flex items-center container m-4">
      <input
        class="
          w-3/6
          p-2
          py-2
          mr-2
          rounded-md
          border border-gray-300
          focus:outline-none
          mt-0 mb-0 ml-auto
        "
        placeholder="Search"
        v-model="keyWord"
      />
      <img
        src="../../assets/img/search.png"
        class="block w-6 mr-auto"
        style=""
        @click="search"
      />
    </div>
    <div class="w-3/6 p-2 m-2 text-red-400 font-bold">
      <p v-show="resultNullFlg">※該当する商品がありません</p>
      <p v-show="keywordNullFlg">※検索ワードを入力してください</p>
    </div>
    <div class="flex flex-wrap">
      <div
        class="
          container
          mx-auto
          p-8
          max-w-xs
          rounded
          overflow-hidden
          shadow
          hover:shadow-xl
          transition
          duration-300
          m-3
        "
        v-for="item in searchedItems"
        :key="item.id"
      >
        <img class="rounded-xl" :src="item.img" alt="" />
        <div class="flex justify-between items-center">
          <div>
            <h1 class="mt-5 text-xl font-semibold">{{ item.name }}</h1>
            <p class="mt-2">{{ item.price }}円(税込)</p>
          </div>
          <div>
            <router-link
              :to="{ name: 'ItemDetail', params: { itemid: item.id } }"
            >
              <button
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
                詳細
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap" v-show="searchedItems.length === 0">
      <div
        class="
          container
          p-10
          w-2/5
          max-w-xs
          rounded
          overflow-hidden
          shadow
          hover:shadow-xl
          transition
          duration-300
          m-3
        "
        v-for="item in itemsFromStore"
        :key="item.id"
      >
        <img class="rounded-xl" :src="item.img" />
        <div class="flex justify-between items-center">
          <div>
            <h1 class="mt-5 text-xl font-semibold">{{ item.name }}</h1>
            <p class="mt-2">{{ item.price }}円(税込)</p>
          </div>
          <div>
            <router-link
              :to="{ name: 'ItemDetail-itemId', params: { itemId: item.id } }"
            >
              <button
                class="
                  text-white
                  font-semibold
                  bg-green-500
                  py-2
                  px-3
                  rounded-lg
                  shadow-md
                  transition
                  duration-200
                  transform-gpu
                  hover:scale-105
                "
              >
                詳細
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { itemType } from '../../types/itemType';
import { ItemsStore } from '../../store';

type DataType = {
  keyWord: string;
  searchedItems: itemType[];
  keywordNullFlg: boolean;
  resultNullFlg: boolean;
};

export default Vue.extend({
  data(): DataType {
    return {
      keyWord: '',
      searchedItems: [],
      keywordNullFlg: false, // 検索ワード未入力の場合
      resultNullFlg: false, // 該当結果無しの場合
    };
  },
  methods: {
    search() {
      this.searchedItems = [];
      // 検索ワードなし
      if (this.keyWord === '') {
        console.log(this.keyWord);
        this.keywordNullFlg = true;
        this.resultNullFlg = false;
      } else {
        this.keywordNullFlg = false;
        this.resultNullFlg = false;
        this.itemsFromStore.forEach((item: itemType) => {
          if(item.name===undefined)return;
          
          // 該当結果あり
          if (item.name.indexOf(this.keyWord) >= 0) {
            this.searchedItems.push(item);
            console.log(item);
          }
        });
        // 該当結果なし
        if (this.searchedItems.length === 0) {
          this.resultNullFlg = true;
        }
      }
    },
  },
  computed: {
    itemsFromStore() {
      return ItemsStore.getItems;
    },
  },
});
</script>
