const express = require('express');
const fs = require('fs').promises;
const nodemailer = require('nodemailer');
const sanitizeHtml = require('sanitize-html');
const { Pool } = require('pg');
const router = express.Router();

// Charger les variables d'environnement
require('dotenv').config();

// Cache pour services.json
let servicesCache = null;
let lastCacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Configuration de la connexion à PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'hello_service_db',
  password: process.env.DB_PASS || 'ton_mot_de_passe',
  port: process.env.DB_PORT || 5432,
});

// Vérifier la connexion à la base de données
pool.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à PostgreSQL:', err.message);
    process.exit(1);
  } else {
    console.log('Connecté à la base de données PostgreSQL');
  }
});

// Configuration de Nodemailer
const transporter = nodemailer.createTransport({
  host: 'mail.obivsolutions.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.PROVIDER_EMAIL || 'contact@obivsolutions.com',
    pass: process.env.EMAIL_PASS,
  },
  pool: true,
  debug: true,
  logger: true,
});

// Middleware pour logging
const logRequest = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
};

// Fonction pour charger les services avec cache
const loadServices = async () => {
  const now = Date.now();
  if (servicesCache && lastCacheTime && now - lastCacheTime < CACHE_DURATION) {
    return servicesCache;
  }

  try {
    const data = await fs.readFile('./services.json', 'utf8');
    servicesCache = JSON.parse(data).services;
    lastCacheTime = now;
    return servicesCache;
  } catch (error) {
    throw new Error('Erreur lors de la lecture de services.json : ' + error.message);
  }
};

// Fonction pour enregistrer les données dans PostgreSQL
const saveToDatabase = async (selectedModules, personalInfo) => {
  const { firstName, lastName, email, phone } = personalInfo;

  console.log('Données à enregistrer dans la base de données :', { firstName, lastName, email, phone, selectedModules });

  // Sanitisation des données
  const sanitizedFirstName = sanitizeHtml(firstName, {
    allowedTags: [],
    allowedAttributes: {},
  });
  const sanitizedLastName = sanitizeHtml(lastName, {
    allowedTags: [],
    allowedAttributes: {},
  });
  const sanitizedEmail = sanitizeHtml(email, {
    allowedTags: [],
    allowedAttributes: {},
    textFilter: function (text) {
      return text;
    },
  });
  const sanitizedPhone = sanitizeHtml(phone, {
    allowedTags: [],
    allowedAttributes: {},
  });
  const sanitizedModules = JSON.stringify(selectedModules);

  console.log('Données après sanitisation :', {
    sanitizedFirstName,
    sanitizedLastName,
    sanitizedEmail,
    sanitizedPhone,
    sanitizedModules,
  });

  const query = `
    INSERT INTO selections (first_name, last_name, email, phone, selected_modules)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
  `;
  const values = [
    sanitizedFirstName,
    sanitizedLastName,
    sanitizedEmail,
    sanitizedPhone,
    sanitizedModules,
  ];

  try {
    const result = await pool.query(query, values);
    console.log('Enregistrement réussi, ID :', result.rows[0].id);
    return { success: true, id: result.rows[0].id };
  } catch (error) {
    console.error('Erreur dans saveToDatabase :', error);
    throw new Error('Erreur lors de l’enregistrement dans la base de données : ' + error.message);
  }
};

