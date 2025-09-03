<template>
    <div>
        <div class="d-flex justify-space-between align-center mb-6">
            <h1 class="text-2xl font-bold">تعديل المنتج</h1>
            <v-btn variant="text" to="/products">
                <v-icon start>mdi-arrow-left</v-icon>
                العودة إلى المنتجات
            </v-btn>
        </div>

        <v-card>
            <v-tabs v-model="tab" color="primary">
                <v-tab value="details">التفاصيل</v-tab>
                <v-tab value="inventory">المخزون</v-tab>
                <v-tab value="shipping">الشحن</v-tab>
            </v-tabs>

            <v-card-text>
                <v-form @submit.prevent="saveProduct">
                    <v-window v-model="tab">
                        <!-- Product Details -->
                        <v-window-item value="details">
                            <v-row>
                                <v-col cols="12" md="8">
                                    <v-text-field v-model="product.name" label="اسم المنتج"
                                        :rules="[v => !!v || 'مطلوب']" required variant="outlined"
                                        class="mb-4"></v-text-field>

                                    <v-textarea v-model="product.description" label="الوصف" variant="outlined" rows="3"
                                        class="mb-4"></v-textarea>
                                </v-col>

                                <v-col cols="12" md="4">
                                    <v-card variant="outlined" class="mb-4">
                                        <v-card-text class="text-center">
                                            <v-avatar size="150" rounded="0" class="mb-4">
                                                <v-img v-if="product.image" :src="product.image" cover></v-img>
                                                <v-icon v-else size="64" color="grey">mdi-image</v-icon>
                                            </v-avatar>
                                            <v-file-input v-model="imageFile" accept="image/*" label="رفع صورة"
                                                prepend-icon="mdi-camera" variant="outlined"
                                                @change="handleImageUpload"></v-file-input>
                                        </v-card-text>
                                    </v-card>

                                    <v-text-field v-model.number="product.price" label="السعر" type="number" min="0"
                                        step="0.01" prefix="ج.م" variant="outlined" class="mb-4"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-window-item>

                        <!-- Inventory -->
                        <v-window-item value="inventory">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model.number="product.stock" label="الكمية في المخزون" type="number"
                                        min="0" variant="outlined" class="mb-4"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-window-item>

                        <!-- Shipping -->
                        <v-window-item value="shipping">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model.number="product.weight" label="الوزن (كجم)" type="number"
                                        min="0" step="0.1" variant="outlined" class="mb-4"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-window-item>
                    </v-window>

                    <v-divider class="my-6"></v-divider>

                    <div class="d-flex justify-end">
                        <v-btn color="grey" variant="text" @click="$router.push('/products')" class="mr-2">
                            إلغاء
                        </v-btn>
                        <v-btn type="submit" color="primary" :loading="loading">
                            تحديث المنتج
                        </v-btn>
                    </div>
                </v-form>
            </v-card-text>
        </v-card>

        <!-- Error Dialog -->
        <v-dialog v-model="errorDialog" max-width="500px">
            <v-card>
                <v-card-title class="text-error">خطأ</v-card-title>
                <v-card-text>
                    {{ errorMessage }}
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="errorDialog = false">موافق</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
// Nuxt composables
const route = useRoute();
const router = useRouter();

const tab = ref('details');
const imageFile = ref(null);
const loading = ref(false);
const errorDialog = ref(false);
const errorMessage = ref('');

// حالة المنتج مع بيانات افتراضية
const product = ref({
    id: route.params.id, // نحصل على معرف المنتج من الرابط
    name: '',
    description: '',
    price: 0,
    stock: 0,
    weight: 0.5,
    image: ''
});

// دالة لجلب بيانات المنتج من الخادم
onMounted(async () => {
    try {
        loading.value = true;
        // جلب بيانات المنتج من API
        const { data } = await useFetch(`http://127.0.0.1:8000/api/products/${product.value.id}`);

        if (data.value) {
            product.value = { ...product.value, ...data.value };
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        errorMessage.value = 'فشل في تحميل بيانات المنتج';
        errorDialog.value = true;
    } finally {
        loading.value = false;
    }
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
    // التحقق من صحة البيانات
    if (!product.value.name) {
        errorMessage.value = 'اسم المنتج مطلوب';
        errorDialog.value = true;
        return;
    }

    loading.value = true;

    try {
        // إعداد بيانات النموذج
        const formData = new FormData();
        formData.append('name', product.value.name);
        formData.append('description', product.value.description);
        formData.append('price', parseFloat(product.value.price));
        formData.append('stock', parseInt(product.value.stock));
        formData.append('weight', parseFloat(product.value.weight));

        // إضافة الصورة إذا كانت متوفرة
        if (imageFile.value) {
            formData.append('image', imageFile.value);
        }

        // إرسال بيانات المنتج إلى API للتحديث
        const { data } = await useFetch(`http://127.0.0.1:8000/api/products/${product.value.id}`, {
            method: 'PUT',
            body: formData,
            headers: {
                'Accept': 'application/json',
            }
        });

        if (data.value) {
            // إعادة التوجيه إلى قائمة المنتجات بعد التحديث الناجح
            router.push('/products');
        }
    } catch (error) {
        console.error('Error updating product:', error);
        errorMessage.value = error.message || 'فشل في تحديث المنتج. يرجى المحاولة مرة أخرى.';
        errorDialog.value = true;
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
.v-card {
    border-radius: 12px;
}

.text-2xl {
    font-size: 1.5rem;
    line-height: 2rem;
}
</style>