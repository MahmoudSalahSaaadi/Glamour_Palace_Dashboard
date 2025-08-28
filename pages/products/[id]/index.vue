<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
      <v-btn variant="text" to="/products" class="text-none">
        <v-icon start>mdi-arrow-left</v-icon>
        Back to Products
      </v-btn>
      <div>
        <v-btn
          color="primary"
          variant="tonal"
          :to="`/products/${$route.params.id}/edit`"
          class="mr-2"
        >
          <v-icon start>mdi-pencil</v-icon>
          Edit
        </v-btn>
        <v-btn color="error" variant="tonal" @click="confirmDelete">
          <v-icon start>mdi-delete</v-icon>
          Delete
        </v-btn>
      </div>
    </div>

    <v-card v-if="loading">
      <v-card-text class="text-center py-12">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <div class="mt-4">Loading product details...</div>
      </v-card-text>
    </v-card>

    <v-card v-else>
      <v-card-title class="text-h5 font-weight-bold px-6 pt-6 pb-4">
        {{ product.name }}
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="8">
            <v-img
              :src="product.image || 'https://via.placeholder.com/800x600'"
              height="400"
              cover
              class="rounded-lg mb-4"
            ></v-img>
            
            <div class="text-subtitle-1 mb-4">
              <v-chip :color="product.stock > 0 ? 'success' : 'error'" size="small" class="mr-2">
                {{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}
              </v-chip>
              {{ product.stock }} available
            </div>

            <div class="text-h6 mb-2">Description</div>
            <p class="text-body-1 mb-6">{{ product.description || 'No description available' }}</p>

            <v-divider class="my-6"></v-divider>

            <div class="text-h6 mb-4">Product Details</div>
            <v-table density="compact" class="elevation-1">
              <tbody>
                <tr v-for="(value, key) in productDetails" :key="key">
                  <td class="text-subtitle-2">{{ formatKey(key) }}</td>
                  <td class="text-right">{{ formatValue(key, value) }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-col>

          <v-col cols="12" md="4">
            <v-card variant="outlined" class="mb-4">
              <v-card-title class="text-subtitle-1 font-weight-bold">Pricing</v-card-title>
              <v-card-text>
                <div v-for="(value, key) in pricingDetails" :key="key" 
                     :class="{'d-flex justify-space-between mb-2': true, 'text-h6': key === 'profit'}">
                  <span>{{ formatKey(key) }}</span>
                  <span :class="{'font-weight-bold': key === 'price' || key === 'profit'}">
                    {{ formatPricingValue(key, value) }}
                  </span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title>Delete Product</v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ product.name }}"? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="tonal" @click="deleteProduct">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const deleteDialog = ref(false);
const product = ref({
  name: 'Sample Product',
  description: 'This is a sample product description.',
  price: 99.99,
  cost: 49.99,
  stock: 50,
  category: 'Electronics',
  sku: 'PRD-001',
  weight: 1.5,
  dimensions: '10 x 8 x 2 in',
  lowStockThreshold: 10,
  image: 'https://via.placeholder.com/800x600'
});

const productDetails = computed(() => ({
  price: `$${product.value.price?.toFixed(2)}`,
  category: product.value.category,
  sku: product.value.sku,
  weight: product.value.weight ? `${product.value.weight} kg` : 'N/A',
  dimensions: product.value.dimensions || 'N/A'
}));

const pricingDetails = computed(() => ({
  price: product.value.price,
  cost: product.value.cost || 0,
  profit: product.value.price - (product.value.cost || 0)
}));

const formatKey = (key) => {
  return key.split(/(?=[A-Z])/).map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const formatValue = (key, value) => {
  if (value === undefined || value === null) return 'N/A';
  if (key === 'price') return `$${parseFloat(value).toFixed(2)}`;
  return value;
};

const formatPricingValue = (key, value) => {
  if (key === 'profit') {
    const profitPercent = product.value.cost 
      ? Math.round(((product.value.price - product.value.cost) / product.value.price) * 100) 
      : 0;
    return `$${value.toFixed(2)} (${profitPercent}%)`;
  }
  return `$${value.toFixed(2)}`;
};

const fetchProduct = async () => {
  try {
    loading.value = true;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    loading.value = false;
  } catch (error) {
    console.error('Error fetching product:', error);
    loading.value = false;
  }
};

const confirmDelete = () => {
  deleteDialog.value = true;
};

const deleteProduct = async () => {
  try {
    // Simulate delete API call
    await new Promise(resolve => setTimeout(resolve, 500));
    router.push('/products');
  } catch (error) {
    console.error('Error deleting product:', error);
  }
};

onMounted(fetchProduct);
</script>
