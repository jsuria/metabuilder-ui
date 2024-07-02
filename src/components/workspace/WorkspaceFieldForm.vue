<template>
    <v-card
        elevation="2"
        style="position: fixed; top: 70px; left: 3px; z-index: 99999999; opacity: 0.95; height: auto;"
    >
        <v-navigation-drawer
            v-model="navDrawer"
            style="border: none; width:450px; max-width: 450px; overflow: hidden;"
            :mini-variant.sync="mini"
            mobile-breakpoint="xs"
            class="grey lighten-3"
        >       
                <v-list-item class="grey lighten-3">

                    <v-list-item-icon
                        :class="{ 'pt-4' : !mini }"
                    >
                        <v-icon
                            light
                            medium
                            @click.stop="mini = !mini"
                        >mdi-magnify</v-icon>
                    </v-list-item-icon>
                    
                    <v-list-item-content>

                        <v-list-item-title>
                            <v-autocomplete
                                v-model="autocomplete_fields.value"
                                :items="autocomplete_fields.items"
                                dense
                                label="Filter fields"
                                light
                                class="mt-5 mr-5 text-caption"                        
                            ></v-autocomplete>
                        </v-list-item-title>

                        
                        <v-sheet
                            class="grey lighten-3"
                            width="400"
                            style="height: auto; overflow-y: scroll;"
                        >
                            <v-simple-table
                                    fixed-header
                                    height="75vh"
                                    class="ocr-csv-columns"
                                    style="background-color: rgba(238, 238, 238,0.5);"
                                >
                                    <template v-slot:default>
                                        <thead style="height: 65px" >
                                            <tr>
                                            <th class="text-left grey lighten-3 grey--text">
                                                Header
                                            </th>
                                            <th colspan="2" class="text-left grey lighten-3 grey--text">
                                                Value
                                            </th>
                                            </tr>
                                        </thead>
                                        <tbody style="overflow: scroll-y">
                                            <tr
                                            v-for="(item, index) in getSearchResultsFields"
                                            :key="index"
                                            >
                                            <td class="text-caption grey--text">{{ item.field_name }}</td>
                                            <td colspan="2">
                                                <textarea
                                                    :v-model="item.value" 
                                                    :id="`${item.field_name}`" 
                                                    @dragstart.prevent
                                                    @droptext="onTextareaChange"
                                                    @blur="onTextareaKeyboardChange"
                                                    class="draggable-drop">
                                                </textarea>
                                            </td>                          
                                            </tr>
                                        </tbody>
                                    </template>
                            </v-simple-table>
                            <v-footer class="d-flex justify-space-around py-4">
                                <v-btn depressed dark @click="onAddField">
                                    New Field
                                </v-btn>
                                <v-btn depressed dark @click="onSaveExportRow">
                                    Add to CSV
                                </v-btn>

                            </v-footer>
                        </v-sheet>
                    </v-list-item-content>
                </v-list-item>
        </v-navigation-drawer>
        <NewFieldDialog
            :parent_bus="bus_to_child"
            @savenewfield="onSaveNewField"
        />
        <CsvExportDialog 
            :parent_bus="bus_to_child"
            @clearformfields="onClearFields"
        />

    </v-card>
  </template>
  
  <script>

  import Vue from 'vue'
  import NewFieldDialog from '@/components/common/NewFieldDialog.vue'
  import CsvExportDialog from '@/components/common/CsvExportDialog.vue'
  
  export default {
    name: 'WorkspaceFieldForm',

    props:{
        parent_bus: null,
        csv_fields: []
    },  

    components:{
        NewFieldDialog,
        CsvExportDialog
    },

    created(){
        this.parent_bus.$on('updateOnSetFields', (args) => {
            console.log('workspace field form: ', args)
            this.csv_columns = args.data.csv_fields
        })
    },

    watch:{
        csv_columns:{
            handler(newValue, oldValue) {
                if(newValue !== oldValue){
                    console.log("New fields")

                    this.csv_columns = this.$props.csv_fields
                    this.initAutoCompleteFilter()

                    this.$emit('mountedready')
                }
            },
            deep: true
        }
    },

    data() {
      
      return {
        bbox_token_count: 0,
        bbox_tokens: [],
        navDrawer: null,

        autocomplete_fields: {
          items:[],
          values:[],
          value: null
        },

        csv_columns: this.$props.csv_fields,

        dialog: false,
        mini: false,
        dialogVisibility: false,
        bus_to_child: new Vue(),

        cached_exported_fields:[]
      }
    },

    mounted(){
        console.log('Mounting WorkspaceFieldForm...')
        this.initAutoCompleteFilter()

        this.$emit('mountedready')
    },
  
    computed:{
        getDialogVisibility(){
            return this.dialog
        },
        getFieldItems(){
            return this.csv_columns.filter(item => item.is_active)
        },

        getSearchResultsFields(){
            if(this.autocomplete_fields.value) {
              return this.csv_columns.filter((item) => 
                  [...item.field_label.matchAll(this.autocomplete_fields.value)].length > 0    
              )
            }

            return this.csv_columns
        }
    },

    methods:{

        onTextareaChange(e){
            this.csv_columns.forEach(row => {
                if(row.field_name === e.detail.field_name) row.field_value = e.detail.dropped_text 
            })
        },

        onTextareaKeyboardChange(e){
            if(e.target.value){
                this.csv_columns.forEach(row => {
                    if(row.field_name === e.target.id) row.field_value = e.target.value 
                })
            }
        },

        initAutoCompleteFilter(){
            this.csv_columns.forEach(field => {
                this.autocomplete_fields.items.push(field.field_label)
                this.autocomplete_fields.values.push(field.field_name)
            })
        },

        onSaveExportRow(){
            if(confirm('Add this row to CSV?')){
                this.cached_exported_fields.push(this.csv_columns)

                console.log('cached exported fields ', this.cached_exported_fields)

                this.bus_to_child.$emit('onExportCSV',{
                    data: this.cached_exported_fields
                })
            }
        },

        onAddField(){
            this.bus_to_child.$emit('onAddField')
        },

        onSaveNewField(e){
            const current_length = this.csv_columns.length

            const new_length = this.csv_columns.push({
                field_label: e.data,
                field_name: e.data,
                field_value: '',
                is_active: true
            })

            // Due to race conditions, we need to verify first if 
            // if the new field is in the container
            const new_field = this.csv_columns.filter(elem => elem.field_label === e.data)[0]

            if((new_length > current_length) && (new_field.field_name === e.data)) {
                this.$emit('newfieldadded')
            }
        },

        onClearFields(){
            this.csv_columns.forEach(row => {
                row.field_value = '' 
            })
        }

    },
  }
  
  </script>
  
  <style> 
    .v-data-table.ocr-csv-columns table {
      table-layout: fixed;
    }

    .v-data-table.ocr-csv-columns table tbody td {
        width: 40% !important;
        word-break: break-all !important;
    }

    textarea.draggable-drop {
      width: 100%;
      height: 64px;
      border: 1px solid #e0e0e0;
      border-radius: 2px;
      background-color: #fff;
    }
    
    .v-data-table.ocr-csv-columns table tbody td + td {
        width: 60% !important;
    }

    .v-data-table.ocr-csv-columns table tbody tr {
        height: 80px !important;
    }
   
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

  </style>