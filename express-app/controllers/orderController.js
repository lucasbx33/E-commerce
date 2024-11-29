const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const PDFDocument = require('pdfkit');

const SECRET_KEY = process.env.SECRET_KEY;

// Créer une commande
exports.createOrder = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Décodage du token pour récupérer l'utilisateur
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await prisma.users.findUnique({
      where: { email: decoded.email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const { orderLines } = req.body; // Attendre un tableau de lignes de commande

    if (!orderLines || !Array.isArray(orderLines) || orderLines.length === 0) {
      return res.status(400).json({ message: 'Order lines are required.' });
    }

    // Calcul du prix total de la commande
    let totalPrice = 0;

    const validatedOrderLines = await Promise.all(
      orderLines.map(async (line) => {
        const article = await prisma.article.findUnique({
          where: { id: line.articleId },
        });

        if (!article || article.stock < line.quantity) {
          throw new Error(`Article ${line.articleId} is unavailable or out of stock.`);
        }

        // Déduire la quantité en stock
        await prisma.article.update({
          where: { id: line.articleId },
          data: { stock: article.stock - line.quantity },
        });

        const lineTotal = line.quantity * parseFloat(article.price);
        totalPrice += lineTotal;

        return {
          articleId: line.articleId,
          quantity: line.quantity,
          unitPrice: article.price,
          lineTotal,
        };
      })
    );

    // Créer la commande
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalPrice,
        status: 'en cours',
        orderLines: {
          create: validatedOrderLines,
        },
      },
    });

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (err) {
    console.error('Error creating order:', err.message);
    res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
};

// Récupérer les commandes d'un utilisateur connecté
exports.getUserOrders = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Décodage du token pour récupérer l'utilisateur
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await prisma.users.findUnique({
      where: { email: decoded.email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Récupérer toutes les commandes de l'utilisateur
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        orderLines: {
          include: {
            article: true, // Inclut les informations sur les articles
          },
        },
      },
    });

    res.status(200).json({ orders });
  } catch (err) {
    console.error('Error retrieving orders:', err.message);
    res.status(500).json({ message: 'Failed to retrieve orders', error: err.message });
  }
};

exports.generateOrderPdf = async (req, res) => {
    const { orderId } = req.params;
  
    try {
      const order = await prisma.order.findUnique({
        where: { id: parseInt(orderId, 10) },
        include: {
          orderLines: {
            include: {
              article: true,
            },
          },
        },
      });
  
      if (!order) {
        return res.status(404).json({ message: 'Commande introuvable.' });
      }
  
      const doc = new PDFDocument({ margin: 30 });
  
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=commande-${orderId}.pdf`
      );
  
      doc.pipe(res);
  
      doc.fontSize(20).text(`Bon de commande #${order.id}`, { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Date : ${new Date(order.createdAt).toLocaleDateString()}`);
      doc.text(`Statut : ${order.status}`);
      doc.text(`Total : ${order.totalPrice} €`);
      doc.moveDown();
  
      doc.fontSize(14).text('Articles :', { underline: true });
      doc.moveDown();
      order.orderLines.forEach((line) => {
        doc.fontSize(12).text(
          `- ${line.article.name} (x${line.quantity}) - ${line.lineTotal} €`
        );
      });
  
      doc.end();
    } catch (err) {
      console.error('Erreur lors de la génération du PDF :', err.message);
      res.status(500).json({ message: 'Erreur lors de la génération du PDF' });
    }
  };