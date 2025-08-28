<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-2xl font-bold">Categories</h1>
      <v-btn color="primary" prepend-icon="mdi-plus" to="/categories/add">
        Add Category
      </v-btn>
    </div>

    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-inner-icon="mdi-magnify"
          label="Search categories"
          single-line
          hide-details
          variant="outlined"
          density="compact"
        ></v-text-field>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="categories"
        :search="search"
        :items-per-page="10"
        class="elevation-1"
      >
        <template v-slot:item.image="{ item }">
          <v-avatar size="40" rounded="0">
            <v-img :src="item.image || 'https://via.placeholder.com/40'" :alt="item.name"></v-img>
          </v-avatar>
        </template>

        <template v-slot:item.productsCount="{ item }">
          {{ item.productsCount }} products
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip :color="item.status === 'active' ? 'success' : 'grey'" size="small">
            {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon
            size="small"
            variant="text"
            color="primary"
            :to="`/categories/edit/${item.id}`"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            icon
            size="small"
            variant="text"
            color="error"
            @click="deleteCategory(item)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title>Delete Category</v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ selectedCategory?.name }}"?
          <div v-if="selectedCategory?.productsCount > 0" class="mt-2 text-warning">
            <v-icon color="warning" class="mr-1">mdi-alert</v-icon>
            This category has {{ selectedCategory?.productsCount }} products. Deleting it will remove these products from this category.
          </div>
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
import { ref } from 'vue';

const search = ref('');
const deleteDialog = ref(false);
const selectedCategory = ref(null);

// Sample data - replace with API calls in a real application
const categories = ref([
  {
    id: 1,
    name: 'Clothing',
    slug: 'clothing',
    description: 'All types of clothing items',
    image: 'https://via.placeholder.com/40',
    productsCount: 45,
    status: 'active',
    createdAt: '2023-01-15',
  },
  {
    id: 2,
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and accessories',
    image: 'https://via.placeholder.com/40',
    productsCount: 32,
    status: 'active',
    createdAt: '2023-02-20',
  },
  {
    id: 3,
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Furniture and garden supplies',
    image: 'https://via.placeholder.com/40',
    productsCount: 28,
    status: 'active',
    createdAt: '2023-03-10',
  },
  {
    id: 4,
    name: 'Beauty',
    slug: 'beauty',
    description: 'Cosmetics and personal care',
    image: 'https://via.placeholder.com/40',
    productsCount: 67,
    status: 'inactive',
    createdAt: '2023-04-05',
  },
  {
    id: 5,
    name: 'Sports',
    slug: 'sports',
    description: 'Sports equipment and accessories',
    image: 'https://via.placeholder.com/40',
    productsCount: 0,
    status: 'active',
    createdAt: '2023-05-12',
  },
]);

const headers = [
  { title: 'Image', key: 'image', sortable: false, width: '80px' },
  { title: 'Name', key: 'name' },
  { title: 'Products', key: 'productsCount' },
  { title: 'Status', key: 'status' },
  { title: 'Created', key: 'createdAt' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
];

function deleteCategory(category) {
  selectedCategory.value = category;
  deleteDialog.value = true;
}

function confirmDelete() {
  if (selectedCategory.value) {
    const index = categories.value.findIndex(c => c.id === selectedCategory.value.id);
    if (index !== -1) {
      categories.value.splice(index, 1);
    }
    deleteDialog.value = false;
    // In a real app, you would make an API call here
  }
}
</script>
