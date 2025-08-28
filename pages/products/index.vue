<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-2xl font-bold">Products</h1>
      <v-btn color="primary" prepend-icon="mdi-plus" to="/products/add">
        Add Product
      </v-btn>
    </div>

    <v-card>
      <v-card-title class="d-flex align-center">
        <v-text-field
          v-model="search"
          append-inner-icon="mdi-magnify"
          label="Search products"
          single-line
          hide-details
          variant="outlined"
          density="compact"
          class="mr-4"
        ></v-text-field>
        <v-select
          v-model="categoryFilter"
          :items="categories"
          item-title="name"
          item-value="id"
          label="Category"
          clearable
          density="compact"
          variant="outlined"
          style="max-width: 200px;"
        ></v-select>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="products"
        :search="search"
        :items-per-page="10"
        class="elevation-1"
      >
        <template v-slot:item.image="{ item }">
          <v-avatar size="40" rounded="0">
            <v-img :src="item.image || 'https://via.placeholder.com/40'" :alt="item.name"></v-img>
          </v-avatar>
        </template>

        <template v-slot:item.price="{ item }">
          ${{ item.price.toFixed(2) }}
        </template>

        <template v-slot:item.stock="{ item }">
          <v-chip :color="getStockColor(item.stock)" size="small">
            {{ item.stock }} in stock
          </v-chip>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip :color="item.status === 'published' ? 'success' : 'grey'" size="small">
            {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon
            size="small"
            variant="text"
            color="primary"
            :to="`/products/edit/${item.id}`"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            icon
            size="small"
            variant="text"
            color="error"
            @click="deleteProduct(item)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title>Delete Product</v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ selectedProduct?.name }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" @click="confirmDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Sample data - replace with API calls in a real application
const products = ref([
  {
    id: 1,
    name: 'Summer Dress',
    sku: 'SUMMER-001',
    category: 'Dresses',
    price: 49.99,
    stock: 45,
    status: 'published',
    image: 'https://via.placeholder.com/40',
  },
  {
    id: 2,
    name: 'Denim Jacket',
    sku: 'JACKET-001',
    category: 'Jackets',
    price: 89.99,
    stock: 12,
    status: 'published',
    image: 'https://via.placeholder.com/40',
  },
  // Add more sample products as needed
]);

const categories = ref([
  { id: 1, name: 'Dresses' },
  { id: 2, name: 'Jackets' },
  { id: 3, name: 'Tops' },
  { id: 4, name: 'Bottoms' },
]);

const search = ref('');
const categoryFilter = ref('');
const deleteDialog = ref(false);
const selectedProduct = ref(null);

const headers = [
  { title: 'Image', key: 'image', sortable: false, width: '80px' },
  { title: 'Name', key: 'name' },
  { title: 'SKU', key: 'sku' },
  { title: 'Category', key: 'category' },
  { title: 'Price', key: 'price' },
  { title: 'Stock', key: 'stock' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
];

const filteredProducts = computed(() => {
  if (!categoryFilter.value) return products.value;
  return products.value.filter(product => 
    product.category.toLowerCase().includes(categoryFilter.value.toLowerCase())
  );
});

function getStockColor(stock) {
  if (stock > 20) return 'success';
  if (stock > 5) return 'warning';
  return 'error';
}

function deleteProduct(product) {
  selectedProduct.value = product;
  deleteDialog.value = true;
}

function confirmDelete() {
  if (selectedProduct.value) {
    const index = products.value.findIndex(p => p.id === selectedProduct.value.id);
    if (index !== -1) {
      products.value.splice(index, 1);
    }
    deleteDialog.value = false;
    // In a real app, you would make an API call here
  }
}
</script>
