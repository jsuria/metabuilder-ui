<template>
    <div>
        <v-card
            flat
            :rounded="false"
            style="border:none; border-radius: 0"
        >
            <v-list-item class="grey lighten-3">
               <v-list-item-avatar>
                  <v-icon
                      light
                      medium
                  >mdi-magnify</v-icon>
                </v-list-item-avatar>
                
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
            </v-list-item>   
            
            <v-list-item class="grey lighten-3">
                <v-list-item-content>
                  <v-simple-table
                        fixed-header
                        height="85vh"
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
                                          :id="`dropzone-${item.field_name}`" class="draggable-drop">
                                      </textarea>
                                  </td>                          
                                </tr>
                            </tbody>
                        </template>
                  </v-simple-table>
                </v-list-item-content>
            </v-list-item>
        </v-card>
    <!--
      <v-dialog
        v-model="dialog"
        max-width="500px"
        style="z-index:999999999999999999999999"
      >
        <v-card>
            <v-card-title>
              <span class="text-h5">Edit Item</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>

                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      label="Field value"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="dialog = false"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="alert('Saving')"
              >
                Save
              </v-btn>
            </v-card-actions>

        </v-card>
    
    
      </v-dialog>
    -->
        
    </div>
  </template>
  
  <script>
  
  export default {
    name: 'AppLayoutWorkspaceLeft',

    data() {
      
      return {
        bbox_token_count: 0,
        bbox_tokens: [],

        autocomplete_fields: {
          items:[],
          values:[],
          value: null
        },

        csv_columns:[
        {
          field_value:"",
          is_active: true,
          field_label:"Asset No",
          field_name: "asset_no"
        },
        {
          field_value:"",
          is_active: true,
          field_label:"Asset Platform Location",
          field_name: "asset_platform_location"
        },
        {
          field_value:"",
          is_active: true,
          field_label:"Asset Company",
          field_name: "asset_company"
        },
        {
          field_value:"",
          is_active: true,
          field_label:"Asset Tag ID",
          field_name: "asset_tag_id"
        },
        {
          field_value:"",
          is_active: true,
          field_label:"UTTM Record Type",
          field_name: "uttm_record_type"
        },
        {
          field_value:"",
          is_active: true,
          field_label:"UTTM Record Thickness",
          field_name: "uttm_record_thickness"
        },
        {
          field_value:"",
          is_active: true,
          field_label:"UTTM Record Baseline Inspection Date",
          field_name: "uttm_record_baseline_inspection_date"
        },
        {
          field_value:"",
          is_active: true,
          field_label:"UTTM Record Baseline Initial Thickness",
          field_name: "uttm_record_baseline_initial_thickness"
        },
        {
          field_value:"",
          is_active: true,
          field_label:"UTTM Record Previous Inspection Date",
          field_name: "uttm_record_previous_inspection_date"
        },
        {
          field_value:"",
          is_active: true,
          field_label:"UTTM Record Previous Initial Thickness",
          field_name: "uttm_record_previous_initial_thickness"
        },
        {
          field_value:"",
          is_active: true,
          field_label:"UTTM Record Current Inspection Date",
          field_name: "uttm_record_current_inspection_date"
        },
        {
          field_value:"",
          is_active: true,
          field_label:"UTTM Record Current Initial Thickness",
          field_name: "uttm_record_current_initial_thickness"
        },
        {
          field_value:"",
          is_active: true,
          field_label:"UTTM Record Years Duration Current and Previous",
          field_name: "uttm_record_years_duration_current_previous "
        },
        {
          field_value:"",
          is_active: true,
          field_label:"Analysis Calculated Thickness",
          field_name: "analysis_calculated_thickness"
        },
        {
          field_value:"",
          is_active: true,
          field_label:"Analysis Calculated CR STCR",
          field_name: "analysis_calculated_cr_stcr"
        },
        {
          field_value:"",
          is_active: true,
          field_label: "Analysis Calculated CR LTCR",
          field_name: "analysis_calculated_cr_ltcr"
        }
      ],

        dialog: false
      }
    },

    mounted(){
        this.csv_columns.forEach(field => {
          this.autocomplete_fields.items.push(field.field_label)
          this.autocomplete_fields.values.push(field.field_name)
        })
    },
  
    computed:{
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
        onClickEdit(){
          /*   let defaultValue = "Some value"
            if(prompt('Choose a new value:', defaultValue) !== null){
              console.log('Setting new value ', prompt)
            } */
            this.dialog = true
        },

        onFieldValueChange(){

        },

        onDropValue(that){
          console.log('Value dropped!', that)
          let cellContent = this.$refs[`field_value_${that}`]
          console.log(cellContent.value)
          //let cellContent = this.$refs[`field_value_${that}`]
          //console.log(cellContent)
          //console.log(cellContent[0]['outerText'])
          //console.log(cellContent[0].childNodes[0].data)
        },

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
  
    /*  .drawer-card {
        box-shadow: none; 
        background-color: #f0e5d8 !important; 
        border-radius: 0px !important;
        box-shadow: none !important;
        border: none;
     } */
  </style>