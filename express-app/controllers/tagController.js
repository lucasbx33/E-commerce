const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Créer un nouveau tag
exports.createTag = async (req, res) => {
  const { name } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: "Le nom du tag est requis." });
    }

    // Vérifier si le tag existe déjà
    const existingTag = await prisma.tags.findUnique({
      where: { name },
    });

    if (existingTag) {
      return res.status(400).json({ message: "Ce tag existe déjà." });
    }

    // Création du tag
    const tag = await prisma.tags.create({
      data: { name },
    });

    res.status(201).json({ message: "Tag créé avec succès", tag });
  } catch (err) {
    console.error("Erreur lors de la création du tag :", err);
    res.status(500).json({ message: "Erreur lors de la création du tag", error: err.message });
  }
};

exports.deleteTag = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Vérifier si le tag existe
      const tag = await prisma.tags.findUnique({ where: { id: parseInt(id, 10) } });
      if (!tag) {
        return res.status(404).json({ message: "Tag introuvable." });
      }
  
      // Supprimer le tag
      await prisma.tags.delete({ where: { id: parseInt(id, 10) } });
  
      res.status(200).json({ message: "Tag supprimé avec succès." });
    } catch (err) {
      console.error("Erreur lors de la suppression du tag :", err);
      res.status(500).json({ message: "Erreur lors de la suppression du tag", error: err.message });
    }
  };
  
  // Récupérer tous les tags
  exports.getAllTags = async (req, res) => {
    try {
      const tags = await prisma.tags.findMany();
  
      res.status(200).json(tags);
    } catch (err) {
      console.error("Erreur lors de la récupération des tags :", err);
      res.status(500).json({ message: "Erreur lors de la récupération des tags", error: err.message });
    }
  };
  
  // Récupérer un tag par ID
  exports.getTagById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const tag = await prisma.tags.findUnique({ where: { id: parseInt(id, 10) } });
  
      if (!tag) {
        return res.status(404).json({ message: "Tag introuvable." });
      }
  
      res.status(200).json(tag);
    } catch (err) {
      console.error("Erreur lors de la récupération du tag :", err);
      res.status(500).json({ message: "Erreur lors de la récupération du tag", error: err.message });
    }
  };