<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      @click="rail = false"
      class="bg-primary"
    >
      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          value="dashboard"
          to="/dashboard"
        ></v-list-item>
        
        <v-list-group value="Products">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-package-variant"
              title="Products"
            ></v-list-item>
          </template>
          <v-list-item
            v-for="(item, i) in productItems"
            :key="i"
            :value="item.title"
            :title="item.title"
            :to="item.to"
            :prepend-icon="item.icon"
          ></v-list-item>
        </v-list-group>

        <v-list-group value="Categories">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-shape"
              title="Categories"
            ></v-list-item>
          </template>
          <v-list-item
            v-for="(item, i) in categoryItems"
            :key="i"
            :value="item.title"
            :title="item.title"
            :to="item.to"
            :prepend-icon="item.icon"
          ></v-list-item>
        </v-list-group>

        <v-list-item
          prepend-icon="mdi-information"
          title="About Us"
          to="/about"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-email"
          title="Contact Us"
          to="/contact"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-cog"
          title="Settings"
          to="/settings"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="primary" dark>
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="rail = !rail"></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title>Glamour Palace Dashboard</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleTheme">
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>
      <v-btn icon>
        <v-badge content="2" color="error">
          <v-icon>mdi-bell</v-icon>
        </v-badge>
      </v-btn>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            color="primary"
            v-bind="props"
          >
            <v-icon start>mdi-account-circle</v-icon>
            Admin
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in userMenu"
            :key="index"
            :value="index"
            :to="item.to"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-6">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme();
const drawer = ref(true);
const rail = ref(true);

const productItems = [
  { title: 'All Products', to: '/products', icon: 'mdi-format-list-bulleted' },
  { title: 'Add New', to: '/products/add', icon: 'mdi-plus-circle' },
];

const categoryItems = [
  { title: 'All Categories', to: '/categories', icon: 'mdi-format-list-bulleted' },
  { title: 'Add New', to: '/categories/add', icon: 'mdi-plus-circle' },
];

const userMenu = [
  { title: 'Profile', to: '/profile' },
  { title: 'Account Settings', to: '/settings/account' },
];

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
};

const logout = () => {
  // Add logout logic here
  console.log('Logout');
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
