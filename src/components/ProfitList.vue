<template>
  <div>
    <h2 class="text-xl font-semibold text-gray-800 mb-4">Profit History</h2>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"
      ></div>
      <p class="mt-4 text-gray-600">Loading profits...</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md"
    >
      {{ error }}
      <button @click="fetchProfits" class="underline ml-2">Try again</button>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="profits.length === 0"
      class="text-center text-gray-500 py-4"
    >
      No profits recorded yet
    </div>

    <!-- Data Display -->
    <div v-else class="space-y-3">
      <!-- Summary Stats -->
      <div class="bg-white rounded-lg p-4 shadow mb-6">
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center">
            <p class="text-sm text-gray-600">Total Profit</p>
            <p class="text-xl font-bold text-green-600">
              ${{ totalProfit.toFixed(2) }}
            </p>
          </div>
          <div class="text-center">
            <p class="text-sm text-gray-600">Total Hours</p>
            <p class="text-xl font-bold text-blue-600">
              {{ totalHours.toFixed(1) }}h
            </p>
          </div>
          <div class="text-center">
            <p class="text-sm text-gray-600">Avg. $/Hour</p>
            <p class="text-xl font-bold text-purple-600">
              ${{ averageHourlyRate.toFixed(2) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Profit List -->
      <div
        v-for="profit in sortedProfits"
        :key="profit.id"
        class="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm text-gray-600">
              {{ formatDate(profit.createdAt) }}
            </p>
            <p class="text-lg font-semibold text-gray-800">
              ${{ Number(profit.profit).toFixed(2) }}
            </p>
            <p class="text-sm text-gray-600">
              {{ Number(profit.hours_worked) }} hours worked
              <span class="text-gray-400">
                (${{
                  (Number(profit.profit) / Number(profit.hours_worked)).toFixed(
                    2
                  )
                }}/hr)
              </span>
            </p>
            <p v-if="profit.notes" class="mt-2 text-sm text-gray-600">
              {{ profit.notes }}
            </p>
          </div>
          <!-- Delete Button -->
          <button
            @click="handleDelete(profit)"
            class="text-gray-400 hover:text-red-500 transition-colors duration-200"
            :disabled="isDeleting"
          >
            <svg
              v-if="isDeleting && profitToDelete?.id === profit.id"
              class="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
            >
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
            <svg
              v-else
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
        <p class="text-sm text-gray-500 mb-4">
          Are you sure you want to delete this profit entry? This action cannot
          be undone.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="cancelDelete"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Refresh Button -->
    <button
      @click="fetchProfits"
      class="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <svg
        class="h-4 w-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      Refresh
    </button>
  </div>
</template>

<script>
import { profitService } from "../services/api";

export default {
  name: "ProfitList",

  data() {
    return {
      profits: [],
      loading: true,
      error: null,
      showDeleteModal: false,
      profitToDelete: null,
      isDeleting: false,
    };
  },

  computed: {
    sortedProfits() {
      return [...this.profits].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    },
    totalProfit() {
      return this.profits.reduce(
        (sum, profit) => sum + Number(profit.profit),
        0
      );
    },
    totalHours() {
      return this.profits.reduce(
        (sum, profit) => sum + Number(profit.hours_worked),
        0
      );
    },
    averageHourlyRate() {
      return this.totalHours > 0 ? this.totalProfit / this.totalHours : 0;
    },
  },

  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },

    async fetchProfits() {
      this.loading = true;
      this.error = null;

      try {
        const response = await profitService.getProfits();
        this.profits = response;
      } catch (error) {
        console.error("Error fetching profits:", error);
        this.error = "Failed to load profits. Please try again.";
      } finally {
        this.loading = false;
      }
    },

    handleDelete(profit) {
      this.profitToDelete = profit;
      this.showDeleteModal = true;
    },

    cancelDelete() {
      this.showDeleteModal = false;
      this.profitToDelete = null;
    },

    async confirmDelete() {
      if (!this.profitToDelete) return;

      this.isDeleting = true;
      try {
        await profitService.deleteProfit(this.profitToDelete.id);
        this.profits = this.profits.filter(
          (p) => p.id !== this.profitToDelete.id
        );
        this.$emit("show-success", "Profit entry deleted successfully");
      } catch (error) {
        console.error("Error deleting profit:", error);
        this.$emit("show-error", "Failed to delete profit entry");
      } finally {
        this.isDeleting = false;
        this.showDeleteModal = false;
        this.profitToDelete = null;
      }
    },

    addProfit(profit) {
      this.profits.unshift(profit);
    },
  },

  async mounted() {
    await this.fetchProfits();
  },

  watch: {
    "$props.newProfit": {
      handler(newProfit) {
        if (newProfit) {
          this.addProfit(newProfit);
        }
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
