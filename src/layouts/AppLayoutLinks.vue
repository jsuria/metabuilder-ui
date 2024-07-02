<template>
    <div>
        <v-card
          height="92"
          width="100%"
          class="mx-auto drawer-card"
        >
  
        </v-card> 
  
        <v-card
          v-for="(item, index) in getMenuItems"
          height="100"
          width="100%"
          class="mx-auto py-5 nav-card"
          :class="getCardClass(item)"
          :key="index"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title 
                class="gray--text font-weight-medium"
                >
                <router-link :to="item.link" class="nav-link">
                  {{ item.title }}
                </router-link>
              </v-list-item-title>
              <v-list-item-subtitle 
                class="font-weight-light"
                :class="[isWizardPage ? 'gray--text' : 'white--text',  isActiveWizardPage(item) ? 'white--text' : '']"
              >
                {{ item.description }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
    </div>
  </template>
  
  <script>
  
  export default {
    name: 'AppLayoutLinks',
  
    data() {
      
      return {
        is_wizard_page: false,
  
        menu_items:[
          {
            title: 'New Image Consolidation',
            description: 'Import a CSV template',
            link: '/upload',
            is_wizard: false
          },
          {
            title: 'Step 1',
            description: 'Browse for CSV file',
            link: '/upload',
            is_wizard: true
          },
          {
            title: 'Step 2',
            description: 'Preview uploaded CSV',
            link: '/upload-preview',
            is_wizard: true
          },
          {
            title: 'Step 3',
            description: 'Select initial images for processing',
            link: '/image-selection',
            is_wizard: true
          },
          {
            title: 'Step 4',
            description: 'Manually assign values to cells',
            link: '/dashboard',
            is_wizard: true
          },
        ],
      }
    },
  
    computed:{
        getMenuItems(){
            return this.menu_items.filter(item => item.is_wizard == this.isWizardPage())
        },  
    },
  
    methods:{
  
        getCardClass(prop){
          return {
            'wizard' : this.isWizardPage(),
            'active' : this.isActiveWizardPage(prop)
          }
        },  
  
        isWizardPage(){
            const current_route = this.$route.path
            return ['/upload','/upload-preview','/image-selection', '/dashboard'].includes(current_route)
        },
  
        isActiveWizardPage(item){
            return item.link == this.$route.path;
        }
  
    },
  }
  
  </script>
  
  <style>   
   
     .nav-card {
        box-shadow: none; 
        border-radius: 0px !important; 
        background-color: #000 !important;      
        box-shadow: none !important;
        border-bottom: 1px solid rgb(196, 196, 196) !important;
     }
  
     .nav-card:not(.wizard) .v-list-item__subtitle {
        color: #fff !important;
     }
  
     .nav-card.wizard {
        background-color: #fff !important;      
     }
  
     .nav-card.wizard .v-list-item__content .nav-link {
        color: #A5A3A3 !important;
     }
  
     .nav-card.wizard.active {
        background-color: #076687 !important;
     }
  
     .nav-card.wizard.active .v-list-item__content .nav-link,
     .nav-card.wizard.active .v-list-item__content .nav-link
     {
        color: #fff !important;
     }
  
     .v-list-item__content .nav-link {
        color: #fff !important;
        text-decoration: none;
        font-weight:400;
     }
  
     .drawer-card {
        box-shadow: none; 
        background-color: #D78423 !important; 
        border-radius: 0px !important;
        box-shadow: none !important;
     }
  </style>