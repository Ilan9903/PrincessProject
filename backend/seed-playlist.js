import admin from './src/config/firebase.js';
import { getDb } from './src/config/firebase.js';

const seedPlaylist = async () => {
  try {
    const db = getDb();
    console.log('✅ Connecté avec succès');
    
    // 🗑️ Supprimer toutes les anciennes chansons
    console.log('🗑️ Suppression des anciennes chansons...');
    const existingSongs = await db.collection('playlist').get();
    const deletePromises = existingSongs.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
    console.log(`✅ ${existingSongs.size} ancienne(s) chanson(s) supprimée(s)`);
    
    const songs = [
      {
        title: "Perfect",
        artist: "Ed Sheeran",
        album: "Divide",
        platform: "spotify",
        url: "https://open.spotify.com/track/0tgVpDi06FyKpA1z0VMD4v",
        addedBy: "me",
        reason: "Notre chanson ❤️",
        isFavorite: true,
        playCount: 42,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastPlayedAt: null
      },
      {
        title: "All of Me",
        artist: "John Legend",
        album: "Love in the Future",
        platform: "youtube",
        url: "https://www.youtube.com/watch?v=450p7goxZqg",
        addedBy: "princess",
        reason: "Cette chanson me fait penser à toi",
        isFavorite: true,
        playCount: 28,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastPlayedAt: null
      },
      {
        title: "A Thousand Years",
        artist: "Christina Perri",
        album: "The Twilight Saga: Breaking Dawn",
        platform: "spotify",
        url: "",
        addedBy: "both",
        reason: "Notre première danse",
        isFavorite: true,
        playCount: 35,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastPlayedAt: null
      },
      {
        title: "Thinking Out Loud",
        artist: "Ed Sheeran",
        album: "x",
        platform: "spotify",
        url: "",
        addedBy: "me",
        reason: "Romantique comme nous",
        isFavorite: false,
        playCount: 15,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastPlayedAt: null
      },
      {
        title: "La Vie en Rose",
        artist: "Édith Piaf",
        album: "",
        platform: "youtube",
        url: "https://www.youtube.com/watch?v=kFzViYkZAz4",
        addedBy: "princess",
        reason: "Classique mais magnifique",
        isFavorite: false,
        playCount: 12,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastPlayedAt: null
      },
      {
        title: "Can't Help Falling in Love",
        artist: "Elvis Presley",
        album: "Blue Hawaii",
        platform: "apple_music",
        url: "",
        addedBy: "me",
        reason: "Un classique intemporel",
        isFavorite: true,
        playCount: 21,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastPlayedAt: null
      },
      {
        title: "Make You Feel My Love",
        artist: "Adele",
        album: "19",
        platform: "spotify",
        url: "",
        addedBy: "both",
        reason: "Cette voix... ✨",
        isFavorite: false,
        playCount: 9,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastPlayedAt: null
      }
    ];
    
    console.log('🎵 Création des chansons...');
    
    for (const song of songs) {
      await db.collection('playlist').add(song);
      console.log(`✅ 🎶 ${song.title} - ${song.artist}`);
    }
    
    console.log('🎉 Toutes les chansons ont été ajoutées avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

seedPlaylist();
