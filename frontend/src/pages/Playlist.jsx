import React, { useState, useEffect, useCallback } from 'react';
import HomeButton from '../components/HomeButton';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import FloatingHearts from '../components/FloatingHearts';
import { authenticatedFetch } from '../Utils/api';

const Playlist = () => {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const fetchSongs = useCallback(async () => {
    try {
      const response = await authenticatedFetch(`/api/playlist?sortBy=${sortBy}`);
      const data = await response.json();
      setSongs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur chargement playlist:', error);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  const applyFilter = useCallback(() => {
    let filtered = [...songs];
    
    if (filter === 'favorites') {
      filtered = filtered.filter(s => s.isFavorite);
    } else if (filter === 'spotify') {
      filtered = filtered.filter(s => s.platform === 'spotify');
    } else if (filter === 'youtube') {
      filtered = filtered.filter(s => s.platform === 'youtube');
    } else if (filter === 'me') {
      filtered = filtered.filter(s => s.addedBy === 'me');
    } else if (filter === 'princess') {
      filtered = filtered.filter(s => s.addedBy === 'princess');
    }
    
    setFilteredSongs(filtered);
  }, [songs, filter]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  useEffect(() => {
    applyFilter();
  }, [applyFilter]);

  const toggleFavorite = async (songId, currentFavorite) => {
    try {
      await authenticatedFetch(`/api/playlist/${songId}/favorite`, {
        method: 'PATCH'
      });
      
      setSongs(songs.map(s => 
        s.id === songId ? { ...s, isFavorite: !currentFavorite } : s
      ));
    } catch (error) {
      console.error('Erreur toggle favorite:', error);
    }
  };

  const incrementPlayCount = async (songId) => {
    try {
      await authenticatedFetch(`/api/playlist/${songId}/play`, {
        method: 'PATCH'
      });
      
      setSongs(songs.map(s => 
        s.id === songId ? { ...s, playCount: (s.playCount || 0) + 1 } : s
      ));
    } catch (error) {
      console.error('Erreur play count:', error);
    }
  };

  const getPlatformIcon = (platform) => {
    switch(platform) {
      case 'spotify': return '🟢';
      case 'youtube': return '📺';
      case 'apple_music': return '🍎';
      default: return '🎵';
    }
  };

  const getAddedByBadge = (addedBy) => {
    switch(addedBy) {
      case 'me': return { text: 'Moi', color: 'bg-blue-100 text-blue-600' };
      case 'princess': return { text: 'Princesse', color: 'bg-pink-100 text-pink-600' };
      case 'both': return { text: 'Nous deux', color: 'bg-purple-100 text-purple-600' };
      default: return { text: 'Inconnu', color: 'bg-gray-100 text-gray-600' };
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center">
          <div className="text-6xl animate-bounce">🎵</div>
          <p className="mt-4 text-gray-600 font-['Playfair_Display']">Chargement de la playlist...</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-pink-50 dark:bg-gray-900 overflow-y-auto font-['Playfair_Display'] transition-colors">
        <FloatingHearts />
        
        <HomeButton />

        <div className="container mx-auto px-6 py-24 max-w-4xl">
          {/* En-tête */}
          <div className="text-center mb-12 z-10 relative">
            <h1 className="text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-500 to-pink-500">
                Notre Playlist
              </span>
              <span className="text-gray-800 dark:text-gray-100">🎶</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Les chansons qui nous accompagnent ❤️
            </p>
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-3 justify-center mb-8 z-10 relative">
            {[
              { value: 'all', label: 'Toutes', icon: '🎵' },
              { value: 'favorites', label: 'Favoris', icon: '❤️' },
              { value: 'spotify', label: 'Spotify', icon: '🟢' },
              { value: 'youtube', label: 'YouTube', icon: '📺' },
              { value: 'me', label: 'Ajoutées par moi', icon: '🙋‍♂️' },
              { value: 'princess', label: 'Ajoutées par elle', icon: '👸' }
            ].map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-full font-medium transition-all shadow-md active:scale-95 ${
                  filter === f.value
                    ? 'bg-linear-to-r from-pink-500 to-purple-500 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-gray-600'
                }`}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>

          {/* Tri */}
          <div className="flex justify-center gap-2 mb-8 z-10 relative">
            <span className="text-gray-600 dark:text-gray-300 self-center">Trier par:</span>
            {[
              { value: 'recent', label: 'Récent' },
              { value: 'popular', label: 'Populaire' },
              { value: 'alphabetical', label: 'A-Z' }
            ].map(s => (
              <button
                key={s.value}
                onClick={() => setSortBy(s.value)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  sortBy === s.value
                    ? 'bg-pink-200 dark:bg-purple-900/50 text-pink-700 dark:text-pink-400 font-bold'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-gray-600'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Liste des chansons */}
          {filteredSongs.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 z-10 relative">
              <div className="text-5xl mb-4">🎵</div>
              <p>Aucune chanson trouvée</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 z-10 relative">
              <AnimatePresence>
                {filteredSongs.map((song, index) => {
                  const badge = getAddedByBadge(song.addedBy);
                  
                  return (
                    <motion.div
                      key={song.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border-2 border-pink-100 dark:border-gray-700 relative overflow-hidden"
                    >
                      {/* Badge plateforme */}
                      <div className="absolute top-3 right-3 text-2xl">
                        {getPlatformIcon(song.platform)}
                      </div>

                      {/* Contenu */}
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1 pr-8">
                          {song.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">{song.artist}</p>
                        {song.album && (
                          <p className="text-sm text-gray-400 dark:text-gray-500 italic">{song.album}</p>
                        )}
                      </div>

                      {/* Raison */}
                      {song.reason && (
                        <div className="mb-4 p-3 bg-pink-50 dark:bg-gray-700/50 rounded-lg border border-pink-100 dark:border-gray-600">
                          <p className="text-sm text-pink-700 dark:text-pink-400 italic">
                            💭 {song.reason}
                          </p>
                        </div>
                      )}

                      {/* Badge qui a ajouté */}
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${badge.color}`}>
                        {badge.text}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex gap-3">
                          <button
                            onClick={() => toggleFavorite(song.id, song.isFavorite)}
                            className={`text-2xl transition-transform active:scale-110 ${
                              song.isFavorite ? 'scale-110' : 'hover:scale-110 grayscale'
                            }`}
                            title={song.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                          >
                            ❤️
                          </button>
                          
                          {song.url ? (
                            <a
                              href={song.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => incrementPlayCount(song.id)}
                              className="text-2xl hover:scale-110 transition-transform active:scale-95"
                              title="Écouter"
                            >
                              ▶️
                            </a>
                          ) : (
                            <button
                              onClick={() => incrementPlayCount(song.id)}
                              className="text-2xl hover:scale-110 transition-transform active:scale-95"
                              title="Marquer comme écouté"
                            >
                              ▶️
                            </button>
                          )}
                        </div>

                        {/* Play count */}
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>🔊</span>
                          <span className="font-bold">{song.playCount || 0}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Statistiques */}
          {songs.length > 0 && (
            <div className="mt-12 text-center text-gray-500 dark:text-gray-400 z-10 relative">
              <p className="text-lg">
                🎵 <span className="font-bold text-gray-700 dark:text-gray-300">{songs.length}</span> chanson{songs.length > 1 ? 's' : ''} au total
                {' • '}
                ❤️ <span className="font-bold text-pink-600 dark:text-pink-400">{songs.filter(s => s.isFavorite).length}</span> favori{songs.filter(s => s.isFavorite).length > 1 ? 's' : ''}
                {' • '}
                🔊 <span className="font-bold text-purple-600 dark:text-purple-400">{songs.reduce((sum, s) => sum + (s.playCount || 0), 0)}</span> écoute{songs.reduce((sum, s) => sum + (s.playCount || 0), 0) > 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Playlist;
