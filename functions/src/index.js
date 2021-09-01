//import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require('firebase-functions');  
const { Nuxt } = require('nuxt');  
const nuxt = new Nuxt({  
   buildDir: 'ssr',  
   dev: false  
});  
  
exports.ssr = functions.https.onRequest(async (req, res) => {  
   await nuxt.ready()  
   return nuxt.render(req, res)  
})  
