
<template>
    <v-app id="inspire">
      <v-navigation-drawer
        v-model="drawer"
        app
      >
        <AppLayoutLinks />      
      </v-navigation-drawer>
  
      <v-app-bar 
        height="92"
        :style="'box-shadow: none; background-color: #71695F'"
      app>
        <v-app-bar-nav-icon 
          @click="drawer = !drawer"
          color="white"
        >
        </v-app-bar-nav-icon>
  
        <NavHeader />
  
      </v-app-bar>
  
      <v-main>
          <router-view/>
      </v-main>
    </v-app>
  
  </template>
  
  <script>
  
  // TODO: Use dynamic imports (lazy)
  /**/ 
  import NavHeader from '@/components/common/NavHeader.vue'
  import AppLayoutLinks from '@/layouts/AppLayoutLinks.vue';
  /**/
  
  export default {
    name: 'AppLayoutWizard',
    data: () => ({ drawer: null }),
  
    /**/   
    components:{
      NavHeader,
      AppLayoutLinks,
    } /**/
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
     html, body {
        margin: 0;
        padding: 0;
    }
  
    body {
        color: #292929;
        font-weight: 300;
    }
  
    .container {
      display: flex;
      padding-bottom: 4px;
    }
  
    .item {
      height: 100px;
      width: 100px; /* A fixed width as the default */
    }
  
    .item-center { 
      flex-grow: 1; /* Set the middle element to grow and stretch */
    }
  
    .item + .item { 
      margin-left: 0.2%; 
    }
  </style>