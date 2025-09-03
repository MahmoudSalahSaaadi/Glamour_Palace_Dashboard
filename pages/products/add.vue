<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-2xl font-bold">Add New Product</h1>
      <v-btn variant="text" to="/products">
        <v-icon start>mdi-arrow-left</v-icon>
        Back to Products
      </v-btn>
    </div>

    <v-card>
      <v-tabs v-model="tab" color="primary">
        <v-tab value="details">Details</v-tab>
        <v-tab value="inventory">Inventory</v-tab>
        <v-tab value="shipping">Shipping</v-tab>
      </v-tabs>

      <v-card-text>
        <v-form @submit.prevent="saveProduct">
          <v-window v-model="tab">
            <!-- Product Details -->
            <v-window-item value="details">
              <v-row>
                <v-col cols="12" md="8">
                  <v-text-field v-model="product.name" label="Product Name" :rules="[v => !!v || 'Required']" required
                    variant="outlined" class="mb-4"></v-text-field>

                  <v-textarea v-model="product.description" label="Description" variant="outlined" rows="3"
                    class="mb-4"></v-textarea>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card variant="outlined" class="mb-4">
                    <v-card-text class="text-center">
                      <v-avatar size="150" rounded="0" class="mb-4">
                        <v-img v-if="product.image" :src="product.image" cover></v-img>
                        <v-icon v-else size="64" color="grey">mdi-image</v-icon>
                      </v-avatar>
                      <v-file-input v-model="imageFile" accept="image/*" label="Upload Image" prepend-icon="mdi-camera"
                        variant="outlined" @change="handleImageUpload"></v-file-input>
                    </v-card-text>
                  </v-card>

                  <v-text-field v-model.number="product.price" label="Price" type="number" min="0" step="0.01"
                    prefix="$" variant="outlined" class="mb-4"></v-text-field>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- Inventory -->
            <v-window-item value="inventory">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field v-model.number="product.stock" label="Stock Quantity" type="number" min="0"
                    variant="outlined" class="mb-4"></v-text-field>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- Shipping -->
            <v-window-item value="shipping">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field v-model.number="product.weight" label="Weight (kg)" type="number" min="0" step="0.1"
                    variant="outlined" class="mb-4"></v-text-field>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>

          <v-divider class="my-6"></v-divider>

          <div class="d-flex justify-end">
            <v-btn color="grey" variant="text" @click="$router.push('/products')" class="mr-2">
              Cancel
            </v-btn>
            <v-btn type="submit" color="primary" :loading="loading" @click="saveProduct">
              Save Product
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Error Dialog -->
    <v-dialog v-model="errorDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-error">Error</v-card-title>
        <v-card-text>
          {{ errorMessage }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="errorDialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const tab = ref('details');
const imageFile = ref(null);
const loading = ref(false);
const errorDialog = ref(false);
const errorMessage = ref('');

const product = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  weight: 0.5,
  image: ''
});

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      product.value.image = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

async function saveProduct() {
  // Basic validation
  if (!product.value.name) {
    errorMessage.value = 'Product name is required';
    errorDialog.value = true;
    return;
  }

  loading.value = true;

  try {
    // Prepare form data
    const formData = new FormData();
    formData.append('name', product.value.name);
    formData.append('description', product.value.description);
    formData.append('price', parseFloat(product.value.price));
    formData.append('stock', parseInt(product.value.stock));
    formData.append('weight', parseFloat(product.value.weight));

    // Add image if available
    if (imageFile.value) {
      formData.append('image', imageFile.value);
    }

    // Send product data to API
    const response = await fetch('http://127.0.0.1:8000/api/products', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save product');
    }

    const result = await response.json();

    if (result) {
      // Redirect to products list after successful creation
      router.push('/products');
    }
  } catch (error) {
    console.error('Error saving product:', error);
    errorMessage.value = error.message || 'Failed to save product. Please try again.';
    errorDialog.value = true;
  } finally {
    loading.value = false;
  }
}
</script>