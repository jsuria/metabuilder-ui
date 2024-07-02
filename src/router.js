import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  /* {
    path: '/',
    name: 'Home',
    component: () => import('@/components/wizard/HomeContent.vue'),
    meta: {
      layout: 'AppLayoutWizard'
    }
  },
  {
    path: '/upload',
    name: 'Upload',
    component: () => import('@/components/wizard/CsvUploadContent.vue'),
    meta: {
      layout: 'AppLayoutWizard'
    }
  },
  {
    path: '/upload-preview',
    name: 'Upload Preview',
    component: () => import('@/components/wizard/CsvPreviewContent.vue'),
    meta: {
      layout: 'AppLayoutWizard'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/components/wizard/DashboardContent.vue'),
    meta: {
      layout: 'AppLayoutWizard'
    }
  },
  {
    path: '/image-selection',
    name: 'Image Selection',
    component: () => import('@/components/wizard/ImageSelectionContent.vue'),
    meta: {
      layout: 'AppLayoutWizard'
    }
  }, */
  {
    path: '/',
    name: 'Workspace',
    component: () => import('@/components/workspace/Workspace.vue'),
    meta: {
      layout: 'AppLayoutWorkspace'
    }
  },
  {
    path: '*',
    name: 'Workspace',
    component: () => import('@/components/workspace/Workspace.vue'),
    meta: {
      layout: 'AppLayoutWorkspace'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router