<template>
  <div class="relative">
    <!-- Image principale -->
    <div class="relative group cursor-zoom-in" @click="openModal(currentImageIndex)">
      <img
        :src="'data:image/jpeg;base64,' + images[currentImageIndex].base64"
        alt="Article image"
        class="w-full h-[500px] sm:h-[400px] lg:h-[600px] object-contain rounded-lg"
      />

      <!-- Icône de zoom -->
      <div
        class="absolute z-10 inset-0 flex justify-center items-center bg-black bg-opacity-30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
      >
        <span class="text-white text-2xl font-bold">+</span>
      </div>
    </div>

    <!-- Boutons de navigation -->
    <button
      v-if="images.length > 1"
      @click="prevImage"
      class="absolute z-20 top-1/2 transform -translate-y-1/2 left-4 bg-white text-gray-600 rounded-full shadow-md p-2 focus:outline-none hover:bg-gray-200"
    >
      ◀
    </button>
    <button
      v-if="images.length > 1"
      @click="nextImage"
      class="absolute z-20 top-1/2 transform -translate-y-1/2 right-4 bg-white text-gray-600 rounded-full shadow-md p-2 focus:outline-none hover:bg-gray-200"
    >
      ▶
    </button>

    <!-- Miniatures -->
    <div class="flex mt-4 gap-2 overflow-x-auto">
      <img
        v-for="(image, index) in images"
        :key="index"
        :src="'data:image/jpeg;base64,' + image.base64"
        alt="Thumbnail"
        @click="openModal(index)"
        :class="{
          'border-2 border-blue-500': currentImageIndex === index,
          'opacity-50': currentImageIndex !== index
        }"
        class="w-16 h-32 object-contain rounded-lg cursor-pointer shadow-md"
      />
    </div>

    <!-- Modal pour afficher l'image en grand -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center"
    >
      <div class="relative">
        <img
          :src="'data:image/jpeg;base64,' + images[modalImageIndex].base64"
          alt="Modal image"
          class="max-w-full max-h-screen object-contain rounded-lg"
        />
        <button
          @click="closeModal"
          class="absolute top-4 right-4 bg-white text-gray-600 rounded-full shadow-md p-2 focus:outline-none hover:bg-gray-200"
        >
          ✖
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImageCarousel",
  props: {
    images: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      currentImageIndex: 0,
      isModalOpen: false,
      modalImageIndex: null,
    };
  },
  methods: {
    prevImage() {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    },
    nextImage() {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    },
    openModal(index) {
      this.isModalOpen = true;
      this.modalImageIndex = index;
    },
    closeModal() {
      this.isModalOpen = false;
      this.modalImageIndex = null;
    },
  },
};
</script>

<style scoped>
/* Loupe uniquement sur l'image principale */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

button {
  cursor: pointer;
  position: absolute;
}

/* Responsive tweaks */
@media (max-width: 640px) {
  .sm\:h-[400px] {
    height: 400px;
  }
}

@media (min-width: 1024px) {
  .lg\:h-[600px] {
    height: 600px;
  }
}
</style>
