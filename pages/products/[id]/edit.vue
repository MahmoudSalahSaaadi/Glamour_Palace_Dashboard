<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-2xl font-bold">Edit Product</h1>
      <v-btn variant="text" to="/products" class="text-none">
        <v-icon start>mdi-arrow-left</v-icon>
        Back to Products
      </v-btn>
    </div>

    <v-card v-if="loading">
      <v-card-text class="text-center py-12">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <div class="mt-4">Loading product details...</div>
      </v-card-text>
    </v-card>

    <v-card v-else>
      <v-tabs v-model="tab" color="primary">
        <v-tab value="details">Details</v-tab>
        <v-tab value="inventory">Inventory</v-tab>
        <v-tab value="shipping">Shipping</v-tab>
      </v-tabs>

      <v-card-text>
        <v-form @submit.prevent="updateProduct">
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
                    density="comfortable"
                  ></v-text-field>

                  <v-textarea
                    v-model="product.description"
                    label="Description"
                    variant="outlined"
                    rows="3"
                    class="mb-4"
                    auto-grow
                    density="comfortable"
                  ></v-textarea>

                  <v-select
                    v-model="product.category"
                    :items="categories"
                    label="Category"
                    variant="outlined"
                    class="mb-4"
                    density="comfortable"
                  ></v-select>

                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model.number="product.price"
                        label="Price"
                        type="number"
                        min="0"
                        step="0.01"
                        prefix="$"
                        variant="outlined"
                        class="mb-4"
                        density="comfortable"
                        :rules="[v => v >= 0 || 'Must be a positive number']"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model.number="product.cost"
                        label="Cost"
                        type="number"
                        min="0"
                        step="0.01"
                        prefix="$"
                        variant="outlined"
                        class="mb-4"
                        density="comfortable"
                        :rules="[v => v >= 0 || 'Must be a positive number']"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card variant="outlined" class="mb-4">
                    <v-card-text class="text-center">
                      <v-avatar
                        v-if="productImagePreview"
                        size="200"
                        rounded
                        class="mb-4"
                      >
                        <v-img
                          :src="productImagePreview"
                          cover
                          alt="Product Image"
                        ></v-img>
                      </v-avatar>
                      <v-avatar
                        v-else
                        size="200"
                        color="grey-lighten-3"
                        rounded
                        class="mb-4"
                      >
                        <v-icon size="64" color="grey">mdi-image</v-icon>
                      </v-avatar>
                      <v-file-input
                        v-model="imageFile"
                        accept="image/*"
                        label="Upload Image"
                        prepend-icon="mdi-camera"
                        variant="outlined"
                        density="comfortable"
                        @change="handleImageUpload"
                      ></v-file-input>
                    </v-card-text>
                  </v-card>
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
                    density="comfortable"
                  ></v-text-field>

                  <v-switch
                    v-model="product.trackInventory"
                    label="Track inventory"
                    color="primary"
                    hide-details
                    class="mb-4"
                  ></v-switch>

                  <template v-if="product.trackInventory">
                    <v-text-field
                      v-model.number="product.stock"
                      label="Current stock"
                      type="number"
                      min="0"
                      variant="outlined"
                      class="mb-4"
                      density="comfortable"
                      :rules="[v => v >= 0 || 'Must be a positive number']"
                    ></v-text-field>

                    <v-text-field
                      v-model.number="product.lowStockThreshold"
                      label="Low stock threshold"
                      type="number"
                      min="0"
                      variant="outlined"
                      class="mb-4"
                      density="comfortable"
                      :rules="[v => v >= 0 || 'Must be a positive number']"
                    ></v-text-field>

                    <v-switch
                      v-model="product.allowBackorders"
                      label="Allow backorders"
                      color="primary"
                      hide-details
                      class="mb-4"
                    ></v-switch>

                    <v-alert
                      v-if="product.stock !== undefined"
                      :color="getStockStatusColor(product.stock, product.lowStockThreshold)"
                      variant="tonal"
                      class="mb-4"
                    >
                      Status: {{ getStockStatus(product.stock, product.lowStockThreshold) }}
                    </v-alert>
                  </template>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- Shipping -->
            <v-window-item value="shipping">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="product.weight"
                    label="Weight"
                    type="number"
                    min="0"
                    step="0.1"
                    suffix="kg"
                    variant="outlined"
                    class="mb-4"
                    density="comfortable"
                    :rules="[v => v >= 0 || 'Must be a positive number']"
                  ></v-text-field>

                  <v-text-field
                    v-model="product.dimensions"
                    label="Dimensions (L × W × H)"
                    variant="outlined"
                    class="mb-4"
                    density="comfortable"
                    placeholder="e.g., 10 × 15 × 5 cm"
                  ></v-text-field>

                  <v-select
                    v-model="product.shippingClass"
                    :items="shippingClasses"
                    label="Shipping class"
                    variant="outlined"
                    class="mb-4"
                    density="comfortable"
                  ></v-select>

                  <v-switch
                    v-model="product.isVirtual"
                    label="Virtual product"
                    color="primary"
                    hide-details
                    class="mb-4"
                    :disabled="product.isDownloadable"
                  ></v-switch>

                  <v-switch
                    v-model="product.isDownloadable"
                    label="Downloadable product"
                    color="primary"
                    hide-details
                    class="mb-4"
                    :disabled="product.isVirtual"
                  ></v-switch>

                  <template v-if="product.isDownloadable">
                    <v-alert
                      type="info"
                      variant="tonal"
                      class="mb-4"
                    >
                      Add downloadable files in the product data section
                    </v-alert>
                  </template>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>

          <v-divider class="my-6"></v-divider>

          <div class="d-flex justify-space-between">
            <div>
              <v-btn
                color="error"
                variant="text"
                class="text-none"
                :disabled="deleting"
                @click="confirmDelete"
              >
                <v-icon start>mdi-delete</v-icon>
                Delete Product
              </v-btn>
            </div>
            <div>
              <v-btn
                variant="text"
                class="text-none mr-2"
                :to="`/products/${product.id}`"
                :disabled="saving"
              >
                Cancel
              </v-btn>
              <v-btn
                color="primary"
                class="text-none"
                type="submit"
                :loading="saving"
                :disabled="saving"
              >
                <v-icon start>mdi-content-save</v-icon>
                Save Changes
              </v-btn>
            </div>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title>Delete Product</v-card-title>
        <v-card-text>
          Are you sure you want to delete this product? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="deleteDialog = false" :disabled="deleting">
            Cancel
          </v-btn>
          <v-btn color="error" @click="deleteProduct" :loading="deleting">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const route = useRoute();
