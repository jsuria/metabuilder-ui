<template>
    <div id="because-vue-says-so">
        <v-fab-transition
            v-for="btn in getToolbarItems"
            :key="btn.id"
        >
            <v-btn
                class="fab-controls"
                :class="{ 'r-100': btn.id === 1, 'r-200' : btn.id === 2, 'r-300' : btn.id === 3}"
                dark
                fixed
                bottom
                right
                fab
                @click="btn.cb_action"
            >
                <v-icon>{{ getControlType(btn.ctrl_type) }}</v-icon>
            </v-btn>
        </v-fab-transition>
    </div>
        
</template>

<script>

export default{
    name:'PanZoomControls',
    props:{
        btn_controls: [] // { <control_type>, <callback()> }
    },

    data(){
        return {
            toolbar_items: this.$props.btn_controls
        }
    },

    computed:{

        getToolbarItems(){
            return this.toolbar_items
        },
    },
    methods:{
        onZoomOut(){
            this.$props.on_click()
        },

        onFabClick(cbAction){
            cbAction()
        },
        getControlType(controlType){
            switch(controlType){
                case 'reset': return 'mdi-restart'
                case 'zoomout' : return 'mdi-minus'
                case 'zoomin': return 'mdi-plus'
                case 'dialog': return 'mdi-image-multiple-outline'
            }
        }
    }
}
</script>

<style>
    .fab-controls {
        background-color: #000; 
        z-index: 999999;
    }

    .fab-controls.r-100 {
        right: 100px        
    }

    .fab-controls.r-200 {
        right: 200px        
    }

    .fab-controls.r-300 {
        right: 300px        
    }
</style>