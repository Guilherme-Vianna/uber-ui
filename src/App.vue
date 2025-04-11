<template>
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">
        Uber Daily Profit Tracker
      </h1>

      <div
        v-if="successMessage"
        class="max-w-2xl mx-auto mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
      >
        {{ successMessage }}
        <button @click="successMessage = ''" class="absolute right-0 top-0 p-3">
          ×
        </button>
      </div>

      <div class="max-w-2xl mx-auto">
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
          <ProfitForm
            @add-profit="handleProfitAdded"
            @show-success="showSuccess"
          />
        </div>

        <!-- List Card -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <ProfitList ref="profitList" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProfitForm from "./components/ProfitForm.vue";
import ProfitList from "./components/ProfitList.vue";
import profitService from "./services/api";

export default {
  components: {
    ProfitForm,
    ProfitList,
  },

  data() {
    return {
      successMessage: "",
    };
  },

  methods: {
    handleProfitAdded() {
      this.$refs.profitList.fetchProfits();
    },
    confirmDelete(profit) {
      this.profitToDelete = profit;
      this.showDeleteModal = true;
    },

    async deleteProfit() {
      if (!this.profitToDelete) return;

      this.deleteLoading = this.profitToDelete.id;
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
        this.deleteLoading = null;
        this.showDeleteModal = false;
        this.profitToDelete = null;
      }
    },
    showSuccess(message) {
      this.successMessage = message;
      setTimeout(() => {
        this.successMessage = "";
      }, 3000);
    },
  },
};
</script>
