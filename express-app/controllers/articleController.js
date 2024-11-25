const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

const IMAGE_FOLDER = path.join(__dirname, '../img_articles');

// Assurez-vous que le dossier d'images existe
if (!fs.existsSync(IMAGE_FOLDER)) {
  fs.mkdirSync(IMAGE_FOLDER);
}

// Créer un article avec une image principale et des images supplémentaires
exports.createArticle = async (req, res) => {
  const { name, description, price, stock, tags } = req.body;
  const parsedTags = tags ? JSON.parse(tags) : [];
  try {
    // Vérifie si un fichier a été envoyé pour l'image principale
    if (!req.files || !req.files.mainImage) {
      return res.status(400).json({ message: "L'image principale est requise." });
    }

    const mainImageFile = req.files.mainImage;
    const mainImagePath = path.join(IMAGE_FOLDER, mainImageFile.name);

    // Sauvegarde l'image principale sur le disque
    await mainImageFile.mv(mainImagePath);

    // Ajout d'autres images si présentes
    const otherImages = req.files?.otherImages || [];
    const otherImagePaths = Array.isArray(otherImages)
      ? otherImages.map((file) => {
          const filePath = path.join(IMAGE_FOLDER, file.name);
          file.mv(filePath);
          return { link: `/img_articles/${file.name}`, main_image: false };
        })
      : [];

    // Conversion des valeurs numériques
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock, 10);

    // Création de l'article
    const article = await prisma.article.create({
      data: {
        name,
        description,
        price: parsedPrice,
        stock: parsedStock,
        Image: {
          create: [
            { link: `/img_articles/${mainImageFile.name}`, main_image: true },
            ...otherImagePaths,
          ],
        },
      },
    });
    console.log("test", tags)
    // Ajouter les tags si présents
    if (parsedTags && Array.isArray(parsedTags) && parsedTags.length > 0) {
      const validTags = await prisma.tags.findMany({
        where: { id: { in: parsedTags } },
      });
    
      if (validTags.length !== parsedTags.length) {
        return res.status(400).json({
          message: 'Certains tags fournis n\'existent pas.',
        });
      }
    
      const tagRelations = validTags.map(tag => ({
        articleId: article.id,
        tagId: tag.id,
      }));
    
      await prisma.articleTags.createMany({ data: tagRelations });
    }

    res.status(201).json({ message: "Article créé avec succès", article });
  } catch (err) {
    console.error("Erreur lors de la création de l'article :", err);
    res.status(500).json({ message: "Erreur lors de la création de l'article", error: err.message });
  }
};

// Récupérer tous les articles avec leurs images principales et tags
exports.getArticles = async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      include: {
        Image: {
          where: { main_image: true },
          select: { link: true },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    res.status(200).json(articles);
  } catch (err) {
    console.error("Erreur lors de la récupération des articles :", err);
    res.status(500).json({ message: "Erreur lors de la récupération des articles", error: err.message });
  }
};

// Récupérer un article par ID avec toutes ses images et tags
exports.getArticleById = async (req, res) => {
  const { id } = req.params;

  try {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        Image: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!article) {
      return res.status(404).json({ message: "Article introuvable" });
    }

    res.status(200).json(article);
  } catch (err) {
    console.error("Erreur lors de la récupération de l'article :", err);
    res.status(500).json({ message: "Erreur lors de la récupération de l'article", error: err.message });
  }
};

exports.getMinimalArticles = async (req, res) => {
  try {
    const { category, priceMin, priceMax, name } = req.method === 'POST' ? req.body : req.query;
    console.log("test" , category)
    // Construire les filtres
    const filters = {
      ...(category && {
        tags: {
          some: {
            tag: {
              name: category, // Utiliser le nom du tag pour filtrer
            },
          }
        },
      }),
      ...(priceMin !== null && priceMax !== null && {
        price: {
          gte: parseFloat(priceMin),
          lte: parseFloat(priceMax),
        },
      }),
    };
    

    console.log('Filters:', filters);

    // Requête pour récupérer les articles avec les tags
    const articles = await prisma.article.findMany({
      where: filters,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        Image: {
          select: {
            link: true,
          },
          where: { main_image: true },
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Ajouter les images en Base64 et reformater les tags
    const articlesWithImages = articles.map((article) => {
      const imagePath = article.Image?.[0]?.link
        ? path.join(__dirname, '..', article.Image[0].link)
        : null;

      let imageBase64 = null;
      if (imagePath && fs.existsSync(imagePath)) {
        imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });
      }

      return {
        id: article.id,
        name: article.name,
        description: article.description,
        price: article.price,
        image: imageBase64,
        tags: article.tags.map(tagRelation => tagRelation.tag.name),
      };
    });

    res.status(200).json(articlesWithImages);
  } catch (err) {
    console.error('Erreur lors de la récupération des articles :', err);
    res.status(500).json({ message: 'Erreur lors de la récupération des articles', error: err.message });
  }
};

exports.getArticleDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        Image: true, // Inclut toutes les images
        tags: true, // Inclut les tags associés (si nécessaire)
      },
    });

    if (!article) {
      return res.status(404).json({ message: "Article introuvable" });
    }

    const articleWithImages = {
      id: article.id,
      name: article.name,
      description: article.description,
      price: article.price,
      stock: article.stock,
      images: article.Image.map((image) => ({
        id: image.id,
        base64: fs.readFileSync(path.join(__dirname, '..', image.link), { encoding: 'base64' }),
      })),
    };

    res.status(200).json(articleWithImages);
  } catch (err) {
    console.error('Erreur lors de la récupération des détails de l\'article :', err);
    res.status(500).json({ message: 'Erreur lors de la récupération des détails de l\'article', error: err.message });
  }
};


// Ajouter des images à un article existant
exports.addImagesToArticle = async (req, res) => {
  const { id } = req.params;

  try {
    // Vérifie si des fichiers ont été envoyés
    if (!req.files || !req.files.images) {
      return res.status(400).json({ message: "Aucune image envoyée." });
    }

    const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
    const imagePaths = images.map((file) => {
      const filePath = path.join(IMAGE_FOLDER, file.name);
      file.mv(filePath);
      return { link: `/img_articles/${file.name}`, main_image: false };
    });

    const updatedImages = await prisma.image.createMany({
      data: imagePaths.map((img) => ({ ...img, articleId: parseInt(id, 10) })),
    });

    res.status(200).json({ message: "Images ajoutées avec succès", updatedImages });
  } catch (err) {
    console.error("Erreur lors de l'ajout des images :", err);
    res.status(500).json({ message: "Erreur lors de l'ajout des images", error: err.message });
  }
};

// Supprimer un article et ses images associées
exports.deleteArticle = async (req, res) => {
  const { id } = req.params;

  try {
    const images = await prisma.image.findMany({ where: { articleId: parseInt(id, 10) } });

    images.forEach((image) => {
      const imagePath = path.join(__dirname, `../${image.link}`);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });

    await prisma.article.delete({ where: { id: parseInt(id, 10) } });

    res.status(200).json({ message: "Article et ses images supprimés avec succès" });
  } catch (err) {
    console.error("Erreur lors de la suppression de l'article :", err);
    res.status(500).json({ message: "Erreur lors de la suppression de l'article", error: err.message });
  }
};
