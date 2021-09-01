import { Store } from 'vuex';
import { initialiseStores } from '../utils/store-accsessor';
import { Context } from "@nuxt/types";
import {getUserFromCookie } from '~/helpers/index';
export const strict = false
export * from '../utils/store-accsessor';

export const actions = {
    async nuxtServerInit ( { dispatch }:any  ,{req}:Context ) {// 引数reqでサーバにあるデータを取得（今回はcookie）
      console.log("nuxtServerInit発動")
      const userFromCookie:any = getUserFromCookie(req)
      if (userFromCookie) {
          console.log("ユーザーがいるのでストアにユーザーをセット"+JSON.stringify(userFromCookie))
        await dispatch('user/setUserAct', { email: userFromCookie.email, uid: userFromCookie.user_id})
      }
      if(!userFromCookie) {
        console.log("ユーザーいないので何もしません")
      }
    }
  }

  const initializer = (store: Store<any>) => initialiseStores(store)
  export const plugins = [initializer]
