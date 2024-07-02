<template>
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        style="z-index:999999999999999999;"
        rounded="false"
      >
     
        <v-card
            flat
            style="border-radius: 0;"
        >
          <v-toolbar
            dark
            color="grey"
          >
        
            <v-toolbar-title>Image Selection</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn
                :disabled="!fields_initiated || !image_initiated"
                dark
                text
                @click="dialog = false"
              >
                Done
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>

        <v-tabs 
            vertical 
            fixed-tabs
            class="px-5 py-1"
            height="120"
        >
            <v-tab>
                <div class="ml-2 font-weight-regular text-capitalize text-subtitle-1 black--text ">
                    Choose images    
                </div>
            </v-tab>
            <v-tab :disabled="!image_initiated">
                <div class="ml-5 font-weight-regular text-capitalize text-subtitle-1 black--text">
                    Column settings    
                </div>
            </v-tab>

            <v-tab-item>
                <v-card flat class="grey lighten-4" style="height: 88vh">
                    <v-card-text>
                        <WorkspaceImageSearch 
                          :prop_images="getImages"
                          :parent_bus="bus_to_child"
                          @setactiveimage="onActiveImageUpdate"
                        />
                    </v-card-text>
                </v-card>
            </v-tab-item>
            <v-tab-item>
                <v-card flat class="grey lighten-4">
                    <v-card-text>
                       <CsvUploadContent 
                          @setfields="onFieldsUpdate"
                       />
                    </v-card-text>
                </v-card>
            </v-tab-item>
        </v-tabs>

        </v-card>
      </v-dialog>
    </v-row>
  </template>

<script>

import Vue from 'vue'
import api from '@/service/api'
import WorkspaceImageSearch from '@/components/workspace/WorkspaceImageSearch.vue'
import CsvUploadContent from '@/components/wizard/CsvUploadContent.vue'

export default {
  name:"WorkspaceImageSelection",
  
  created(){
    this.parent_bus.$on('openOnImageSelection', () => {
        this.dialog = true
    })
  },

  props:{
    parent_bus: null,
  },

  data () {
    return {
        bus_to_child: new Vue(),
        dialog: false,
        image_list: [],
        image_initiated: false,
        fields_initiated: false
    }
  },

  components:{
        WorkspaceImageSearch,
        CsvUploadContent
  },
  
  methods:{
    createImagesWithCartProperty(imagesPayload){
        imagesPayload.forEach((elem, index) => {                
            elem.in_cart = false
            elem.is_selected = false
            elem.is_active_image = false
            elem.id = index
        })

        return imagesPayload
    },

    onActiveImageUpdate(args){
      console.log("imageselection: ", args)
      this.image_initiated = true
      this.$emit('setactiveimage', {
        data: args.data
      })
    },

    onFieldsUpdate(args){
      this.fields_initiated = true
      this.$emit('setfields', {
        data: args.data
      })
    }
  },
  
  computed:{
    getImages(){
        return this.image_list
    }
  },

  mounted(){
    api.getMockImages().then((response) => {
          this.image_list = this.createImagesWithCartProperty(response)
    })
   
  }
}
</script>
