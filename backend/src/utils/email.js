import { Resend } from 'resend';
import logger from './logger.js';

let resend;
const getResend = () => {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
};

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@princess.app';

/**
 * Envoyer un email de réinitialisation de mot de passe
 * @param {string} to - Email du destinataire
 * @param {string} displayName - Prénom/pseudo de l'utilisateur
 * @param {string} resetUrl - URL de réinitialisation avec le token
 */
export const sendPasswordResetEmail = async (to, displayName, resetUrl) => {
  const { error } = await getResend().emails.send({
    from: `Princess Project <${FROM_EMAIL}>`,
    to,
    subject: '🔑 Réinitialisation de ton mot de passe — Princess Project',
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 520px; margin: 0 auto; background: linear-gradient(135deg, #fdf2f8, #fce7f3); border-radius: 16px; padding: 40px; border: 2px solid #f9a8d4;">
        <h1 style="color: #be185d; text-align: center; font-size: 24px; margin-bottom: 8px;">
          Princess Project 💖
        </h1>
        <p style="color: #6b7280; text-align: center; font-size: 14px; margin-bottom: 32px;">
          Réinitialisation de mot de passe
        </p>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Salut <strong>${displayName}</strong> 👋,
        </p>
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Tu as demandé à réinitialiser ton mot de passe. Clique sur le bouton ci-dessous pour en choisir un nouveau :
        </p>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #ec4899, #be185d); color: white; font-weight: bold; font-size: 16px; padding: 14px 40px; border-radius: 50px; text-decoration: none; box-shadow: 0 4px 14px rgba(236, 72, 153, 0.4);">
            Réinitialiser mon mot de passe 🔑
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 13px; line-height: 1.5;">
          Ce lien expire dans <strong>1 heure</strong>. Si tu n'as pas demandé cette réinitialisation, ignore simplement cet email.
        </p>
        
        <hr style="border: none; border-top: 1px solid #f9a8d4; margin: 24px 0;" />
        
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          Développé avec ❤️ par ton chéri
        </p>
      </div>
    `,
  });

  if (error) {
    logger.error('Erreur envoi email reset', { to, error: error.message, details: JSON.stringify(error) });
    throw new Error(`Impossible d'envoyer l'email : ${error.message}`);
  }

  logger.info('Email de reset envoyé', { to });
};