// Fonction pour envoyer un email
const sendSelectionEmail = async (selectedModules, personalInfo) => {
  const sanitizedName = sanitizeHtml(personalInfo.firstName + ' ' + personalInfo.lastName, {
    allowedTags: [],
    allowedAttributes: {},
  });
  const sanitizedEmail = sanitizeHtml(personalInfo.email, {
    allowedTags: [],
    allowedAttributes: {},
    textFilter: function (text) {
      return text;
    },
  });
  const sanitizedPhone = sanitizeHtml(personalInfo.phone, {
    allowedTags: [],
    allowedAttributes: {},
  });

  // Validation de l'email du souscripteur
  if (!sanitizedEmail || sanitizedEmail.trim() === '') {
    throw new Error('L’email du souscripteur est vide ou non valide après sanitisation');
  }

  // Validation de l'email du fournisseur
  const providerEmail = process.env.PROVIDER_EMAIL || 'provider@obivsolutions.com';
  if (!providerEmail || providerEmail.trim() === '') {
    throw new Error('L’email du fournisseur (PROVIDER_EMAIL) n’est pas défini ou est vide');
  }

  // Log pour débogage
  console.log('Envoi d’email au souscripteur :', sanitizedEmail);
  console.log('Envoi d’email au fournisseur :', providerEmail);

  // Email 1: To the Subscriber (Souscripteur)
  const subscriberMailOptions = {
    from: process.env.PROVIDER_EMAIL || 'contact@obivsolutions.com',
    to: sanitizedEmail,
    subject: 'Confirmation de votre sélection de services – Hello Service',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333;">Bonjour ${sanitizedName},</h1>
        <p style="color: #555; line-height: 1.6;">
          Nous vous remercions chaleureusement pour la confiance que vous nous accordez en choisissant <strong>Hello Service</strong> pour vos besoins. Nous sommes ravis de vous accompagner dans la réalisation de votre projet !
        </p>
        <h2 style="color: #333;">Voici un récapitulatif de votre sélection :</h2>
        <ul style="list-style-type: none; padding: 0;">
          ${Object.keys(selectedModules)
            .map(
              (service) =>
                `<li style="margin-bottom: 10px;">
                  <strong style="color: #333;">${sanitizeHtml(service)}</strong> : ${selectedModules[service]
                    .map((mod) => sanitizeHtml(mod))
                    .join(', ')}
                </li>`
            )
            .join('')}
        </ul>
        <p style="color: #555; line-height: 1.6;">
          Nous mettons tout en œuvre pour vous offrir une prestation de qualité, adaptée à vos attentes. Un de nos experts prendra prochainement contact avec vous pour discuter des prochaines étapes et s’assurer que tout est parfaitement aligné avec vos besoins.
        </p>
        <h3 style="color: #333;">Pour toute question ou précision, n’hésitez pas à nous contacter :</h3>
        <p style="color: #555;">
          📧 <strong>Email</strong> : <a href="mailto:${process.env.PROVIDER_EMAIL}" style="color: #007BFF; text-decoration: none;">${process.env.PROVIDER_EMAIL || 'contact@obivsolutions.com'}</a><br>
          📞 <strong>Téléphone</strong> : +237 670613049 | +237 699675830
        </p>
        <p style="color: #555; line-height: 1.6;">
          Nous avons hâte de collaborer avec vous et de vous offrir une expérience exceptionnelle.
        </p>
        <p style="color: #555; margin-top: 30px;">
          Cordialement,<br>
          <strong>Ulrich Labussière MOH</strong><br>
          Responsable des projets techniques<br>
          <strong>Obivsolutions services</strong><br>
          <a href="obivsolutions.com" style="color: #007BFF; text-decoration: none;">obivsolutions</a>
        </p>
      </div>
    `,
  };

  // Email 2: To the Provider (Fournisseur)
  const providerMailOptions = {
    from: process.env.PROVIDER_EMAIL,
    to: process.env.PROVIDER_EMAIL,
    subject: 'Nouvelle demande de service',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333;">Nouvelle demande de service</h1>
        <p style="color: #555; line-height: 1.6;">
          Bonjour,
        </p>
        <p style="color: #555; line-height: 1.6;">
          Une nouvelle demande de service a été soumise via <strong>Hello Service</strong>. Voici les détails :
        </p>
        <h2 style="color: #333;">Informations du client :</h2>
        <p style="color: #555;">
          <strong>Nom</strong> : ${sanitizedName}<br>
          <strong>Email</strong> : <a href="mailto:${sanitizedEmail}" style="color: #007BFF; text-decoration: none;">${sanitizedEmail}</a><br>
          <strong>Téléphone</strong> : ${sanitizedPhone}
        </p>
        <h2 style="color: #333;">Services sélectionnés :</h2>
        <ul style="list-style-type: none; padding: 0;">
          ${Object.keys(selectedModules)
            .map(
              (service) =>
                `<li style="margin-bottom: 10px;">
                  <strong style="color: #333;">${sanitizeHtml(service)}</strong> : ${selectedModules[service]
                    .map((mod) => sanitizeHtml(mod))
                    .join(', ')}
                </li>`
            )
            .join('')}
        </ul>
        <p style="color: #555; line-height: 1.6;">
          Veuillez contacter le client dès que possible pour discuter des prochaines étapes et confirmer les détails de la prestation.
        </p>
        <p style="color: #555; margin-top: 30px;">
          Cordialement,<br>
          <strong>Le support technique</strong><br>
          <a href="obivsolutions.com" style="color: #007BFF; text-decoration: none;">obivsolutions</a> | ${process.env.EMAIL_RSN}
        </p>
      </div>
    `,
  };

  try {
    const [subscriberResult, providerResult] = await Promise.allSettled([
      transporter.sendMail(subscriberMailOptions),
      transporter.sendMail(providerMailOptions),
    ]);

    if (subscriberResult.status === 'rejected') {
      console.error('Échec de l’envoi au souscripteur :', subscriberResult.reason);
    }
    if (providerResult.status === 'rejected') {
      console.error('Échec de l’envoi au fournisseur :', providerResult.reason);
    }

    if (subscriberResult.status === 'rejected' && providerResult.status === 'rejected') {
      throw new Error('Échec de l’envoi des deux emails');
    }

    return {
      success: true,
      message:
        subscriberResult.status === 'fulfilled' && providerResult.status === 'fulfilled'
          ? 'Emails envoyés avec succès au souscripteur et au fournisseur'
          : 'Envoi partiel : ' +
            (subscriberResult.status === 'fulfilled' ? 'Souscripteur OK' : 'Souscripteur échoué') +
            ', ' +
            (providerResult.status === 'fulfilled' ? 'Fournisseur OK' : 'Fournisseur échoué'),
    };
  } catch (error) {
    console.error('Erreur dans sendSelectionEmail :', error);
    throw new Error('Erreur lors de l’envoi des e-mails : ' + error.message);
  }
};

