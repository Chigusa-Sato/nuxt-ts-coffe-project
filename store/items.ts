import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators"
import { db } from "~/plugins/firebase";
import { itemType } from '../types/itemType'

@Module({ name: 'items', namespaced: true ,stateFactory: true})

 export default class ItemsStore extends VuexModule {

    // state-----------------------------------------------------
   public items:itemType[] = []

    //getters----------------------------------------------------
    // stateのitemsをid順に並び替え
    public get getItems(): itemType[]{
        const sortItems:itemType[] = this.items.slice().sort((a: itemType, b: itemType):number=>{
            if(a.id===undefined||b.id===undefined) return 0;
                if(a.id > b.id){
                    return 1
                } else {
                    return -1
                }
            })
        return sortItems  
    }

    // 商品詳細画面の商品情報を抽出
    public get getItemDetail() {
        return (detailParamsId:number) => {
            return this.items.find(item => item.id === detailParamsId)
        }
    }

    // mutation--------------------------------------------------
    // 商品データ取得
    @Mutation
    private fetchItemsMut(itemsFromDb:itemType):void{
        this.items.push(itemsFromDb)
    }

    // action----------------------------------------------------
    // 商品データ取得
     @Action({rawError: true})
      public async fetchItemsAct(): Promise<void>{
       await db.collection(`items`).get().then(items=>{
            items.forEach(item=>{
                 const itemsFromDb:itemType = item.data()
                 this.fetchItemsMut(itemsFromDb)
            })
        })
        }

    // Storageから画像を全部取得し、URLに変更する------------------------
    //   @Action({rawError: true})
    //  public getImgListAct(): void{
    //       const storageRef = Storage.ref();
    //       // 全画像を取得
    //       storageRef.listAll().then(pictures=>pictures.items.forEach(picture=>
    //       // URLに変換 picture.name「2.jpg、11.jpg」
    //         storageRef.child(picture.name).getDownloadURL().then(pic_URL=>{this.getImgListMut(pic_URL)})
    //       ))
    //   }
}
