<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full overflow-hidden">
      <div class="p-6 space-y-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-700">Informations personnelles</h3>
          <p class="text-sm text-gray-700">{{ user.email || 'Email non disponible' }}</p>
          <div class="mt-4">
            <InputField
              id="first-name"
              label="Prénom"
              v-model="user.firstName"
              :disabled="!isEditing"
              placeholder="Prénom"
            />
            <InputField
              id="last-name"
              label="Nom"
              v-model="user.lastName"
              :disabled="!isEditing"
              placeholder="Nom"
            />
            <InputField
              id="phone"
              label="Numéro de téléphone"
              v-model="user.phone"
              :disabled="!isEditing"
              placeholder="Entrez votre numéro de téléphone"
            />
          </div>
        </div>

        <div class="flex justify-center items-center">
          <button
            @click="toggleEdit"
            class="bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-lg shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1"
          >
            {{ isEditing ? "Enregistrer" : "Modifier le profil" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { notification } from "ant-design-vue";
import InputField from "../components/input/InputProfil.vue";
import { fetchUserProfile, updateUserProfile } from "@/services/user";

export default {
  name: "ProfilView",
  components: { InputField },
  data() {
    return {
      user: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      },
      isEditing: false,
    };
  },
  async mounted() {
    try {
      const userData = await fetchUserProfile();
      this.user = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone || "",
      };
    } catch (error) {
      console.error('Erreur lors du chargement des données utilisateur.', error);
    }
  },
  methods: {
    toggleEdit() {
      if (this.isEditing) {
        this.saveChanges();
      }
      this.isEditing = !this.isEditing;
    },
    async saveChanges() {
      try {
        await updateUserProfile({
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          phone: this.user.phone,
        });
        notification.success({
          message: "Profil mis à jour",
          description: "Vos informations ont été mises à jour avec succès.",
        });
      } catch (error) {
        notification.error({
          message: "Erreur",
          description: "Une erreur s'est produite lors de la mise à jour du profil.",
        });
      }
    },
  },
};
</script>