const router = useRouter();
const toast = useToast();

// UI State
const tab = ref('details');
const loading = ref(true);
const saving = ref(false);
const deleting = ref(false);
const deleteDialog = ref(false);
const imageFile = ref(null);

// Data
const categories = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Beauty',
  'Sports',
  'Books',
  'Toys',
  'Other'
];

const shippingClasses = [
  'No shipping class',
  'Light',
  'Heavy',
  'Fragile',
  'Oversized'
];

// Product data with default values
const product = ref({
  id: route.params.id,
  name: '',
  description: '',
  category: '',
  price: 0,
  cost: 0,
  sku: '',
  stock: 0,
  lowStockThreshold: 5,
  weight: 0.5,
  dimensions: '',
  shippingClass: 'No shipping class',
  isVirtual: false,
  isDownloadable: false,
  trackInventory: true,
  allowBackorders: false,
  image: ''
});

// Computed properties
const productImagePreview = computed(() => {
  if (imageFile.value) {
    return URL.createObjectURL(imageFile.value);
  }
  return product.value.image || null;
});

// Methods
const getStockStatus = (stock, threshold) => {
  if (stock <= 0) return 'Out of Stock';
  if (threshold && stock <= threshold) return 'Low Stock';
  return 'In Stock';
};

const getStockStatusColor = (stock, threshold) => {
  if (stock <= 0) return 'error';
  if (threshold && stock <= threshold) return 'warning';
  return 'success';
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  // Validate file type
  if (!file.type.match('image.*')) {
    toast.error('Please select a valid image file');
    return;
  }
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast.error('Image size should be less than 5MB');
    return;
  }
  
  // Update preview
  const reader = new FileReader();
  reader.onload = (e) => {
    product.value.image = e.target.result;
  };
  reader.readAsDataURL(file);
};

const fetchProduct = async () => {
  try {
    loading.value = true;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - replace with actual API call
    const mockProduct = {
      id: route.params.id,
      name: 'Sample Product',
      description: 'This is a sample product description.',
      category: 'Electronics',
      price: 99.99,
      cost: 49.99,
      sku: 'PRD-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
      stock: 50,
      lowStockThreshold: 5,
      weight: 1.5,
      dimensions: '10 x 15 x 5 cm',
      shippingClass: 'Light',
      isVirtual: false,
      isDownloadable: false,
      trackInventory: true,
      allowBackorders: false,
      image: 'https://via.placeholder.com/300'
    };
    
    Object.assign(product.value, mockProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    toast.error('Failed to load product details');
  } finally {
    loading.value = false;
  }
};

const updateProduct = async () => {
  try {
    saving.value = true;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Here you would typically make an API call to update the product
    console.log('Updating product:', product.value);
    
    toast.success('Product updated successfully');
    router.push(`/products/${product.value.id}`);
  } catch (error) {
    console.error('Error updating product:', error);
    toast.error('Failed to update product');
  } finally {
    saving.value = false;
  }
};

const confirmDelete = () => {
  deleteDialog.value = true;
};

const deleteProduct = async () => {
  try {
    deleting.value = true;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Here you would typically make an API call to delete the product
    console.log('Deleting product:', product.value.id);
    
    toast.success('Product deleted successfully');
    router.push('/products');
  } catch (error) {
    console.error('Error deleting product:', error);
    toast.error('Failed to delete product');
  } finally {
    deleting.value = false;
    deleteDialog.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  fetchProduct();
});
</script>
