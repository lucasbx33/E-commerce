<template>
  <footer class="bg-white text-gray-700 py-8">
    <div class="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
      <!-- Left Side: Logo and Info -->
      <div class="text-center md:text-left">
        <a href="/" class="text-gray-700 text-3xl font-bold hover:text-gray-600 transition">
          ECLORE
        </a>
        <p class="text-gray-400 mt-2">
          &copy; 2024 MonEcommerce. Tous droits réservés.
        </p>
      </div>

      <!-- Center: Quick Links -->
      <ul class="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
        <li>
          <a href="#privacy" class="hover:text-gray-400 transition">Politique de confidentialité</a>
        </li>
        <li>
          <a href="#terms" class="hover:text-gray-400 transition">Conditions d'utilisation</a>
        </li>
        <li>
          <a href="#contact" class="hover:text-gray-400 transition">Nous contacter</a>
        </li>
      </ul>

      <!-- Right Side: Social Media -->
      <div class="flex space-x-6">
        <a href="#facebook" aria-label="Facebook" class="hover:text-blue-500 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.99 3.657 9.126 8.438 9.878V15.89H7.898v-3.11h2.54v-2.3c0-2.507 1.492-3.89 3.775-3.89 1.094 0 2.238.196 2.238.196v2.467h-1.26c-1.243 0-1.629.772-1.629 1.562v1.964h2.77l-.443 3.11h-2.327v6.048C18.344 21.126 22 16.99 22 12z" />
          </svg>
        </a>
        <a href="#twitter" aria-label="Twitter" class="hover:text-blue-400 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.29 20.251c7.548 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.532A8.348 8.348 0 0 0 22 5.92a8.19 8.19 0 0 1-2.357.646 4.104 4.104 0 0 0 1.804-2.27 8.233 8.233 0 0 1-2.605.996 4.104 4.104 0 0 0-6.993 3.735A11.638 11.638 0 0 1 3.166 4.869a4.104 4.104 0 0 0 1.27 5.47 4.073 4.073 0 0 1-1.857-.512v.052a4.104 4.104 0 0 0 3.292 4.018 4.09 4.09 0 0 1-1.853.07 4.104 4.104 0 0 0 3.833 2.85A8.233 8.233 0 0 1 2 18.407a11.615 11.615 0 0 0 6.29 1.84" />
          </svg>
        </a>
        <a href="#instagram" aria-label="Instagram" class="hover:text-pink-500 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8zm0 1.5a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8zM16.9 6.1a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8z" />
          </svg>
        </a>
      </div>
    </div>
  </footer>
</template>

<script>

export default {
  name: 'FooterVue',

};
</script>