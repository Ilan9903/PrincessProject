import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import serviceAccount from './princess-project-210622-firebase-adminsdk-fbsvc-810114bce3.json' with { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Le serveur Princess Backend est en ligne 🚀');
}); 

app.post('/api/valentine-response',  async (req, res) => {
    try {
        const { answer, timestamp } = req.body;

        await db.collection('valentine-responses').add({
            type: 'VALENTINE_REQUEST',
            response: answer, // Sera forcément "OUI" ;)
            date: new Date().toISOString(),
            metadata: 'She said YES!'
        });

        
        console.log("Nouvelle victoire enregistrée !");
        res.status(200).json({ success: true, message: 'Réponse enregistrée pour l\'éternité (jusqu\'à l\'année prochaine)'});
    } catch (error) {
        console.error("Erreur serveur:", error);
        res.status(500).json({ error: 'Erreur interne' });
    }
});

const PORT = process.env.PORT || 2106;
app.listen(PORT, () => {
  console.log(`Serveur backend qui tourne sur le port ${PORT}`);
});