// GET /services : Fournit la liste des services
router.get('/services', logRequest, async (req, res) => {
  try {
    const services = await loadServices();
    res.status(200).json(services);
  } catch (error) {
    console.error('Erreur /services:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST /send-email : Enregistre dans la base de données et envoie un e-mail
router.post('/send-email', logRequest, async (req, res) => {
  console.log('Requête reçue sur /send-email');
  const { selectedModules, personalInfo } = req.body;

  // Log des données d'entrée pour débogage
  console.log('Données reçues dans /send-email :', { selectedModules, personalInfo });
  console.log('PROVIDER_EMAIL :', process.env.PROVIDER_EMAIL);
  console.log('PROVIDER_EMAIL :', process.env.PROVIDER_EMAIL);

  // Validation des entrées
  if (!selectedModules || typeof selectedModules !== 'object') {
    return res.status(400).json({ error: 'selectedModules est requis et doit être un objet' });
  }

  if (!personalInfo || typeof personalInfo !== 'object') {
    return res.status(400).json({ error: 'personalInfo est requis et doit être un objet' });
  }

  const { firstName, lastName, email, phone } = personalInfo;
  if (!firstName || typeof firstName !== 'string' || firstName.trim() === '') {
    return res.status(400).json({ error: 'Prénom (firstName) requis et doit être une chaîne non vide' });
  }
  if (!lastName || typeof lastName !== 'string' || lastName.trim() === '') {
    return res.status(400).json({ error: 'Nom (lastName) requis et doit être une chaîne non vide' });
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'E-mail valide requis' });
  }

  const hasValidModules = Object.keys(selectedModules).some(
    (service) => Array.isArray(selectedModules[service]) && selectedModules[service].length > 0
  );
  if (!hasValidModules) {
    return res.status(400).json({ error: 'Aucun module valide sélectionné' });
  }

  try {
    // Étape 1 : Enregistrer dans la base de données
    const dbResult = await saveToDatabase(selectedModules, personalInfo);
    if (!dbResult.success) {
      throw new Error('Échec de l’enregistrement dans la base de données');
    }

    // Étape 2 : Envoyer l’e-mail
    const emailResult = await sendSelectionEmail(selectedModules, personalInfo);
    res.status(200).json({ message: `Données enregistrées (ID: ${dbResult.id}) et ${emailResult.message}` });
  } catch (error) {
    console.error('Erreur /send-email:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;