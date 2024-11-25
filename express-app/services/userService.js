const db = require('../database');

// Exemple pour une base de données SQL (comme MySQL)
async function getUserByUsername(username) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
      if (err) {
        return reject(err);
      }
      if (results.length === 0) {
        return resolve(null);  // Aucun utilisateur trouvé
      }
      resolve(results[0]);  // Renvoie l'utilisateur trouvé
    });
  });
}

module.exports = { getUserByUsername };
