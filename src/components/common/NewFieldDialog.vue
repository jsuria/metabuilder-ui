<template>
    <v-row justify="center">
      <v-dialog
        v-model="dialogVisibility"
        persistent
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">Add a new field</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                >
                  <v-text-field
                    label="Field name*"
                    v-model="new_field"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="dialogVisibility = false"
            >
              Close
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="onSaveNewField"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </template>

<script>
    export default {
        name:'NewFieldDialog',

        props:{
            parent_bus: null
        },

        data() {
            return {
                dialogVisibility: false,
                new_field: null
            }
        },

        created(){
            this.parent_bus.$on('onAddField', () => {
                this.dialogVisibility = true
            })
        },

        methods:{
            onSaveNewField(){
                this.dialogVisibility = false
                const added_field = this.new_field

                this.$emit('savenewfield', {
                    data: added_field
                })

                this.new_field = null
            }
        }
    }
</script>