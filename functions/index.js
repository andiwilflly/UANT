const functions = require('firebase-functions');

// const translate = require('./translate.function');

const cors = require('cors')({ origin: true });
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
   cors(request, response, () => {
      response.send({ h: "Hello from Firebase!"});
   })
});

// exports.translate = functions.https.onRequest((request, response) => {
//
//    //console.log(request.body, request.params, request.body, 42);
//
//    cors(request, response, ()=> {
//       translate.then(translation => {
//          response.send({ translation });
//       }).catch(e => response.send({ error: JSON.stringify(e) }));
//    })
// });
