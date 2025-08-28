<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Dashboard Overview</h1>
    
    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3" v-for="(stat, index) in stats" :key="index">
        <v-card class="pa-4" :color="stat.color" dark>
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-subtitle-2">{{ stat.title }}</div>
              <div class="text-h4 font-weight-bold">{{ stat.value }}</div>
              <div class="text-caption">{{ stat.change }}</div>
            </div>
            <v-avatar :color="stat.avatarColor" size="48">
              <v-icon size="24">{{ stat.icon }}</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Orders -->
    <v-card class="mb-6">
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Recent Orders</span>
        <v-btn color="primary" variant="text" to="/orders">View All</v-btn>
      </v-card-title>
      <v-card-text>
        <v-table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in recentOrders" :key="order.id">
              <td>#{{ order.id }}</td>
              <td>{{ order.customer }}</td>
              <td>{{ order.date }}</td>
              <td>${{ order.amount }}</td>
              <td>
                <v-chip :color="getStatusColor(order.status)" size="small">
                  {{ order.status }}
                </v-chip>
              </td>
              <td>
                <v-btn icon size="small" variant="text">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>

    <!-- Quick Actions -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="h-100">
          <v-card-title>Quick Actions</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6" v-for="(action, i) in quickActions" :key="i">
                <v-btn
                  :prepend-icon="action.icon"
                  variant="outlined"
                  block
                  class="mb-3"
                  :to="action.to"
                >
                  {{ action.title }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Recent Activities</v-card-title>
          <v-card-text>
            <v-timeline side="end" density="compact">
              <v-timeline-item
                v-for="(activity, i) in activities"
                :key="i"
                size="small"
                :dot-color="activity.color"
                :icon="activity.icon"
              >
                <div class="d-flex">
                  <strong class="me-4">{{ activity.time }}</strong>
                  <div>
                    <strong>{{ activity.title }}</strong>
                    <div class="text-caption">
                      {{ activity.description }}
                    </div>
                  </div>
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const stats = [
  {
    title: 'Total Sales',
    value: '24,780',
    change: '+12% from last month',
    icon: 'mdi-currency-usd',
    color: 'primary',
    avatarColor: 'primary-darken-1'
  },
  {
    title: 'Total Orders',
    value: '1,245',
    change: '+5% from last month',
    icon: 'mdi-cart',
    color: 'success',
    avatarColor: 'success-darken-1'
  },
  {
    title: 'Total Customers',
    value: '845',
    change: '+8% from last month',
    icon: 'mdi-account-group',
    color: 'warning',
    avatarColor: 'warning-darken-1'
  },
  {
    title: 'Total Products',
    value: '1,245',
    change: '+15% from last month',
    icon: 'mdi-package-variant',
    color: 'info',
    avatarColor: 'info-darken-1'
  }
];

const recentOrders = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    date: '2023-05-15',
    amount: '125.99',
    status: 'Completed'
  },
  {
    id: 'ORD-002',
    customer: 'Jane Smith',
    date: '2023-05-14',
    amount: '89.50',
    status: 'Processing'
  },
  {
    id: 'ORD-003',
    customer: 'Robert Johnson',
    date: '2023-05-14',
    amount: '210.75',
    status: 'Shipped'
  },
  {
    id: 'ORD-004',
    customer: 'Emily Davis',
    date: '2023-05-13',
    amount: '65.25',
    status: 'Pending'
  },
  {
    id: 'ORD-005',
    customer: 'Michael Wilson',
    date: '2023-05-12',
    amount: '175.30',
    status: 'Completed'
  }
];

const quickActions = [
  {
    title: 'Add Product',
    icon: 'mdi-plus',
    to: '/products/add'
  },
  {
    title: 'Add Category',
    icon: 'mdi-shape-plus',
    to: '/categories/add'
  },
  {
    title: 'View Reports',
    icon: 'mdi-chart-bar',
    to: '/reports'
  },
  {
    title: 'Manage Users',
    icon: 'mdi-account-cog',
    to: '/users'
  }
];

const activities = [
  {
    time: '15 min ago',
    title: 'New order received',
    description: 'Order #ORD-006 from Sarah Miller',
    icon: 'mdi-cart',
    color: 'primary'
  },
  {
    time: '1 hour ago',
    title: 'Product added',
    description: 'New product "Summer Dress" added',
    icon: 'mdi-package-variant-plus',
    color: 'success'
  },
  {
    time: '3 hours ago',
    title: 'New customer registered',
    description: 'New customer John Smith registered',
    icon: 'mdi-account-plus',
    color: 'info'
  },
  {
    time: '5 hours ago',
    title: 'Order shipped',
    description: 'Order #ORD-005 has been shipped',
    icon: 'mdi-truck-delivery',
    color: 'warning'
  }
];

const getStatusColor = (status) => {
  const statusColors = {
    'Completed': 'success',
    'Processing': 'info',
    'Shipped': 'warning',
    'Pending': 'grey',
    'Cancelled': 'error'
  };
  return statusColors[status] || 'grey';
};
</script>
