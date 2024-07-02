<template>
    <div>
        <PanZoomOverlay
            :parent_bus="bus_to_child"
        />

        <panZoom
            id="panzoom-instance"
            @init="onPanzoomInit"
                ref="panzoomInstance"           
            :options="panzoom_options">
            <canvas 
                id="canvas"
                ref="canvas"
                :title="getActiveImage"
                v-load-image:[getActiveImage]
                @click="getCoordsOnClick"
            ></canvas>
        
        </panZoom>
    </div>

</template>

<script>

    import Vue from 'vue'
    import panZoomLoadImage from '@/directives/panzoom-load-image'
    import PanZoomOverlay from '@/components/common/PanZoomOverlay.vue'

    export default {
        props:{
            parent_bus: null,
            active_image: null,
            //ocr_keywords: []
        },

        components:{
            PanZoomOverlay,
        },

        created(){
            this.parent_bus.$on('moveToOnPanzoom', (args) => {
                this.onMoveTo(args.data)  
            })

            this.parent_bus.$on('zoomInOnPanzoom', () => {
                this.onZoomIn()  
            })

            this.parent_bus.$on('zoomOutOnPanzoom', () => {
                this.onZoomOut()  
            })

            this.parent_bus.$on('zoomToOnPanzoom', (args) => {
                this.onZoomTo(args.data) 
            })

            this.parent_bus.$on('updateOnActiveImage', (args) => {
                this.canvasActiveImage = args.data.active_image 
            })

            this.parent_bus.$on('openOverlayOnSearch', () => {
                this.bus_to_child.$emit('openOverlayOnSearch', {
                    data: true
                })  
            })

            this.parent_bus.$on('closeOnReset', () => {
                this.bus_to_child.$emit('closeOnReset')  
            })
        },

        mounted(){
            this.onInitCenterImage()
        },  

        computed:{
            getActiveImage(){
                console.log("Workspace pan zoom: get active image", this.canvasActiveImage)
                return this.canvasActiveImage
            }
        },
        
        data(){
            return {
                panzoom_options:{
                    bounds: true,
                    minZoom: 0.5, 
                    maxZoom: 1,
                    onDoubleClick: function(e){
                        e.preventDefault()
                        return false
                    },
                    initialZoom: 0.5,
                    autocenter: true,
                },
                canvasActiveImage: this.$props.active_image,
                bus_to_child: new Vue()
            }
        },

        directives:{
            loadImage: panZoomLoadImage
        },

        methods:{
            getCoordsOnClick(ev){
                ev.preventDefault()
                console.log('screen x,y :', ev.screenX, ev.screenY)
                console.log('offset x,y :', ev.offsetX, ev.offsetY)
            },
            onPanzoomInit(){
                console.log('Viewer initialized')
                const pz = document.querySelector('#panzoom-instance')
                console.log(pz)
            },

            onMoveTo(coords){
                this.$refs['panzoomInstance'].$panZoomInstance.moveTo(coords.x,coords.y)
            },

            // Args: x,y,zoom,is_smooth
            onZoomTo(coords){
                if(!coords.is_smooth){
                    this.$refs['panzoomInstance'].$panZoomInstance.zoomTo(
                        coords.x,
                        coords.y, 
                        coords.zoom)
                } else {
                    this.$refs['panzoomInstance'].$panZoomInstance.smoothZoom(
                        coords.x,
                        coords.y, 
                        coords.zoom)
                }
            },

            onZoomIn(){
                this.$refs['panzoomInstance'].$panZoomInstance.zoomTo(0,0,1.5)
            },

            onZoomOut(){
                this.$refs['panzoomInstance'].$panZoomInstance.zoomTo(0,0,0.5)
            },

            onInitCenterImage(){
                this.$refs['panzoomInstance'].$panZoomInstance.moveTo(0,0)
            },

        }
    }
</script>

<style>

#panzoom-instance canvas {
    box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.8) !important;
}

</style>