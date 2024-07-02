<template>
    
      <v-card
      id="search-ocr"
        elevation="2"
        style="opacity: 0.95; height: auto;"
        class="sidebar-ocr-overlay"
        :class="{ 'mini' : mini}"
    >    
        <v-navigation-drawer
          v-model="drawer"
          :mini-variant.sync="mini"
          style="border: none; width:auto; max-width: 350px; height: auto;"
          mobile-breakpoint="xs"
        >
            <v-list-item class="px-2 grey lighten-3"
                :class="{ 'pt-4' : !mini }"
            >

                <v-list-item-avatar>
                    <v-icon
                        light
                        medium
                        @click.stop="reduceToMini"
                    >mdi-magnify</v-icon>
                </v-list-item-avatar>

                <v-list-item-title>
                    <v-autocomplete
                        v-model="getAutoCompleteList.value"
                        :items="getAutoCompleteList.items"
                        dense
                        label="Search keywords"
                        light
                        class="mt-3 mr-2 text-caption"
                        
                    ></v-autocomplete>

                </v-list-item-title>
                
            </v-list-item>
        
            <v-list-item class="grey lighten-3" v-if="getSearchResultsOCR.length > 0">

                <v-list-item-icon class="mx-1 mt-5">
                    <v-icon
                      light
                      medium
                      color="grey lighten-1"
                    >mdi-feature-search-outline</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-sheet
                        class="grey lighten-3 sheet-hide-system-scrollbar"
                        width="350"
                        style="height: auto; overflow-y: scroll;"
                    >
                        <v-chip-group 
                            column
                        >
                            <v-chip
                                v-for="(item, index) in getSearchResultsOCR"
                                :key="index"
                                :id="item.ocr_token_id"
                                class="d-inline-block ma-1 grey lighten-3"                                            
                                label
                                :ripple="false"
                                :title="item.doc_text"
                                @click="onClickFocusOnOverlay({x1: item.x1, y1: item.y1, id: item.ocr_token_id}, )"
                            >
                                <span class="text-caption grey---text text--lighten-4">{{ (item.doc_text).substring(0,15) }}</span>
                            </v-chip>
                        </v-chip-group>

                    </v-sheet>
                </v-list-item-content>

            </v-list-item>
          
        </v-navigation-drawer>
      </v-card>
      
  </template>

<script>
export default {
  name:'WorkspaceSearchOCR',

  props:{
    ocr_keywords:[],
    parent_bus: null
  },

  created(){
    this.$props.parent_bus.$on('closeOnReset', () => {
        //this.mini = args.data
        this.reduceToMini()
    })
  },

  data () {
    return {
      drawer: true,

      selected_keywords: [],
      ocr_tokens_cached: this.$props.ocr_keywords,

      autocomplete_ocr: {
        items:[],
        values:[],
        value: null
      },
      
      mini: true,
     }
  },

  watch:{
    mini: function(newValue){
        if(!newValue){
            console.log("Search OCR is open")
            this.$emit('search-openocr')
        }
    },

    'ocr_keywords'(newValue, oldValue){
        if(newValue !== oldValue){
            console.log("New keywords!")

            this.ocr_tokens_cached = this.$props.ocr_keywords
            this.initAutoComplete()
        }
    }
  },

  computed:{
        getAutoCompleteList(){
            return this.autocomplete_ocr
        },

        getAutoCompleteCurrentValue(){
            return this.autocomplete_ocr.value
        },

        getSearchResultsOCR(){
            return this.ocr_tokens_cached.filter((item) =>{
            
                if(this.autocomplete_ocr.value){
                    // Remove the symbols
                    const cleanInput = (this.autocomplete_ocr.value).replace(/[^a-zA-Z0-9]/ig, ""),
                        cleanHayStack = (item.doc_text).replace(/[^a-zA-Z0-9]/ig, "")
                
                    return cleanInput !== ""
                    && ([...cleanHayStack.matchAll(cleanInput)].length > 0)    
                }

                return
            })
      },
  },

  methods:{
      // Passes this method to parent component
      onClickFocusOnOverlay(coords){
          this.$emit('search-moveto', coords)
      },

      clearAutoComplete(){
            this.autocomplete_ocr.value = ''
      },

      reduceToMini(){
            this.clearAutoComplete()
            this.mini = !this.mini
      },

      initAutoComplete(){
            this.autocomplete_ocr.items = []
            this.autocomplete_ocr.values = []

            this.ocr_tokens_cached.forEach(token => {
                this.autocomplete_ocr.items.push(token.doc_text.substring(0,15))
                this.autocomplete_ocr.values.push(token.ocr_token_id)
            })
      }
  },

  mounted(){
        console.log('Mounting WorkspaceSearchOCR...') 
       this.initAutoComplete()      
  }
}
</script>

<style>
    .sheet-hide-system-scrollbar::-webkit-scrollbar {
        display: none;
    }

    .sheet-hide-system-scrollbar {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }

    #search-ocr.sidebar-ocr-overlay {
        position: fixed;
        right: 5px;
        top: 70px;
        z-index: 99999999;
    }
    
    #search-ocr.sidebar-ocr-overlay.mini {
        top: 75px;
        right: 5px;
    }

    .grey-transparent {
        background-color: rgba(111, 111, 111, 0.47);
    }

    .ocr-draggable-chip {
        cursor: move;
    }

    .ocr-draggable-chip:hover{
        background-color: orange !important;
        color: white;
        cursor: move;
    }


</style>