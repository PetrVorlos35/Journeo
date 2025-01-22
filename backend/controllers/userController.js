const db = require('../db');

// Získání informací o uživateli
const getAccount = (req, res) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [req.user.email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = results[0];
    res.json({
      id: user.id,
      email: user.email,
      jmeno: user.jmeno,
      prijmeni: user.prijmeni,
      prezdivka: user.prezdivka,
      profilovka: user.profilovka,
      created_at: user.created_at
    });
  });
};

// Aktualizace uživatelských údajů
const updateAccount = (req, res) => {
  const { jmeno, prijmeni, prezdivka, profilovka } = req.body;

  const query = 'UPDATE users SET jmeno = ?, prijmeni = ?, prezdivka = ?, profilovka = ? WHERE email = ?';
  db.query(query, [jmeno, prijmeni, prezdivka, profilovka, req.user.email], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User updated successfully' });
  });
};

// Uložení typu grafu uživatele
const saveChartType = (req, res) => {
  const { userId, chartType } = req.body;

  const query = 'UPDATE users SET graf = ? WHERE id = ?';
  db.query(query, [chartType, userId], (err) => {
    if (err) {
      console.error('Error updating chart type:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json({ message: 'Chart type saved successfully' });
  });
};

// Získání typu grafu uživatele
const getChartType = (req, res) => {
  const userId = req.query.userId;

  const query = 'SELECT graf FROM users WHERE id = ?';
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error fetching chart type:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ chartType: result[0].graf });
  });
};

module.exports = { getAccount, updateAccount, saveChartType, getChartType };
