const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

exports.register = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName, 
      },
    });

    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};


async function getUserByEmail(email) {
  return await prisma.users.findUnique({
    where: { email },
  });
}

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const tokenPayload = { 
      email: user.email,
      roles: user.roles 
    };

    const token = jwt.sign(tokenPayload, SECRET_KEY, { expiresIn: '1h' });
    const refreshToken = jwt.sign(tokenPayload, REFRESH_SECRET_KEY, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 60 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ 
      message: 'Login successful', 
      user: { email: user.email, roles: user.roles } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};

exports.validateToken = (req, res) => {
    const token = req.cookies.token;
  
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
  
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token or token expired.' });
      }
  
      res.json({ user });
    });
};

exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided.' });
  }

  jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const newToken = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.cookie('token', newToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 60 * 60 * 1000,
    });
    res.json({ message: 'Token refreshed' });
  });
};

exports.logout = (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true, 
      sameSite: 'Strict',
      path: '/',
    });
  
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      path: '/',
    });
  
    res.status(200).json({ message: 'Déconnexion réussie, cookies supprimés' });
};

exports.getUserInfo = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    const user = await prisma.users.findUnique({
      where: { email: decoded.email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const { password, ...userInfo } = user;
    res.json({ user: userInfo });
  } catch (err) {
    console.error('Error retrieving user info:', err);
    res.status(403).json({ message: 'Invalid token or token expired.' });
  }
};

exports.updateUserInfo = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const { firstName, lastName, email, phone } = req.body;

    const updatedUser = await prisma.users.update({
      where: { email: decoded.email },
      data: { firstName, lastName, email, phone },
    });

    res.status(200).json({ message: "Utilisateur mis à jour avec succès", user: updatedUser });
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};