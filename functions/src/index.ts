import * as functions from "firebase-functions";

// Basic HTTP function
export const helloWorld = functions.https.onRequest((request, response) => {
  response.json({message: "Hello from Firebase Functions!"});
});
