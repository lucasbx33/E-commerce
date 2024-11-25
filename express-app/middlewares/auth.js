const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const authenticate = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé. Token manquant.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Ajoute les informations du token à la requête
    next(); // Passe à la route suivante
  } catch (err) {
    return res.status(403).json({ message: 'Token invalide ou expiré.' });
  }
};

module.exports = authenticate;
