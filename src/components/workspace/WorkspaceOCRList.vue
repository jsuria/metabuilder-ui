<template>
      <v-card
        rounded="true"
        elevation="2"
        style="position: fixed; top: 70px; left: 455px; z-index: 99999999; height: auto; opacity: 0.95;width:auto; max-width: 460px;"
        color="white"
    >    
        <v-navigation-drawer
          v-model="drawer"
          id="ocr-list-nav"
          :mini-variant.sync="mini"
          style="border: none; width: auto;"
          mobile-breakpoint="xs"
        >
     
            <v-list-item class="grey lighten-3">

                <v-list-item-icon class="mx-1">
                    <v-badge
                        dot
                        overlap
                        color="pink"
                    >
                        <v-icon
                            medium
                            @click.stop="mini = !mini"
                        >mdi-text-recognition</v-icon>
                    </v-badge>
                </v-list-item-icon>

                <v-list-item-content class="mx-1">

                    <v-list-item-title class="grey--text font-weight-normal ml-2 my-2" 
                        v-text="'Drag each OCR text to the left'">
                    </v-list-item-title>
                    <v-sheet
                        class="grey lighten-3 sheet-hide-system-scrollbar"
                        width="350"
                        style="height: 45vh; overflow-y: scroll;"
                    >
                        <v-chip-group
                            class="ocr-draggable-chip-group"
                            column
                        >
                            <v-chip
                                v-for="(item, index) in getFilteredOCR"
                                :key="index"
                                :id="item.ocr_token_id"
                                class="d-inline-block ma-2 ocr-draggable-chip"
                                draggable                                            
                                label
                                :ripple="false"
                                :title="item.doc_text"
                                @drop.prevent
                                @click="onClickFocusOnOverlay({x1: item.x1, y1: item.y1})"
                            >
                                <span class="text-caption">{{ (item.doc_text).substring(0,15) }}</span>
                            </v-chip>
                        </v-chip-group>
                    </v-sheet>
                </v-list-item-content>

            </v-list-item>
            <v-list-item class="grey lighten-3" v-if="getSelectedTokens.length > 0">
                <v-list-item-icon class="mx-1">
                    <v-icon
                        medium
                    >mdi-clipboard-list-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content class="mx-2">
                    <v-sheet
                        class="grey lighten-4 sheet-hide-system-scrollbar"
                        width="350"
                        style="height: auto; max-height: 32vh; overflow-y: scroll;"
                    >
                            <v-chip-group
                                ref="chip_group_selected_ocr"
                                column
                            >
                                <v-chip
                                    v-for="(item, index) in getSelectedTokens"
                                    :key="index"
                                    :id="item.ocr_token_id"
                                    :ripple="false"
                                    class="d-inline-block ma-2 black white--text"
                                    :title="item.doc_text"
                                    @click="onClickFocusOnOverlay({x1: item.x1, y1: item.y1})"
                                >
                                    <span class="text-caption">{{ (item.doc_text).substring(0,15) }}</span>
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
  name:'WorkspaceOCRList',

  props:{
    ocr_keywords:[],
    parent_bus: null
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
    ocr_keywords:{
        handler(newValue, oldValue) {
            if(newValue !== oldValue){
                console.log("New keywords!")

                this.ocr_tokens_cached = this.$props.ocr_keywords
                this.initDraggableChips()
                this.initDraggableEvents()

                this.$emit('mountedready')
            }
        },
        deep: true
    }
  },

  created(){
    this.parent_bus.$on('closeOnReset', (args) => {
        this.mini = args.data
    })

    this.parent_bus.$on('focusOnSearch', (args) => {
        // Open the dialog
        this.mini = false

        console.log("focusOnSearch", args)

        if(document.querySelectorAll('#ocr-list-nav[class*="mini-variant"]').length === 0){
            document.getElementById(args.data.id).scrollIntoView({ behavior: "smooth"})
            document.getElementById(args.data.id).focus()
        }
    })

    this.parent_bus.$on('openOnSearch', () => {
        this.mini = false
    })
  },

  computed:{

      getFilteredOCR(){
          return this.ocr_tokens_cached.filter((item) => {
              if(this.autocomplete_ocr.value && !item.is_selected) {
                return [...item.doc_text.matchAll(this.autocomplete_ocr.value)].length > 0
              }

              return !item.is_selected
          })
      },

      getSelectedTokens(){
        return this.ocr_tokens_cached.filter((token) => token.is_selected )
      },

  },

  methods:{
      // Passes this method to parent component
      onClickFocusOnOverlay(coords){
        console.log(coords)
        this.$emit('list-moveto', coords)
      },

      onDropTest(e){
        e.preventDefault()
        console.log('Calling from native addListener ', e)
      },

      onDropMarkSelected(e){
        console.log('Eeeek! You dropped ', e.detail.draggedchip_id, ' @ ', e.detail.dropzone_id)

        // Prevents chips from becoming drop zones
        if(e.detail.dropzone_valid){
            this.ocr_tokens_cached.forEach((token) => {
                if(token.ocr_token_id == e.detail.draggedchip_id) token.is_selected = true
            })
        }
      },

      initDraggableEvents(){
        // Vue can't detect native JS CustomEvent events (boo)
        document.querySelectorAll('[id^=ocr-token-]').forEach((chip) => {
            console.log('Adding event listener')

            chip.addEventListener('dropchip', (e) =>{
                console.log('Event contents: ', e)
                this.onDropMarkSelected(e)
            })
        })
      },

      initDraggableChips(){
        this.autocomplete_ocr.items = []
        this.autocomplete_ocr.values = []
        
        this.ocr_tokens_cached.forEach(token => {
            this.autocomplete_ocr.items.push(token.doc_text.substring(0,15))
            this.autocomplete_ocr.values.push(token.ocr_token_id)
        })
      },
  },

  mounted(){
        console.log('Mounting WorkspaceOCRList...') 
        this.initDraggableChips()
        this.initDraggableEvents()

        this.$emit('mountedready')
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

    .sidebar-ocr-overlay {
        transition: visibility 1s;
    }
    .grey-transparent {
        background-color: rgba(111, 111, 111, 0.47);
    }

    .ocr-draggable-chip {
        cursor: move;
    }

    .ocr-draggable-chip:focus, .ocr-draggable-chip:hover{
        background-color: orange !important;
        color: white;
        cursor: move;
    }


</style>