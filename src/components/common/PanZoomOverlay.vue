<template>
    <v-overlay
        id="canvas-workspace-overlay"
        opacity="0"   
        z-index="1"   
        :value="workspace_overlay"
        @click="toggleOverlay"
    >
        <v-container class="overlay-grids" fluid>
            <v-row>
                <v-col class="grey"></v-col>
                <v-col class="grey"></v-col>
                <v-col class="grey"></v-col>
            </v-row>
            <v-row class="mid-row">
                <v-col class="grey"></v-col>
                <v-col class="porthole">
                    <v-sheet 
                        height="150"
                        style="background-color: transparent"
                        class="d-flex justify-center"
                    >   
                        <v-icon 
                            class="align-self-center"
                            color="green"
                            small
                            light
                            style="opacity: 0.9"
                        >mdi-crosshairs</v-icon>
                    </v-sheet>       
                </v-col>
                <v-col class="grey"></v-col>
            </v-row>
            <v-row>
                <v-col class="grey"></v-col>
                <v-col class="grey d-flex justify-center"><span class="align-self-center">Click on overlay to close</span></v-col>
                <v-col class="grey"></v-col>
            </v-row>
        </v-container>
    
    </v-overlay>

</template>

<script>

export default {
    name: 'PanZoomOverlay',

    props:{
        //overlay_visibility: false,
        parent_bus: null
    },  

    created(){
        this.parent_bus.$on('openOverlayOnSearch', (args) => {
            this.workspace_overlay = args.data  
        })

        this.parent_bus.$on('closeOnReset', () => {
            this.workspace_overlay = false  
        })
    },

    data(){
        return {
            workspace_overlay: false
        }
    },

    methods:{
        toggleOverlay(){
            this.workspace_overlay = !this.workspace_overlay
            //this.$emit('overlay-ontoggle')
        }
    }
}

</script>

<style>
    .overlay-grids {
        width: 100vw;
        height: 100vh;
    }

    .overlay-grids .row:first-child, .overlay-grids .row:last-child {
        height: 36vh !important;
        min-height: 35vh;
    }

    .overlay-grids .row.mid-row .porthole {
        height: 35vh;
    }

    .overlay-grids .row .grey.col {
        opacity: 0.7;
    }

    .overlay-grids .row.mid-row .porthole {
        background-color: transparent;
    }
</style>