<template>
    
    <v-card
      id="suggestions-ocr"
      elevation="2"
      style="opacity: 0.95; height: auto;"
      class="sidebar-ocr-overlay"
      :class="{ 'mini' : mini}"
  >    
     <v-navigation-drawer
        v-model="drawer"
        :mini-variant.sync="mini"
        style="border: none; width: auto; height: auto;"
        mobile-breakpoint="xs"
      >
   
          <v-list-item class="px-2 grey lighten-3"
              :class="{ 'pt-4' : !mini }"
          >
              <v-list-item-icon class="mx-2">
                <v-badge
                    dot
                    overlap
                    color="pink"
                >
                  <v-icon
                      light
                      medium
                      @click.stop="mini = !mini"
                  >mdi-flash-outline</v-icon>
                </v-badge>
                  
              </v-list-item-icon>

              <v-list-item-content class="mx-1 mt-1">      
                    <v-list-item-title 
                            class="grey--text font-weight-normal mr-4" 
                            v-text="'Suggested fields for your detected text'">
                    </v-list-item-title>

                    <v-sheet
                        v-if="getSuggestions.length > 0"
                        class="grey lighten-3"
                        width="350"
                        style="height: auto; overflow-y: scroll;"
                    >
                        <v-simple-table
                                fixed-header
                                class="ocr-csv-columns"
                                style="background-color: rgba(238, 238, 238,0.5);"
                            >
                                <template v-slot:default>
                                    <thead>
                                        <tr>
                                        <th class="text-left grey lighten-3 grey--text">
                                            Field
                                        </th>
                                        <th colspan="2" class="text-left grey lighten-3 grey--text">
                                            Token
                                        </th>
                                        </tr>
                                    </thead>
                                    <tbody style="overflow: scroll-y">
                                        <tr
                                        v-for="(item, index) in getSuggestions"
                                        :key="index"
                                        >
                                        <td class="text-caption grey--text">{{ item.field }}</td>
                                        <td colspan="2">
                                            {{ item.token }}
                                        </td>                          
                                        </tr>
                                    </tbody>
                                </template>
                        </v-simple-table>
                    </v-sheet>
                </v-list-item-content>

          </v-list-item>
        
      </v-navigation-drawer>
    </v-card>
    
</template>

<script>
    export default {
        name:'WorkspaceSuggestionsOCR',

        props:{
            ocr_keywords:[],
            parent_bus: null,
        },

        created(){
            this.parent_bus.$on('closeOnReset', (args) => {
                this.mini = args.data
            })
        },  

        data () {
            return {
                drawer: true,

                suggested_fields: [],
                //ocr_tokens_cached: this.ocr_keywords,

                mini: true,
            }
        },

        computed:{
            getSuggestions(){
                return this.suggested_fields
            }
        },

        methods:{
          /*   onResetCloseDialog(){
                on_reset_click(this.mini)
            } */
        },

        mounted(){
            this.suggested_fields = [
                {
                    'field':'asset_no',
                    'token':'400A 3P ECB (NEMA 3R) '
                },
                {
                    'field':'uttm_record_thickness',
                    'token':'~2-5.5mm? THHN + 1-5.5mm TW(G) IN 25mme PVC _2—14mm? THHN + 1-5.5mm TW(G) IN 40mme PVC '
                },
                {
                    'field':'asset_tag_id',
                    'token':'63'
                },
                {
                    'field':'asset_company',
                    'token':'REPUBLIC OF THE PHILIPPINES DEPARTMENT OF PUBLIC WORKS AND HIGHWAYS '
                },
                {
                    'field':'uttm_record_type',
                    'token':'ELECTRICAL RISER DIAGRAM'
                }
            ]
        }
    }
</script>

<style>

  #suggestions-ocr.sidebar-ocr-overlay {
      position: fixed;
      right: 5px;
      top: 150px;
      z-index: 9999999;
  }
  
  #suggestions-ocr.sidebar-ocr-overlay.mini {
      right: 5px;
  }
</style>