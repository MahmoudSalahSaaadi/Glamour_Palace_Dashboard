<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-2xl font-bold">Add New Category</h1>
      <v-btn variant="text" to="/categories">
        <v-icon start>mdi-arrow-left</v-icon>
        Back to Categories
      </v-btn>
    </div>

    <v-card>
      <v-card-text>
        <v-form @submit.prevent="saveCategory">
          <v-row>
            <v-col cols="12" md="8">
              <v-text-field
                v-model="category.name"
                label="Category Name"
                :rules="[v => !!v || 'Category name is required']"
                required
                variant="outlined"
                class="mb-4"
              ></v-text-field>

              <v-text-field
                v-model="category.slug"
                label="URL Slug"
                hint="The URL-friendly version of the name"
                persistent-hint
                variant="outlined"
                class="mb-4"
              >
                <template v-slot:prepend-inner>
                  <span class="text-grey">yourstore.com/category/</span>
                </template>
              </v-text-field>

              <v-textarea
                v-model="category.description"
                label="Description"
                variant="outlined"
                rows="3"
                class="mb-4"
                hint="The description is not prominent by default; however, some themes may show it."
                persistent-hint
              ></v-textarea>

              <v-checkbox
                v-model="category.isActive"
                label="Active"
                hide-details
                class="mb-4"
              ></v-checkbox>

              <v-checkbox
                v-model="category.showInMenu"
                label="Display in navigation menu"
                hide-details
                class="mb-4"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="4">
              <v-card variant="outlined" class="mb-4">
                <v-card-title class="text-subtitle-1">Category Image</v-card-title>
                <v-card-text class="text-center">
                  <v-avatar size="150" rounded="0" class="mb-4">
                    <v-img v-if="category.image" :src="category.image" cover></v-img>
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
                  <div class="text-caption text-grey">
                    Recommended size: 1200x600 pixels
                  </div>
                </v-card-text>
              </v-card>

              <v-card variant="outlined">
                <v-card-title class="text-subtitle-1">Search Engine Optimization</v-card-title>
                <v-card-text>
                  <v-text-field
                    v-model="category.metaTitle"
                    label="Meta Title"
                    variant="outlined"
                    class="mb-4"
                    hint="The meta title to use for browser title and social sharing"
                    persistent-hint
                  ></v-text-field>

                  <v-textarea
                    v-model="category.metaDescription"
                    label="Meta Description"
                    variant="outlined"
                    rows="2"
                    hint="The meta description to use for search engine results"
                    persistent-hint
                  ></v-textarea>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-divider class="my-6"></v-divider>

          <div class="d-flex justify-end">
            <v-btn
              color="grey"
              variant="text"
              @click="$router.push('/categories')"
              class="mr-2"
            >
              Cancel
            </v-btn>
            <v-btn
              type="submit"
              color="primary"
              :loading="saving"
            >
              Save Category
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
const saving = ref(false);
const imageFile = ref(null);

const category = ref({
  name: '',
  slug: '',
  description: '',
  image: '',
  isActive: true,
  showInMenu: true,
  metaTitle: '',
  metaDescription: ''
});

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      category.value.image = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function saveCategory() {
  saving.value = true;
  
  // In a real app, you would make an API call here
  console.log('Saving category:', category.value);
  
  // Simulate API call delay
  setTimeout(() => {
    saving.value = false;
    router.push('/categories');
  }, 1000);
}
</script>
