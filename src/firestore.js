const db = window.firebase.firestore();


const FIRESTORE = {
    players: db.collection('players'),
    history: db.collection('history')
};

export default FIRESTORE;