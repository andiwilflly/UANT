const db = window.firebase.firestore();


const FIRESTORE = {
    players: db.collection('players')
};

export default FIRESTORE;