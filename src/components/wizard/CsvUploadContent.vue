<template>
    <div id="content">
        
        <!-- <h1 class="font-weight-regular">Select a CSV Template for Upload</h1>

        <div class="card-note mx-2">
            <p class="font-weight-light">Please ensure the file complies with the following requirements
                <ol class="mt-2">
                    <li>It needs to be a single-line header file.</li>
                    <li>The column names need to be properly comma-separated.</li>
                    <li>It must be a text-compatible file.</li>
                </ol>
            </p>
        </div> -->
        
        <div style="width: 300px" class="mt-5">
            <v-file-input
                :rules="rules"
                accept="text/csv, text/txt"
                placeholder="Upload "
                prepend-icon="mdi-table"
                label="Upload file with columns"
                @change="onFileSelect"
            ></v-file-input>
        </div>

        <div style="width: 700px">
            <v-chip-group column>
                <v-chip
                v-for="(item, index) in getChips"
                :key="index"
                class="ma-2"
                close
                label
                :ripple="false"
                @click:close="toggleChip(index, false)"
            >
                {{ item.field_label }}
            </v-chip>
            </v-chip-group>
        </div>


        
    </div>
</template>

<script>

export default {
    name: 'CsvUploadContent',
    data(){
        return {
            rules: [
                value => !value || value.size < 300000 || 'File size should be less than 300KB!',
            ],
            csv_columns: []
        }
    },

    computed:{
        getChips() {
            return this.csv_columns;
        },
    },

    methods:{
        parseCSV(text, lineTerminator, cellTerminator){
            //break the lines apart
            var lines = text.split(lineTerminator);
            // Get columns
            this.csv_columns = lines[0].split(cellTerminator).map(field => {
                /*
                    field_value:"",
                    is_active: true,
                    field_label: "Analysis Calculated CR LTCR",
                    field_name: "analysis_calculated_cr_ltcr"
                */

                return {
                    field_value: "",
                    is_active: true,
                    field_label: field.trim(),
                    field_name: field.trim()
                }
            })

            this.$emit('setfields', {
                data:{
                    csv_fields: this.csv_columns
                }
            })
        },

        onFileSelect(fileUpload){
            //var files = evt.target.files; // FileList object
            var file = fileUpload;
            console.log('onfileselect file: ', file)

            const that = this

            // Loop through the FileList and populate the 'outputTable' with the data
            var reader = new FileReader();
            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                console.log(theFile)
                return function(e) {
                    //call the parse function with the proper line terminator and cell terminator
                    that.parseCSV(e.target.result, "\n", ",");
                };
            })(file);
            // Read the file as text
            reader.readAsText(file);
        }
    },

    

}

</script>

<style>

.card-note {
    display: block; border: 1px solid #0C92A8; width: 511px; padding: 30px; border-radius: 5px;
}
/* 
.card-note * {
    color: #0C92A8;
} */

/* .card-upload {
    display: block; width: 511px; padding: 30px 0px 0px 0px;
}
 */
div#content {
  margin: 30px;
}

div#content > h1 {
    margin-bottom: 40px;
}
</style>