
<template>
    <v-app id="inspire">
  
      <!-- <v-app-bar
          elevation="4"
          app
          style="left: 450px"
      > -->
      <v-app-bar
          elevation="4"
          app
      >
        <div>
          <img :src="logo" style="width: 52%;" class="mt-2"/>
          <span class="d-block text-caption grey--text font-weight-medium">MetaBuilder OCR</span>
        </div>
        
        <WorkspaceHeader />
  
      </v-app-bar>
      
      <v-main class="grey lighten-2" style="padding:0">
          <router-view/>
      </v-main>
    </v-app>
  
  </template>
  
  <script>
  
  // TODO: Use dynamic imports (lazy)
  /**/ 
  import WorkspaceHeader from '@/components/common/WorkspaceHeader.vue'
  
  export default {
    name: 'AppLayoutWorkspace',
    data: () => ({ 
      drawer: null, 
      logo: '/da_logo_grey.png'
    }),
  
    /**/   
    components:{
      WorkspaceHeader,
    } /**/
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
     html, body {
        margin: 0;
        padding: 0;
        height: 100vh;
        overflow: hidden;
    }

    .app-bar-shadow {
        box-shadow: 1px 4px 6px 1px rgba(0,0,0,0.4);
        -webkit-box-shadow: 1px 4px 6px 1px rgba(0,0,0,0.4);
        -moz-box-shadow: 1px 4px 6px 1px rgba(0,0,0,0.4);
    }
  
    body {
        color: #292929;
        font-weight: 300;
    }
/*   
    .container {
      display: flex;
      padding-bottom: 4px;
    }
  
    .item {
      height: 100px;
      width: 100px;
    }
  
    .item-center { 
      flex-grow: 1; 
    }
  
    .item + .item { 
      margin-left: 0.2%; 
    } */
  </style>