<template>
    <div class="mb-3">
      <label :for="id" class="block text-sm font-medium text-gray-700">
        {{ label }}
      </label>
      <input
        :id="id"
        :value="modelValue"
        :type="type || 'text'"
        :placeholder="placeholder"
        :disabled="disabled"
        class="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
  </template>
  
  <script>
  export default {
    name: "InputProfil",
    props: {
      label: {
        type: String,
        required: true,
      },
      modelValue: {
        type: String,
        default: "",
      },
      id: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        default: "",
      },
      placeholder: {
        type: String,
        default: "",
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
  };
  </script>
  