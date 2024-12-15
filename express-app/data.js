const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const seedDatabase = async () => {
  try {
    console.log("Début de l'import des données...");

    // 1. Création des utilisateurs
    const adminUser = await prisma.users.create({
      data: {
        firstName: "Admin",
        lastName: "User",
        email: "admin@admin.com",
        password: "$2a$10$xre/iLXOQ1dCGSsde31zkOYDdnwBq2nZ/HaloWDXI9jXQAZt2sPLW", 
        roles: JSON.stringify(["ROLE_ADMIN"]),
        phone: "0123456789",
      },
    });

    const regularUser = await prisma.users.create({
      data: {
        firstName: "John",
        lastName: "Doe",
        email: "user@example.com",
        password: "$2a$10$bYrSmbNbLkagZDpBCq.jgeO1QXKzoLHkOUe7WgZqY3ZgXMfyim9.u", 
        roles: JSON.stringify([]),
        phone: "0987654321",
      },
    });

    console.log("Utilisateurs créés :", { adminUser, regularUser });

    // 2. Création des tags
    const tags = await prisma.tags.createMany({
      data: [
        { name: "Rosé" },
        { name: "Vin Rouge" },
        { name: "Vin Blanc" },
      ],
    });

    console.log("Tags créés :", tags);

    // Récupération des IDs des tags
    const allTags = await prisma.tags.findMany();
    const tagRosé = allTags.find((tag) => tag.name === "Rosé").id;
    const tagVinRouge = allTags.find((tag) => tag.name === "Vin Rouge").id;
    const tagVinBlanc = allTags.find((tag) => tag.name === "Vin Blanc").id;

    // 3. Création des articles et des images associées
    const createArticlesWithImages = async (category, tagId) => {
      for (let i = 1; i <= 5; i++) {
        const article = await prisma.article.create({
          data: {
            name: `${category} Article ${i}`,
            description: `Description pour ${category} article ${i}`,
            price: (1 + Math.random() * 99).toFixed(2),
            stock: Math.floor(Math.random() * 50) + 1,
            tags: {
              create: [{ tagId }],
            },
            Image: {
              create: [
                {
                  link: `/img_articles/${category.toLowerCase()}_article_${i}_main.jpg`,
                  main_image: true,
                },
                {
                  link: `/img_articles/${category.toLowerCase()}_article_${i}_secondary.jpg`,
                  main_image: false,
                },
              ],
            },
          },
        });
        console.log(`Article créé avec images : ${article.name}`);
      }
    };

    await createArticlesWithImages("Rosé", tagRosé);
    await createArticlesWithImages("Vin Rouge", tagVinRouge);
    await createArticlesWithImages("Vin Blanc", tagVinBlanc);

    console.log("Import des données terminé avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'import des données :", error);
  } finally {
    await prisma.$disconnect();
  }
};

seedDatabase();
