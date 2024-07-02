<template>
    <div id="content">
        
        <h1 class="font-weight-regular">These columns will be imported</h1>

        <div class="card-note">
            <p class="font-weight-light">The fields below will be used in this session. You can remove those that you don't want to include. You can add more columns later.
            </p>
        </div>
        
        <div class="card-upload">
            <v-chip
                v-for="(item, index) in getChips"
                :key="index"
                class="ma-2"
                close
                @click:close="toggleChip(index, false)"
            >
                {{ item.label }}
            </v-chip>
        </div>
        
    </div>
</template>

<script>

/* eslint-disable */

export default {
    name: 'CsvPreviewContent',

    data()  {
        return { 
            csv_columns: [
                {
                    label:'Company',
                    csv_name: 'col_company',
                    chip_enabled: true
                },
                {
                    label:'Equipment_Tag_No',
                    csv_name: 'col_equipment_tag_no',
                    chip_enabled: true
                },
                {
                    label:'Serial_No',
                    csv_name: 'col_serial_no',
                    chip_enabled: true
                },
                {
                    label:'Brand_Manufacturer',
                    csv_name: 'col_brand_manufacturer',
                    chip_enabled: true
                },
            ]
        }
    },

    computed: {
        getChips() {
            return this.csv_columns.filter(elem => elem.chip_enabled );
        },

        getChip(idx) {
            return this.csv_columns[idx];
        }
    },  

    methods: {
        toggleChip(idx, val){
            this.csv_columns[idx].chip_enabled = val
            console.log(this.csv_columns)
        }
    },
}

</script>

<style>

.card-note {
    display: block; border: 1px solid #0C92A8; width: 511px; padding: 30px; border-radius: 5px;
}

.card-note * {
    color: #0C92A8;
}

.card-upload {
    display: block; width: 511px; padding: 30px 0px 0px 0px;
}

div#content {
  margin: 30px;
}

div#content > h1 {
    margin-bottom: 40px;
}
</style>