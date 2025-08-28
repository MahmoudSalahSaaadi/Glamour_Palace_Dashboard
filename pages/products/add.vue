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
                  <v-text-field
                    v-model="product.name"
                    label="Product Name"
                    :rules="[v => !!v || 'Required']"
                    required
                    variant="outlined"
                    class="mb-4"
                  ></v-text-field>

                  <v-textarea
                    v-model="product.description"
                    label="Description"
                    variant="outlined"
                    rows="3"
                    class="mb-4"
                  ></v-textarea>

                  <v-select
                    v-model="product.category"
                    :items="categories"
                    label="Category"
                    variant="outlined"
                    class="mb-4"
                  ></v-select>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card variant="outlined" class="mb-4">
                    <v-card-text class="text-center">
                      <v-avatar size="150" rounded="0" class="mb-4">
                        <v-img v-if="product.image" :src="product.image" cover></v-img>
                        <v-icon v-else size="64" color="grey">mdi-image</v-icon>
                      </v-avatar>
                      <v-file-input
                        v-model="imageFile"
                        accept="image/*"
                        label="Upload Image"
                        prepend-icon="mdi-camera"
                        variant="outlined"
                        @change="handleImageUpload"
                      ></v-file-input>
                    </v-card-text>
                  </v-card>

                  <v-text-field
                    v-model.number="product.price"
                    label="Price"
                    type="number"
                    min="0"
                    step="0.01"
                    prefix="$"
                    variant="outlined"
                    class="mb-4"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- Inventory -->
            <v-window-item value="inventory">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="product.sku"
                    label="SKU"
                    variant="outlined"
                    class="mb-4"
                  ></v-text-field>

                  <v-text-field
                    v-model.number="product.stock"
                    label="Stock Quantity"
                    type="number"
                    min="0"
                    variant="outlined"
                    class="mb-4"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- Shipping -->
            <v-window-item value="shipping">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="product.weight"
                    label="Weight (kg)"
                    type="number"
                    min="0"
                    step="0.1"
                    variant="outlined"
                    class="mb-4"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>

          <v-divider class="my-6"></v-divider>

          <div class="d-flex justify-end">
            <v-btn
              color="grey"
              variant="text"
              @click="$router.push('/products')"
              class="mr-2"
            >
              Cancel
            </v-btn>
            <v-btn
              type="submit"
              color="primary"
              @click="saveProduct"
            >
              Save Product
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const tab = ref('details');
const imageFile = ref(null);

const product = ref({
  name: '',
  description: '',
  category: '',
  price: 0,
  sku: '',
  stock: 0,
  weight: 0.5,
  image: ''
});

const categories = [
  'Clothing',
  'Electronics',
  'Home & Garden',
  'Beauty',
  'Sports',
  'Toys',
  'Books',
  'Other'
];

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

function saveProduct() {
  // In a real app, you would make an API call here
  console.log('Saving product:', product.value);
  router.push('/products');
}
</script>
