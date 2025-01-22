const db = require('../db');

// Vytvoření výletu
const createTrip = (req, res) => {
  const { userId, title, startDate, endDate, activities } = req.body;

  const query = 'INSERT INTO trips (user_id, title, start_date, end_date, activities) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [userId, title, startDate, endDate, JSON.stringify(activities)], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Trip created successfully', tripId: result.insertId });
  });
};

// Aktualizace aktivit ve výletu
const updateActivities = (req, res) => {
  const { tripId, activities, budgets, accommodationCost, totalCost } = req.body;

  const query = `
    UPDATE trips 
    SET activities = ?, budgets = ?, accommodation_cost = ?, total_cost = ?
    WHERE id = ?`;

  db.query(
    query,
    [JSON.stringify(activities), JSON.stringify(budgets), accommodationCost, totalCost, tripId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Trip updated successfully' });
    }
  );
};

// Získání aktivit pro výlet
const getActivities = (req, res) => {
  const tripId = req.query.tripId;

  if (!tripId) {
    return res.status(400).json({ message: 'Trip ID is missing' });
  }

  const query = 'SELECT activities FROM trips WHERE id = ?';
  db.query(query, [tripId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0 || !results[0].activities) {
      return res.json({ activities: null });
    }

    const activities = JSON.parse(results[0].activities);
    res.json({ activities });
  });
};

// Přehled výletu
const overviewTrip = (req, res) => {
  const tripId = req.query.tripId;

  if (!tripId) {
    return res.status(400).json({ message: 'Trip ID is missing' });
  }

  const query = 'SELECT * FROM trips WHERE id = ?';
  db.query(query, [tripId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const trip = results[0];
    const activities = JSON.parse(trip.activities || '[]');
    
    const summarizedPlan = activities.map((activity) => activity.plan).filter(Boolean).join(', ');

    res.json({
      tripName: trip.title,
      startDate: trip.start_date,
      endDate: trip.end_date,
      activities,
      summarizedPlan,
    });
  });
};

// Získání všech výletů pro uživatele
const getTrips = (req, res) => {
  const userId = req.query.id;

  const query = 'SELECT * FROM trips WHERE user_id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Smazání výletu
const deleteTrip = (req, res) => {
  const tripId = req.query.id;

  const query = 'DELETE FROM trips WHERE id = ?';
  db.query(query, [tripId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Trip deleted successfully' });
  });
};

const getBudget = (req, res) => {
    const userId = req.query.id; // Bere uživatele z tokenu
  
    const query = 'SELECT budgets, accommodation_cost, total_cost FROM trips WHERE user_id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'No data found' });
      }
  
      let totalTransport = 0;
      let totalFood = 0;
      let totalActivities = 0;
      let totalOther = 0;
      let totalAccommodation = 0;
      let totalOverallCost = 0;
  
      results.forEach((row) => {
        const budgets = row.budgets ? JSON.parse(row.budgets) : [];
  
        budgets.forEach((day) => {
          if (day.expenses && Array.isArray(day.expenses)) {
            day.expenses.forEach((expense) => {
              switch (expense.category) {
                case 'transport':
                  totalTransport += expense.amount || 0;
                  break;
                case 'food':
                  totalFood += expense.amount || 0;
                  break;
                case 'activities':
                  totalActivities += expense.amount || 0;
                  break;
                case 'other':
                  totalOther += expense.amount || 0;
                  break;
                default:
                  break;
              }
            });
          }
        });
  
        totalAccommodation += parseFloat(row.accommodation_cost || 0);
        totalOverallCost += parseFloat(row.total_cost || 0);
      });
  
      res.json({
        totalTransport,
        totalFood,
        totalActivities,
        totalOther,
        totalAccommodation,
        totalOverallCost,
      });
    });
  };
  
  
  module.exports = {
    createTrip,
    updateActivities,
    getActivities,
    overviewTrip,
    getTrips,
    deleteTrip,
    getBudget, // Musí být zde!
  };
  
  