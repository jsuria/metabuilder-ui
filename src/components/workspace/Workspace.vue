<template>
    <div class="workspace content">

        <WorkspaceFieldForm 
            v-if="getCanvasImage !== null && getCSVFields !== null"
            :parent_bus="bus_to_child"
            :csv_fields="getCSVFields"
            @mountedready="onFieldFormLoad"
            @newfieldadded="onNewFieldAdded"
            :key="rerender_key"
        />

        <WorkspaceOCRList
            v-if="getCanvasImage !== null && getCSVFields !== null"
            :ocr_keywords="getOCRKeywords"
            :parent_bus="bus_to_child"
            @list-moveto="onClickFocusOnOverlay"
            @mountedready="onOCRListLoad"
        />

        <WorkspaceSearchOCR
            v-if="getCanvasImage !== null && getCSVFields !== null"
            :ocr_keywords="getOCRKeywords"
            :parent_bus="bus_to_child"
            @search-moveto="onSearchFocusOCR"
            @search-openocr="onSearchOpenDialog"
        />
        
        <WorkspaceSuggestionsOCR
            v-if="getCanvasImage !== null && getCSVFields !== null" 
            :parent_bus="bus_to_child"
        />

        <WorkspacePanZoom
            v-if="getCanvasImage !== null && getCSVFields !== null" 
            :parent_bus="bus_to_child"
            :active_image="getCanvasImage"
        />
        
        <PanZoomControls
            v-if="getCanvasImage !== null && getCSVFields !== null" 
            :btn_controls="btn_controls"
        />

        <PanZoomControls 
            :btn_controls="btn_settings"
        />
        
        <WorkspaceImageSelection 
            :parent_bus="bus_to_child"
            @setactiveimage="onActiveImageUpdate"
            @setfields="onSetFields"
        />
    </div>
</template>

<script>

import Vue from 'vue'

import LoadDragEventListener from '@/helpers/load-drag-event-listener'

import WorkspaceFieldForm from '@/components/workspace/WorkspaceFieldForm.vue'
import WorkspaceOCRList from '@/components/workspace/WorkspaceOCRList.vue'
import WorkspaceSearchOCR from '@/components/workspace/WorkspaceSearchOCR.vue'
import WorkspaceSuggestionsOCR from '@/components/workspace/WorkspaceSuggestionsOCR.vue'
import WorkspaceImageSelection from '@/components/workspace/WorkspaceImageSelection.vue'
import WorkspacePanZoom from '@/components/workspace/WorkspacePanZoom.vue'

import PanZoomControls from '@/components/common/PanZoomControls.vue'

