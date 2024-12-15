<template>
  <div class="min-h-screen">
    <div class="relative h-[60vh]">
      <img
        src="@/assets/home/home_screen.png"
        alt="Hero Background"
        class="absolute inset-0 w-full h-full object-cover"
      />

      <div class="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
        <h1 class="text-4xl md:text-6xl font-extrabold mb-4">
          NE CHERCHEZ PLUS EN VIN
        </h1>
        <button class="cta-main-btn">
          Acheter du vin
        </button>
      </div>
    </div>

    <div class="py-12 flex justify-center">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          class="relative bg-white w-64 rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer"
        >
          <img
            src="@/assets/home/vin_rouge.png"
            alt="Vin Rouge"
            class="w-full h-48 object-cover"
          />
          <div class="absolute bottom-0 w-full flex items-center justify-between bg-white py-3 px-4">
            <h3 class="text-base font-semibold text-gray-800">Vin Rouge</h3>
            <div class="flex items-center justify-center w-8 h-8 rounded-full border-2 border-yellow-500">
              <svg
                class="w-4 h-4 text-yellow-500"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </div>

        <div
          class="relative bg-white w-64 rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer"
        >
          <img
            src="@/assets/home/vin_rose.png"
            alt="Vin Rosé"
            class="w-full h-48 object-cover"
          />
          <div class="absolute bottom-0 w-full flex items-center justify-between bg-white py-3 px-4">
            <h3 class="text-base font-semibold text-gray-800">Vin Rosé</h3>
            <div class="flex items-center justify-center w-8 h-8 rounded-full border-2 border-yellow-500">
              <svg
                class="w-4 h-4 text-yellow-500"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </div>

        <div
          class="relative bg-white w-64 rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer"
        >
          <img
            src="@/assets/home/vin_blanc.png"
            alt="Vin Blanc"
            class="w-full h-48 object-cover"
          />
          <div class="absolute bottom-0 w-full flex items-center justify-between bg-white py-3 px-4">
            <h3 class="text-base font-semibold text-gray-800">Vin Blanc</h3>
            <div class="flex items-center justify-center w-8 h-8 rounded-full border-2 border-yellow-500">
              <svg
                class="w-4 h-4 text-yellow-500"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="products" class="container mx-auto py-12">
      <h2 class="text-3xl font-bold text-center mb-6">Nos Produits</h2>
      <ArticleBox :products="products" />
    </div>

    <!-- 3D Object Section -->
    <!-- <div class="relative w-full h-96">
      <ThreeObject />
    </div> -->
  </div>
</template>


<script>
import ArticleBox from "@/components/articles/ArticleBox.vue";
// import ThreeObject from "@/components/3D/object3d.vue";

export default {
  name: "HomeVue",
  components: {
    ArticleBox,
    // ThreeObject,
  },
  data() {
    return {
      headerHeight: 64,
    };
  },
  mounted() {
    const header = document.querySelector("header");
    if (header) {
      this.headerHeight = header.offsetHeight; 
    }
  },
};
</script>

<style scoped>
.cta-main-btn {
  background-color: #ffd700; 
  color: #000; 
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 8px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.cta-main-btn:hover {
  background-color: #ffc107; 
  transform: translateY(-3px);
}

.cta-btn {
  background-color: transparent;
  color: #000;
  border: 2px solid #ffd700; 
  padding: 0.5rem 1.5rem;
  font-size: 0.9rem;
  font-weight: bold;
  border-radius: 8px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.cta-btn:hover {
  background-color: #ffd700; 
  color: #000; 
}
</style>
