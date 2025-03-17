// routes/api.js
const express = require('express');
const fs = require('fs').promises; // Promesses pour performance
const nodemailer = require('nodemailer');
const router = express.Router();

// GET /services : Fournit la liste des services
router.get('/services', async (req, res) => {
  try {
    const data = await fs.readFile('./services.json', 'utf8');
    const services = JSON.parse(data).services;
    res.json(services);
  } catch (error) {
    console.error('Erreur /services:', error);
    res.status(500).json({ error: 'Erreur lors du chargement des services' });
  }
});

// POST /send-email : Envoie un e-mail avec la sélection
router.post('/send-email', async (req, res) => {
  const { selectedModules, personalInfo } = req.body;

  // Validation des entrées
  if (!selectedModules || !personalInfo?.email || !personalInfo?.name) {
    return res.status(400).json({ error: 'Données manquantes : selectedModules, email et name requis' });
  }
  if (!/^\S+@\S+\.\S+$/.test(personalInfo.email)) {
    return res.status(400).json({ error: 'E-mail invalide' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: personalInfo.email,
      subject: 'Votre sélection de services - Hello Service',
      html: `
        <h1>Merci, ${personalInfo.name} !</h1>
        <p>Voici votre sélection :</p>
        <ul>${Object.keys(selectedModules).map(service => `
          <li><strong>${service}</strong>: ${selectedModules[service].join(', ')}</li>
        `).join('')}</ul>
        <p>Contact : ${personalInfo.email}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'E-mail envoyé avec succès' });
  } catch (error) {
    console.error('Erreur /send-email:', error);
    res.status(500).json({ error: 'Erreur lors de l’envoi de l’e-mail' });
  }
});

module.exports = router;