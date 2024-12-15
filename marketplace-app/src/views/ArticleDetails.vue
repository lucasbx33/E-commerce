<template>
  <div class="container mx-auto p-6">
    <!-- Back link -->
    <div class="flex items-center mb-6">
      <router-link to="/" class="text-gray-700 underline pl-4">
        ← Retour à la liste
      </router-link>
    </div>

    <div v-if="article" class="bg-white rounded-lg p-6 flex flex-col lg:flex-row">
      <div class="lg:w-1/2">
        <ImageCarousel :images="article.images" />
      </div>

      <!-- Article Info -->
      <div class="pl-6 text-left">
        <EditableFields
          :fields="editableFields"
          :isEditing="isEditing"
          @update:fields="updateEditableFields"
        />

        <!-- Edit and Save Buttons -->
        <div class="flex justify-center items-center space-x-4 mt-4">
          <button
            v-if="isAdmin"
            @click="toggleEdit"
            class="bg-gray-600 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-500 transition"
          >
            {{ isEditing ? "Annuler" : "Modifier" }}
          </button>

          <button
            v-if="isAdmin && isEditing"
            @click="saveChanges"
            class="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-500 transition"
          >
            Enregistrer
          </button>
        </div>

        <!-- Add to Cart Button -->
        <button
          v-if="!isAdmin"
          @click="addToCart"
          class="mt-4 bg-gray-600 text-white px-8 py-3 rounded-lg shadow hover:bg-gray-500 transition"
        >
          Ajouter au panier
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else>
      <p class="text-center text-gray-500">Chargement des détails de l'article...</p>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cartStore';
import { fetchArticleDetails, updateArticle } from '@/services/articleDetails';
import ImageCarousel from '@/components/articles/details/ImageCarousel.vue';
import EditableFields from '@/components/articles/details/EditableFields.vue';

export default {
  name: 'ArticleDetails',
  components: {
    ImageCarousel,
    EditableFields,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup() {
    const authStore = useAuthStore();
    const cartStore = useCartStore();

    return {
      authStore,
      cartStore,
    };
  },
  data() {
    return {
      article: null,
      currentImageIndex: 0,
      isEditing: false,
      editableFields: {
        name: '',
        description: '',
        price: '',
        stock: '',
      },
    };
  },
  computed: {
    isAdmin() {
      return this.authStore.isAdmin;
    },
    formattedDescription() {
      return this.article ? this.article.description.replace(/\n/g, '<br>') : '';
    },
  },
  methods: {
    updateEditableFields(updatedFields) {
      this.editableFields = { ...updatedFields };
    },
    async fetchArticleDetails() {
      try {
        this.article = await fetchArticleDetails(this.id);
        this.editableFields = {
          name: this.article.name,
          description: this.article.description,
          price: this.article.price,
          stock: this.article.stock,
        };
      } catch (error) {
        alert("Une erreur est survenue lors de la récupération des détails de l'article.");
      }
    },
    toggleEdit() {
      if (!this.isEditing) {
        this.editableFields = { ...this.article };
      }
      this.isEditing = !this.isEditing;
    },
    async saveChanges() {
      try {
        await updateArticle(this.id, this.editableFields);
        // Mettre à jour `article` avec les nouvelles valeurs
        this.article = { ...this.article, ...this.editableFields };
        this.isEditing = false;
      } catch (error) {
        alert("Une erreur est survenue lors de la mise à jour de l'article.");
      }
    },
    addToCart() {
      const item = {
        id: this.article.id,
        name: this.article.name,
        price: this.article.price,
      };
      this.cartStore.addToCart(item);
    },
  },
  mounted() {
    this.fetchArticleDetails();
  },
};
</script>
