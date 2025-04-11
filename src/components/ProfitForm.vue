<template>
  <form @submit.prevent="submitProfit" class="space-y-4">
    <!-- Profit Amount Field -->
    <div class="space-y-2">
      <label for="profit" class="block text-sm font-medium text-gray-700">
        Profit Amount
      </label>
      <div class="relative">
        <span class="absolute left-3 top-2 text-gray-500">$</span>
        <input
          id="profit"
          v-model="formData.profit"
          type="number"
          step="0.01"
          required
          :disabled="loading"
          class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="0.00"
        />
      </div>
    </div>

    <!-- Hours Worked Field -->
    <div class="space-y-2">
      <label for="hours" class="block text-sm font-medium text-gray-700">
        Hours Worked
      </label>
      <input
        id="hours"
        v-model="formData.hours_worked"
        type="number"
        step="0.5"
        required
        :disabled="loading"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter hours worked"
      />
    </div>

    <!-- Notes Field -->
    <div class="space-y-2">
      <label for="notes" class="block text-sm font-medium text-gray-700">
        Notes
      </label>
      <textarea
        id="notes"
        v-model="formData.notes"
        rows="3"
        :disabled="loading"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Add any notes about your day"
      ></textarea>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="text-red-600 text-sm bg-red-50 p-2 rounded">
      {{ error }}
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      :disabled="loading"
      class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:bg-blue-300"
    >
      <span v-if="loading" class="flex items-center justify-center">
        <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Saving...
      </span>
      <span v-else>Save Entry</span>
    </button>
  </form>
</template>

<script>
import { profitService } from "../services/api";

export default {
  name: "ProfitForm",

  data() {
    return {
      formData: {
        profit: "",
        hours_worked: "",
        notes: "",
      },
      loading: false,
      error: null,
    };
  },

  methods: {
    async submitProfit() {
      if (!this.formData.profit || !this.formData.hours_worked) {
        this.error = "Please fill in all required fields";
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const profitData = {
          profit: this.formData.profit.toString(),
          hours_worked: this.formData.hours_worked.toString(),
          notes: this.formData.notes.toString(),
        };

        const response = await profitService.createProfit(profitData);

        this.$emit("add-profit", response);
        this.$emit("show-success", "Profit entry saved successfully!");

        // Reset form
        this.formData = {
          profit: "",
          hours_worked: "",
          notes: "",
        };
      } catch (error) {
        console.error("Error saving profit:", error);
        this.error =
          error.response?.data?.message || "An error occurred while saving";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
