const db = window.firebase.firestore();


const FIRESTORE = {
    players: db.collection('players'),
    offers: db.collection('offers'),
    history: db.collection('history')
};

export default FIRESTORE;