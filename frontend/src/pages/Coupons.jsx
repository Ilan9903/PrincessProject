import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import FloatingHearts from '../components/FloatingHearts';
import PageTransition from '../components/PageTransition';
import { authenticatedFetch } from '../Utils/api';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flippedId, setFlippedId] = useState(null);

  // Charger les coupons depuis l'API
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await authenticatedFetch('/api/coupons');
        const data = await response.json();
        setCoupons(data || []);
      } catch (error) {
        console.error('Erreur chargement coupons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  // Utiliser un coupon
  const handleRedeem = async (couponId) => {
    try {
      const response = await authenticatedFetch(`/api/coupons/${couponId}/redeem`, {
        method: 'PATCH'
      });
      
      if (response.ok) {
        const data = await response.json();
        // Mettre à jour le coupon localement
        setCoupons(coupons.map(c => 
          c.id === couponId ? { ...c, isRedeemed: true, redeemedAt: data.coupon.redeemedAt } : c
        ));
        setFlippedId(null); // Refermer la carte
      }
    } catch (error) {
      console.error('Erreur utilisation coupon:', error);
    }
  };

  // Couleurs par défaut si pas spécifiées
  const getColorClass = (index) => {
    const colors = [
      'bg-rose-100 dark:bg-rose-900/40', 
      'bg-blue-100 dark:bg-blue-900/40', 
      'bg-purple-100 dark:bg-purple-900/40', 
      'bg-yellow-100 dark:bg-yellow-900/40', 
      'bg-orange-100 dark:bg-orange-900/40', 
      'bg-pink-100 dark:bg-pink-900/40'
    ];
    return colors[index % colors.length];
  };

  // Icônes par défaut si pas spécifiées
  const getDefaultIcon = (index) => {
    const icons = ['💆‍♀️', '🍽️', '🍷', '⚖️', '🥐', '🫂'];
    return icons[index % icons.length];
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-pink-50 flex items-center justify-center font-['Playfair_Display']">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-bounce">🎁</div>
            <p className="text-gray-500 italic">Chargement de tes cadeaux...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-pink-50 dark:bg-gray-900 flex flex-col items-center p-6 font-['Playfair_Display'] relative transition-colors">
        <FloatingHearts />
        
        <Link to="/" className="absolute top-6 left-6 text-gray-400 hover:text-red-500 z-50 p-2 text-2xl active:scale-95 shadow-2xl border border-pink-100 dark:border-gray-700 rounded-full hover:shadow-lg bg-white dark:bg-gray-800 transition-colors">🏠</Link>

        <div className="z-10 text-center mt-12 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">Tes Bons Cadeaux</h1>
          <p className="text-gray-500 dark:text-gray-400 italic">Clique sur un ticket pour l'activer...</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl z-10 pb-12">
          {coupons.map((coupon, index) => {
            const isExpired = coupon.expirationDate && new Date(coupon.expirationDate) < new Date();
            const isUsed = coupon.isRedeemed;
            const isAvailable = !isExpired && !isUsed;
            
            return (
              <div 
                key={coupon.id} 
                className="perspective-1000 h-48 cursor-pointer"
                onClick={() => isAvailable && setFlippedId(flippedId === coupon.id ? null : coupon.id)}
              >
                <motion.div 
                  className="relative w-full h-full transition-all duration-500 preserve-3d"
                  animate={{ rotateY: flippedId === coupon.id ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  {/* Recto (Côté visible au début) */}
                  <div className={`absolute inset-0 backface-hidden rounded-3xl border-4 border-dashed border-white dark:border-gray-600 shadow-xl ${isUsed ? 'bg-gray-200 dark:bg-gray-700' : isExpired ? 'bg-gray-100 dark:bg-gray-600' : getColorClass(index)} flex flex-col items-center justify-center p-4 ${!isAvailable && 'opacity-60'}`}>
                    <span className="text-5xl mb-2">{coupon.icon || getDefaultIcon(index)}</span>
                    <h3 className="font-bold text-xl text-gray-700 dark:text-gray-200">{coupon.title}</h3>
                    <div className="mt-4 text-[10px] uppercase tracking-widest text-gray-400 font-sans font-bold">
                      Ticket n°{String(coupon.id).padStart(4, '0')}
                    </div>
                    {isUsed && (
                      <div className="mt-2 bg-gray-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                        ✓ Utilisé
                      </div>
                    )}
                    {isExpired && !isUsed && (
                      <div className="mt-2 bg-red-400 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                        Expiré
                      </div>
                    )}
                  </div>

                  {/* Verso (Le cadeau révélé) */}
                  <div 
                    className="absolute inset-0 backface-hidden rounded-3xl border-4 border-pink-300 dark:border-pink-700 shadow-2xl bg-white dark:bg-gray-800 flex flex-col items-center justify-center p-6 text-center rotate-y-180 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p className="text-gray-700 dark:text-gray-200 font-serif leading-relaxed italic text-sm mb-4">
                      "{coupon.description}"
                    </p>
                    {isAvailable ? (
                      <>
                        <div className="mb-3 bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-bold uppercase">
                          Disponible
                        </div>
                        <button
                          onClick={() => handleRedeem(coupon.id)}
                          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold uppercase transition-colors active:scale-95"
                        >
                          Utiliser maintenant
                        </button>
                      </>
                    ) : (
                      <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${isUsed ? 'bg-gray-600 text-white' : 'bg-red-400 text-white'}`}>
                        {isUsed ? '✓ Déjà utilisé' : 'Expiré'}
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CSS nécessaire pour l'effet 3D */}
      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}} />
    </PageTransition>
  );
};

export default Coupons;