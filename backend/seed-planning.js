import admin from './src/config/firebase.js';
import { getDb } from './src/config/firebase.js';

const seedPlanning = async () => {
  try {
    const db = getDb();
    console.log('✅ Connecté avec succès');
    
    // 🗑️ Supprimer tous les anciens événements
    console.log('🗑️ Suppression des anciens événements...');
    const existingEvents = await db.collection('planning').get();
    const deletePromises = existingEvents.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
    console.log(`✅ ${existingEvents.size} ancien(s) événement(s) supprimé(s)`);
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const twoWeeks = new Date(today);
    twoWeeks.setDate(today.getDate() + 14);
    
    const events = [
      {
        title: "Dîner aux chandelles 🕯️",
        description: "Type: Romantique",
        date: tomorrow.toISOString().split('T')[0],
        time: "19:30",
        location: "À la maison",
        type: "date",
        status: "planned",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      },
      {
        title: "Soirée Netflix & Plaid (Tu choisis le film) 🍿",
        description: "Type: Chill",
        date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: "20:00",
        location: "",
        type: "activity",
        status: "confirmed",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      },
      {
        title: "Cinéma (Popcorn obligatoire) 🎬",
        description: "Type: Classique",
        date: nextWeek.toISOString().split('T')[0],
        time: "18:00",
        location: "UGC",
        type: "date",
        status: "planned",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      },
      {
        title: "Balade en forêt ou parc 🌳",
        description: "Type: Nature",
        date: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: "14:00",
        location: "Parc de la ville",
        type: "activity",
        status: "planned",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      },
      {
        title: "Resto Chic Surprise (prépare-toi !) 👗",
        description: "Type: Sortie",
        date: twoWeeks.toISOString().split('T')[0],
        time: "19:00",
        location: "Surprise !",
        type: "date",
        status: "confirmed",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      }
    ];
    
    console.log('📅 Création des événements...');
    
    for (const event of events) {
      await db.collection('planning').add(event);
      console.log(`✅ 📆 ${event.title}`);
    }
    
    console.log('🎉 Tous les événements ont été créés avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

seedPlanning();
