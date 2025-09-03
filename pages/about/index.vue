<template>
    <div>
        <div class="d-flex justify-space-between align-center mb-6">
            <h1 class="text-2xl font-bold">About Content</h1>
            <v-btn color="primary" prepend-icon="mdi-plus" to="/about/add">
                Add About Content
            </v-btn>
        </div>

        <v-card>
            <v-card-title class="d-flex align-center">
                <v-text-field v-model="search" append-inner-icon="mdi-magnify" label="Search About" single-line
                    hide-details variant="outlined" density="compact" class="mr-4"></v-text-field>
            </v-card-title>

            <v-data-table :headers="headers" :items="aboutItems" :search="search" :items-per-page="10"
                :loading="loading" class="elevation-1">
                <template v-slot:item.hero_image="{ item }">
                    <v-avatar size="60" rounded="0">
                        <v-img :src="getImageUrl(item.hero_image)" :alt="item.title"></v-img>
                    </v-avatar>
                </template>

                <template v-slot:item.values="{ item }">
                    <span>{{ item.values ? getParsedLength(item.values) : 0 }} values</span>
                </template>

                <template v-slot:item.team="{ item }">
                    <span>{{ item.team ? getParsedLength(item.team) : 0 }} team members</span>
                </template>

                <template v-slot:item.created_at="{ item }">
                    {{ formatDate(item.created_at) }}
                </template>

                <template v-slot:item.updated_at="{ item }">
                    {{ formatDate(item.updated_at) }}
                </template>

                <template v-slot:item.actions="{ item }">
                    <v-btn icon size="small" variant="text" color="primary" :to="`/about/edit/${item.id}`">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon size="small" variant="text" color="error" @click="deleteAbout(item)">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </template>

                <template v-slot:loading>
                    <v-row justify="center" align="center">
                        <v-col cols="12" class="text-center">
                            <v-progress-circular indeterminate color="primary"></v-progress-circular>
                            <div class="mt-2">Loading about content...</div>
                        </v-col>
                    </v-row>
                </template>

                <template v-slot:no-data>
                    <div class="text-center py-4">
                        <p>No about content found.</p>
                        <v-btn color="primary" class="mt-2" to="/about/add">
                            Add Your First About Content
                        </v-btn>
                    </div>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="deleteDialog" max-width="500px">
            <v-card>
                <v-card-title>Delete About Content</v-card-title>
                <v-card-text>
                    Are you sure you want to delete "{{ selectedAbout?.title }}"?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey" @click="deleteDialog = false">Cancel</v-btn>
                    <v-btn color="error" @click="confirmDelete">Delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
            {{ snackbar.message }}
        </v-snackbar>
    </div>
</template>

<script setup>
const { $api } = useNuxtApp();
const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBaseUrl;

const aboutItems = ref([]);
const search = ref('');
const loading = ref(false);
const deleteDialog = ref(false);
const selectedAbout = ref(null);
const snackbar = ref({
    show: false,
    message: '',
    color: 'success'
});

const headers = [
    { title: 'Hero Image', key: 'hero_image', sortable: false, width: '80px' },
    { title: 'Title', key: 'title' },
    { title: 'Tagline', key: 'tagline' },
    { title: 'Values', key: 'values' },
    { title: 'Team', key: 'team' },
    { title: 'Created At', key: 'created_at' },
    { title: 'Updated At', key: 'updated_at' },
    { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
];

// دالة مساعدة لتحليل JSON بأمان
const getParsedLength = (jsonString) => {
    try {
        const parsed = JSON.parse(jsonString);
        return Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length;
    } catch (e) {
        console.error('Error parsing JSON:', e);
        return 0;
    }
};

// دالة مساعدة لتنسيق التاريخ
const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
};

const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/60';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://127.0.0.1:8000${imagePath}`;
};

// جلب بيانات about من API
const fetchAbout = async () => {
    loading.value = true;
    try {
        const { data, error } = await useFetch(`${apiBaseUrl}/about`, {
            onResponse({ response }) {
                console.log('API Response:', response._data);
            },
            onResponseError({ response }) {
                console.error('API Error:', response._data);
            }
        });

        if (error.value) {
            throw new Error(error.value.message || 'Failed to fetch about data');
        }

        aboutItems.value = data.value || [];
    } catch (error) {
        console.error('Error fetching about:', error);
        snackbar.value = {
            show: true,
            message: 'Failed to load about content: ' + error.message,
            color: 'error'
        };
    } finally {
        loading.value = false;
    }
};

const deleteAbout = (about) => {
    selectedAbout.value = about;
    deleteDialog.value = true;
};

const confirmDelete = async () => {
    if (!selectedAbout.value) return;

    try {
        const { error } = await useFetch(`${apiBaseUrl}/about/${selectedAbout.value.id}`, {
            method: 'DELETE'
        });

        if (error.value) {
            throw new Error(error.value.message || 'Failed to delete about content');
        }

        // إزالة العنصر من القائمة المحلية
        aboutItems.value = aboutItems.value.filter(item => item.id !== selectedAbout.value.id);

        snackbar.value = {
            show: true,
            message: 'About content deleted successfully',
            color: 'success'
        };
    } catch (error) {
        console.error('Error deleting about:', error);
        snackbar.value = {
            show: true,
            message: 'Failed to delete about content: ' + error.message,
            color: 'error'
        };
    } finally {
        deleteDialog.value = false;
        selectedAbout.value = null;
    }
};

// جلب البيانات عند تحميل المكون
onMounted(() => {
    fetchAbout();
});
</script>