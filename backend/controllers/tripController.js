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
  const { tripId, activities, budgets, accommodationEntries, accommodationCost, totalCost, startDate, endDate, tripName } = req.body;

  const query = `
    UPDATE trips 
    SET activities = ?, budgets = ?, accommodation_entries = ?, accommodation_cost = ?, total_cost = ?, start_date = ?, end_date = ?, title = ?
    WHERE id = ?`;

  db.query(
    query,
    [JSON.stringify(activities), JSON.stringify(budgets), JSON.stringify(accommodationEntries), accommodationCost, totalCost, startDate, endDate, tripName, tripId],
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

  const getTripBudget = (req, res) => {
    const userId = req.query.id; 
    const tripId = req.query.tripId;
  
    const query = 'SELECT budgets, accommodation_cost, total_cost FROM trips WHERE id = ?';
    db.query(query, [tripId], (err, results) => {
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

  // Získání veřejného výletu (jen pro čtení)
const getPublicTrip = (req, res) => {
  const { tripId } = req.params;

  const query = 'SELECT * FROM trips WHERE id = ?';
  db.query(query, [tripId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const trip = results[0];
    const activities = JSON.parse(trip.activities || '[]');
    const budgets = trip.budgets ? JSON.parse(trip.budgets) : [];
    const accommodationEntries = trip.accommodation_entries ? JSON.parse(trip.accommodation_entries) : [];

    res.json({
      tripName: trip.title,
      startDate: trip.start_date,
      endDate: trip.end_date,
      activities,
      budgets,
      accommodationEntries,
      accommodationCost: trip.accommodation_cost || 0,
      totalCost: trip.total_cost || 0,
    });
  });
};

const getUserTripStats = (req, res) => {
  const userId = req.query.id;

  const query = 'SELECT activities FROM trips WHERE user_id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.json({ message: 'No trips found', totalDistance: 0, totalTime: "0 h 0 min" });
    }

    let totalDistance = 0;
    let totalDurationMinutes = 0;
    let longestTrip = { distance: 0, duration: "0 h 0 min" };
    let shortestTrip = { distance: Infinity, duration: "0 h 0 min" };
    let tripCount = results.length;

    results.forEach((row) => {
      if (row.activities) {
        const activities = JSON.parse(row.activities);
        activities.forEach((activity) => {
          if (activity.routeInfo) {
            const distance = parseFloat(activity.routeInfo.distance) || 0;

            // Opravený parser pro duration
            let durationMinutes = 0;
            const durationMatch = activity.routeInfo.duration.match(/(\d+)\s*h\s*(\d*)\s*min?/);

            if (durationMatch) {
              const hours = parseInt(durationMatch[1]) || 0;
              const minutes = parseInt(durationMatch[2]) || 0;
              durationMinutes = hours * 60 + minutes;
            }

            totalDistance += distance;
            totalDurationMinutes += durationMinutes;

            if (distance > longestTrip.distance) {
              longestTrip = { distance, duration: activity.routeInfo.duration };
            }

            if (distance < shortestTrip.distance) {
              shortestTrip = { distance, duration: activity.routeInfo.duration };
            }
          }
        });
      }
    });

    if (shortestTrip.distance === Infinity) {
      shortestTrip = { distance: 0, duration: "0 h 0 min" };
    }

    const avgDistancePerTrip = tripCount > 0 ? (totalDistance / tripCount).toFixed(1) : 0;
    const totalDurationFormatted = `${Math.floor(totalDurationMinutes / 60)} h ${totalDurationMinutes % 60} min`;

    res.json({
      totalDistance: totalDistance.toFixed(1) + " km",
      totalTime: totalDurationFormatted,
      longestTrip,
      shortestTrip,
      avgDistancePerTrip: avgDistancePerTrip + " km",
      tripCount
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
    getBudget,
    getTripBudget,
    getPublicTrip,
    getUserTripStats
  };
  
  