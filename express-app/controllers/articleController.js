const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

const IMAGE_FOLDER = path.join(__dirname, '../img_articles');

if (!fs.existsSync(IMAGE_FOLDER)) {
  fs.mkdirSync(IMAGE_FOLDER);
}

exports.createArticle = async (req, res) => {
  const { name, description, price, stock, tags } = req.body;
  const parsedTags = tags ? JSON.parse(tags) : [];
  try {
    if (!req.files || !req.files.mainImage) {
      return res.status(400).json({ message: "L'image principale est requise." });
    }

    const mainImageFile = req.files.mainImage;

    const mainImageExtension = path.extname(mainImageFile.name);
    const sanitizedArticleName = name.replace(/\s+/g, '_').toLowerCase(); 
    const mainImageFileName = `${sanitizedArticleName}_main${mainImageExtension}`;
    const mainImagePath = path.join(IMAGE_FOLDER, mainImageFileName);

    await mainImageFile.mv(mainImagePath);

    const otherImages = req.files?.otherImages || [];
    const otherImagePaths = Array.isArray(otherImages)
      ? await Promise.all(
          otherImages.map(async (file, index) => {
            const fileExtension = path.extname(file.name);
            const otherImageFileName = `${sanitizedArticleName}_other_${index + 1}${fileExtension}`;
            const filePath = path.join(IMAGE_FOLDER, otherImageFileName);
            await file.mv(filePath);
            return { link: `/img_articles/${otherImageFileName}`, main_image: false };
          })
        )
      : [];

    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock, 10);

    const article = await prisma.article.create({
      data: {
        name,
        description,
        price: parsedPrice,
        stock: parsedStock,
        Image: {
          create: [
            { link: `/img_articles/${mainImageFileName}`, main_image: true },
            ...otherImagePaths,
          ],
        },
      },
    });

    if (parsedTags && Array.isArray(parsedTags) && parsedTags.length > 0) {
      const validTags = await prisma.tags.findMany({
        where: { id: { in: parsedTags } },
      });

      if (validTags.length !== parsedTags.length) {
        return res.status(400).json({
          message: "Certains tags fournis n'existent pas.",
        });
      }

      const tagRelations = validTags.map((tag) => ({
        articleId: article.id,
        tagId: tag.id,
      }));

      await prisma.articleTags.createMany({ data: tagRelations });
    }

    res.status(201).json({ message: "Article créé avec succès", article });
  } catch (err) {
    console.error("Erreur lors de la création de l'article :", err);
    res.status(500).json({
      message: "Erreur lors de la création de l'article",
      error: err.message,
    });
  }
};

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
    const { category, priceMin, priceMax, name } = req.body;

    const filters = {
      ...(category && category.length > 0 && {
        tags: {
          some: {
            tagId: { in: category },
          },
        },
      }),
      ...(priceMin && priceMax && {
        price: {
          gte: parseFloat(priceMin),
          lte: parseFloat(priceMax),
        },
      }),
      ...(name && {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      }),
    };
    

    const articles = await prisma.article.findMany({
      where: filters,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        Image: { where: { main_image: true }, select: { link: true } },
      },
    });

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
      };
    });
    

    res.status(200).json(articlesWithImages);
  } catch (error) {
    console.error('Erreur lors de la récupération des articles :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des articles', error: error.message });
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
      images: article.Image.map((image) => {
        const imagePath = path.join(__dirname, '..', image.link);
        return fs.existsSync(imagePath)
          ? {
              id: image.id,
              base64: fs.readFileSync(imagePath, { encoding: 'base64' }),
            }
          : null;
      }).filter((img) => img !== null),
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

exports.updateArticle = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, tags } = req.body;

  try {
    console.log("Requête reçue pour mise à jour :", req.body); // Vérifiez les données envoyées

    const existingArticle = await prisma.article.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!existingArticle) {
      console.log("Article non trouvé :", id);
      return res.status(404).json({ message: "Article introuvable." });
    }

    const updates = {
      ...(name && { name }),
      ...(description && { description }),
      ...(price && { price: parseFloat(price) }),
      ...(stock && { stock: parseInt(stock, 10) }),
    };

    const updatedArticle = await prisma.article.update({
      where: { id: parseInt(id, 10) },
      data: updates,
    });

    console.log("Article mis à jour :", updatedArticle);

    if (tags) {
      const parsedTags = JSON.parse(tags);

      await prisma.articleTags.deleteMany({
        where: { articleId: parseInt(id, 10) },
      });

      const tagRelations = parsedTags.map((tagId) => ({
        articleId: parseInt(id, 10),
        tagId: parseInt(tagId, 10),
      }));

      await prisma.articleTags.createMany({ data: tagRelations });
    }

    res.status(200).json({ message: "Article mis à jour avec succès", updatedArticle });
  } catch (err) {
    console.error("Erreur lors de la mise à jour de l'article :", err);
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'article", error: err.message });
  }
};