export default {
    name: 'Workspace',

    components:{
        WorkspaceFieldForm,
        WorkspaceOCRList,
        WorkspaceSearchOCR,
        WorkspaceSuggestionsOCR,
        WorkspaceImageSelection,
        WorkspacePanZoom,
        PanZoomControls
    },

    data(){
        return {
            bus_to_child: new Vue(),  // We need to emit clicks to child components
          
            // Needs to be dynamic
            // Changes according to active image
            bbox_data: null,
            canvasImage: null,
            csvFields: null,

            imageLoaded: false,

            btn_controls:[
                {
                    id: 0,
                    ctrl_type: 'reset',
                    cb_action: this.onResetZoom
                },
                {
                    id: 1,
                    ctrl_type: 'zoomout',
                    cb_action: this.onZoomOut
                },
                {
                    id: 2,
                    ctrl_type: 'zoomin',
                    cb_action: this.onZoomIn
                },
            ],

            btn_settings:[
                {
                    id: 3,
                    ctrl_type: 'dialog',
                    cb_action: this.onImageSelectionDialog
                },
            ],

            draggables_ready: 0,

            rerender_key: 0
        }
    },

    computed:{

        getOCRKeywords(){
           return this.bbox_data.map((entity, index) => {
                return {
                    ocr_token_id: `ocr-token-${index}`,  // simply uses index,
                    is_selected: false,                  // toggle used for displaying in bottom area
                    has_suggestions: false,              // toggle used for indicating suggestion matches
                    x1: entity.bbox.x1,
                    x2: entity.bbox.x2,
                    y1: entity.bbox.y1,
                    y2: entity.bbox.x2,
                    doc_text: entity.doc_text
                }
            }) 
        },

        getCanvasImage(){
            return this.canvasImage
        },

        getCSVFields(){
            return this.csvFields
        }
    },

    /**/   
    watch:{
        canvasImage:{
            handler(newValue) {
                if(newValue !== null){
                    this.setTokensCache()
                }
            },
        }, 
       csvFields:{
            handler(newValue, oldValue) {
                if(newValue !== oldValue){
                    console.log('csvFields: ', newValue)
                    //this.initOCREventListeners()
                    this.rerenderOCREventListeners()
                }
            },
            deep: true
        },

        draggables_ready:{
            handler(newValue) {
                if(newValue === 2){
                    this.initOCREventListeners()
                    this.draggables_ready = 0
                }
            },
        }
    },
    /**/

    mounted(){
        // Open settings if no image
        if(this.canvasImage === null){
            this.onImageSelectionDialog()
        } else {
            // Listeners for OCR drag events
            this.setTokensCache()
            //this.initOCREventListeners()
        }  
    },

    beforeDestroy(){
        this.clearStorage()
    },

    methods:{

        onExport(e){
            console.log('Exporting row: ', e)
        },

        onActiveImageUpdate(args){
            console.log("workspace: ", args)
            const newImage = require(`@/assets/listing/${args.data.img_path}`)

            this.canvasImage = newImage
            this.bbox_data = args.data.keywords

            this.bus_to_child.$emit('updateOnActiveImage', {
                data: {
                    active_image: this.canvasImage
                }
            })

            //this.setOCREventListeners()
            this.setTokensCache()
        },

        onSetFields(args){
            console.log('workspace fields: ',args)
            this.csvFields = args.data.csv_fields
            
            this.bus_to_child.$emit('updateOnSetFields', {
                data: {
                    csv_fields: args.data.csv_fields
                }
            })

            //this.initOCREventListeners()    
        },

        onFieldFormLoad(){
            this.draggables_ready++
        },

        onOCRListLoad(){
            this.draggables_ready++
        },

        // Rerun 
        onNewFieldAdded(){
            this.initOCREventListeners()
        },

        induceFormFieldRender(){
            //include re-render of field form
            if(this.rerender_key === 10) this.rerender_key = 0
            this.rerender_key += 1
        },

        /** */  
        initOCREventListeners(){
            //document.addEventListener('DOMContentLoaded', LoadDragEventListener())
            //this.induceFormFieldRender()
            const selectors = '.ocr-draggable-chip-group .ocr-draggable-chip, textarea.draggable-drop'
            LoadDragEventListener(selectors)
        }, 

        rerenderOCREventListeners(){
            this.induceFormFieldRender()
            const selectors = '.ocr-draggable-chip-group .ocr-draggable-chip, textarea.draggable-drop'
            LoadDragEventListener(selectors, true)
        },
        /**/

        setTokensCache(){
             // Get json for bounding boxes
            console.log('Setting token cache:')
            try {
                // Get tokens from active image
                const docTextList = this.bbox_data
                                    //.attributes
                                    //.entities_list

                this.setDocTextCount(docTextList.length)

                // Creates stored data for mapping bbox to image
                docTextList.map((elem, idx) => {
                    this.serializeCoords({key: idx, coords: elem.bbox, text: elem.doc_text})
                })
            } catch(err){
                console.log('JSON issue: ', err)
                console.log(this.bbox_data)
            }
        },

        createElementOnEvent(){
            this.bus_to_child.$emit('openOverlayOnSearch', {
                data: true
            })
        },
        // Need to store these in localStorage
        // as they won't be available within the component
        serializeCoords(docTextObject){
            localStorage.setItem(
                `bbox-token-${docTextObject.key}`, 
                JSON.stringify({
                    ocr_token_id: docTextObject.key,
                    x1: docTextObject.coords.x1,
                    x2: docTextObject.coords.x2,
                    y1: docTextObject.coords.y1,
                    y2: docTextObject.coords.y2,
                    doc_text: docTextObject.text
                })
            )
        },

        // Need get count of tokens an store locally
        setDocTextCount(docTextCount){
            localStorage.setItem('bbox-doctext-count', docTextCount)
        },

        clearStorage(){
            localStorage.clear()
        },

        onClickFocusOnOverlay(coords){
             // eslint-disable-next-line no-unused-vars
            const { x1, y1 } = coords
                    
            this.createElementOnEvent()

            // Reset first
            this.bus_to_child.$emit('moveToOnPanzoom', {
                data: {x: 0, y: 0}
            })

            this.bus_to_child.$emit('zoomToOnPanzoom', {
                data: {x: 0, y: 0, zoom: 0.5, is_smooth: false}
            })
            
            // Go
            this.bus_to_child.$emit('zoomToOnPanzoom', {
                data: {x: x1 - 800, y: y1 - 300, zoom: 2, is_smooth: true}
            })
        },

        /**/  
       onResetZoom(){
            this.bus_to_child.$emit('moveToOnPanzoom', {
                data: {x: 0, y: 0}
            })

            this.bus_to_child.$emit('zoomToOnPanzoom', {
                data: {x: 0, y: 0, zoom: 0.5, is_smooth: true}
            })

            this.bus_to_child.$emit('closeOnReset', {
                data: true
            })
        }, 

        onSearchFocusOCR(coords){
            this.onClickFocusOnOverlay(coords)

            // Emit to OCR draggable list
            console.log("onSearchFocusOCR coords: ", coords)
            this.bus_to_child.$emit('focusOnSearch', {
                data: coords
            })
        },

        onSearchOpenDialog(){
            this.bus_to_child.$emit('openOnSearch')
        },

        onImageSelectionDialog(){
            this.bus_to_child.$emit('openOnImageSelection')
            this.onResetZoom()
        },
        /**/

        onZoomIn(){
            this.bus_to_child.$emit('zoomInOnPanzoom')
        },

        onZoomOut(){
            this.bus_to_child.$emit('zoomOutOnPanzoom')
        },
    }
}

</script>

<style>
    .workspace.content {
        background: rgb(120,103,91);
        background: radial-gradient(circle, rgba(120,103,91,1) 0%, rgba(93,93,93,1) 35%, rgba(125,122,111,1) 100%);
        overflow: hidden;
    }
</style>