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
        <v-text-field v-model="search" append-inner-icon="mdi-magnify" label="Search products" single-line hide-details
          variant="outlined" density="compact" class="mr-4"></v-text-field>
      </v-card-title>

      <v-data-table :headers="headers" :items="products" :search="search" :items-per-page="10" class="elevation-1"
        :loading="loading">
        <template v-slot:item.id="{ item }">
          <v-chip color="primary" variant="outlined" size="small">
            #{{ item.id }}
          </v-chip>
        </template>

        <template v-slot:item.name="{ item }">
          <div class="product-name">{{ item.name }}</div>
        </template>

        <template v-slot:item.description="{ item }">
          <div class="product-description">
            {{ truncateDescription(item.description) }}
          </div>
        </template>

        <template v-slot:item.price="{ item }">
          ${{ parseFloat(item.price).toFixed(2) }}
        </template>

        <template v-slot:item.stock="{ item }">
          <v-chip :color="getStockColor(item.stock)" size="small">
            {{ item.stock }} in stock
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="action-buttons">
            <v-tooltip text="Edit Product">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon size="small" variant="text" color="primary"
                  :to="`/products/edit/${item.id}`">
                  <img width="20" height="20" src="/public/edit-pencil-line-01-svgrepo-com.svg" alt="" srcset="">

                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip text="View Details">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon size="small" variant="text" color="info" :to="`/products/view/${item.id}`">
                  <img width="20" height="20" src="/public/visible-eye-svgrepo-com.svg" alt="" srcset="">
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip text="Delete Product">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon size="small" variant="text" color="error" @click="deleteProduct(item)">
                  <img width="20" height="20" src="/public/icons8-delete.svg" alt="" srcset="">
                </v-btn>
              </template>
            </v-tooltip>
          </div>
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
import { ref, onMounted } from 'vue';

const products = ref([]);
const search = ref('');
const deleteDialog = ref(false);
const selectedProduct = ref(null);
const loading = ref(true);

const headers = [
  { title: 'ID', key: 'id', sortable: true, width: '100px' },
  { title: 'Name', key: 'name' },
  { title: 'Description', key: 'description', width: '300px' },
  { title: 'Price', key: 'price', width: '120px' },
  { title: 'Stock', key: 'stock', width: '120px' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end', width: '180px' },
];

// تقليل طول الوصف
const truncateDescription = (description) => {
  if (!description) return '';
  if (description.length > 100) {
    return description.substring(0, 100) + '...';
  }
  return description;
};

// Fetch products from API
const fetchProducts = async () => {
  try {
    const { data } = await useFetch('http://127.0.0.1:8000/api/products');
    if (data.value) {
      products.value = data.value;
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProducts();
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

async function confirmDelete() {
  if (selectedProduct.value) {
    try {
      await $fetch(`http://127.0.0.1:8000/api/products/${selectedProduct.value.id}`, {
        method: 'DELETE'
      });

      // Remove from local state
      const index = products.value.findIndex(p => p.id === selectedProduct.value.id);
      if (index !== -1) {
        products.value.splice(index, 1);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }

    deleteDialog.value = false;
  }
}
</script>

<style scoped>
/* تحسين مظهر الجدول */
.v-data-table {
  width: 100%;
}

/* تحسين عرض الأسماء */
.product-name {
  font-weight: 500;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* تحسين عرض الأوصاف */
.product-description {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* تحسين أزرار الإجراءات */
.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.v-btn {
  min-width: auto !important;
}
</style>