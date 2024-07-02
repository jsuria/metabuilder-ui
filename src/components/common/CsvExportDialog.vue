<template>
    <v-row justify="center">
      <v-dialog
        v-model="dialogVisibility"
        persistent
        max-width="80vw"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">Export CSV</span>
          </v-card-title>
          <v-card-text>
            <v-data-table
                :headers="getCsvHeaders"
                :items="getCsvData"
                :items-per-page="305"
                class="elevation-0"
                height="70vh"
                fixed-header
            ></v-data-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="onCloseDialog"
            >
              Back
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="onSaveCSV"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
</template>

<script>
    import ObjectToCsv from '@/helpers/object-to-csv'
    //import FileSavePicker from '@/helpers/file-save-picker'
    import { saveAs } from 'file-saver'

    export default {
        name:'CsvExportDialog',

        props:{
            parent_bus: null
        },

        data() {
            return {
                dialogVisibility: false,
                table_data: [],
                table_headers: []
            }
        },

        created(){
            this.parent_bus.$on('onExportCSV', (args) => {
                this.dialogVisibility = true

                // Get headers from first item keys
                this.table_headers = Object.entries(args.data[0]).map((column) => {
                                       
                    return {
                        text: column[1].field_label,
                        value: column[1].field_name,
                        align: 'start'
                    }
                })

                const row_data = args.data[0].map((elem) => {
                    
                    let obj = {}
                    obj[elem.field_label] = elem.field_value
                    return obj
                })

                this.table_data.push(Object.assign(...row_data))

                console.log(this.table_data)
                console.log(this.table_headers)
            })
        },

        computed:{
            getCsvHeaders(){
                return this.table_headers
            },

            getCsvData(){
                return this.table_data
            }
        },

        methods:{
            onSaveCSV(){
                const csvString = ObjectToCsv({
                    data: this.table_data
                })


                const csvBlob = new Blob([csvString], {type: "text/plain;charset=utf-8"})

                // Generate timestamp for filename
                const timeStamp = Date.now()

                const fileName = `csv_export_${timeStamp}.csv`

                //const promptFilename = window.prompt('Enter a filename')

                saveAs(csvBlob, fileName)
            },

            onCloseDialog(){
                this.dialogVisibility = false
                if(!confirm('Preserve form values?')){
                    this.$emit('clearformfields')
                }
            }
        }
    }
</script>