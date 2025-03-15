const db = require('./db');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const dotenv = require('dotenv');

dotenv.config();

// Nastavení SMTP pro odesílání e-mailů
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Nastav svůj e-mail v .env
    pass: process.env.EMAIL_PASS  // Heslo (nebo App Password)
  }
});

const sendEmail = (to, subject, htmlContent) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent // Používáme HTML místo textu
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Chyba při odesílání e-mailu:', error);
      } else {
        console.log('E-mail odeslán:', info.response);
      }
    });
  };

  const createVerificationEmail = (verificationLink) => {
    return `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            text-align: center;
            padding: 20px;
          }
          .container {
            max-width: 500px;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            margin: auto;
          }
          h2 {
            color: #007bff;
          }
          .btn {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Ověř svůj e-mail</h2>
          <p>Klikni na tlačítko níže pro ověření e-mailu:</p>
          <a href="${verificationLink}" target="_blank" class="btn">Ověřit e-mail</a>
        </div>
      </body>
      </html>
    `;
  };
  

  const createEmailTemplate = (userName, tripTitle, tripDate, tripLink) => {
    const formattedDateCZ = new Date(tripDate).toLocaleDateString('cs-CZ', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  
    const formattedDateEN = new Date(tripDate).toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  
    return `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            margin: auto;
            text-align: center;
          }
          h2 {
            color: #007bff;
          }
          p {
            font-size: 16px;
            line-height: 1.6;
          }
          .trip-title {
            font-size: 20px;
            font-weight: bold;
            color: #007bff;
            text-decoration: none;
          }
          .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #777;
            text-align: center;
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Ahoj ${userName || "cestovateli"}! 🗺️</h2>
          <p>Doufáme, že se těšíš na svůj nadcházející výlet! Připomínáme ti, že tvůj výlet 
            <br><a href="${tripLink}" class="trip-title">"${tripTitle}"</a> se uskuteční již zítra, tedy <strong>${formattedDateCZ}</strong>.
          </p>
  
          <div style="margin-top: 20px; border-top: 1px solid #ddd; padding-top: 20px;">
            <h2>Hello ${userName || "Traveler"}! 🗺️</h2>
            <p>We hope you're excited about your upcoming trip! Just a quick reminder that your trip 
              <br><a href="${tripLink}" class="trip-title">"${tripTitle}"</a> is happening tomorrow, on <strong>${formattedDateEN}</strong>.
            </p>
          </div>
  
          <div class="footer">
            <p>🚀 Šťastnou cestu! / Safe travels!<br>Tvůj tým plánování výletů / Your trip planning team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  
  


cron.schedule('30 8 * * *', async () => {
  console.log('Kontroluji nadcházející výlety...');
  
  try {
    const [rows] = await db.promise().query(`
      SELECT users.email, trips.title, trips.start_date, users.prezdivka AS userName, trips.id
      FROM trips AS trips
      JOIN users AS users ON trips.user_id = users.id
      WHERE DATE(trips.start_date) = CURDATE() + INTERVAL 1 DAY
    `);

    rows.forEach(trip => {
        const htmlMessage = createEmailTemplate(trip.userName, trip.title, trip.start_date, `${process.env.APP_URL}/trip/${trip.id}`);
        sendEmail(trip.email, 'Připomínka výletu', htmlMessage);
      });
      
      

    console.log('Notifikace odeslány:', rows.length);
  } catch (err) {
    console.error('Chyba při kontrolování výletů:', err);
  }
});


module.exports = { sendEmail, createVerificationEmail }; // Přidání exportu