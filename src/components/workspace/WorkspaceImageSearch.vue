<template>
    <div>
            <div class="px-4 py-4">
                <p class="font-weight-light">
                    Choose the images you want to work with. You can also search for the ones you need
                </p>
            </div>
            <div class="card-upload" style="width: 32vw">
                <!-- <v-form>
                    <v-text-field
                        v-model="search_keyword"
                        label="Search"
                    >
                    </v-text-field>
                </v-form> -->

                <v-autocomplete
                    v-model="getAutoCompleteList.value"
                    :items="getAutoCompleteList.items"
                    dense
                    label="Search keywords"
                    light
                    class="mt-3 mr-2 text-caption"
                ></v-autocomplete>

            </div>
            <div class="card-upload">
                <div class="d-flex justify-start" style="flex-wrap: wrap">
                    <v-card
                        v-for="item in getImageListing"
                        :key="item.id"
                        width="156"
                        height="142"
                        class="mx-2 grey lighten-3"
                        :id="`img-thumbnail-${item.id}`"
                    >
                        <v-img
                            max-width="170"
                            max-height="142"
                            aspect-ratio="1"
                            :src="`./listing/${item.img}`"   
                        >
                            <template v-slot:placeholder>
                                <v-row
                                class="fill-height ma-0"
                                justify="center"
                                >
                                <v-progress-circular
                                    indeterminate
                                    color="grey lighten-5"
                                ></v-progress-circular>
                                </v-row>
                            </template>

                            <template>
                                <v-btn
                                    fab
                                    absolute
                                    bottom
                                    right
                                    depressed
                                    rounded
                                    plain
                                    small
                                    style="background: transparent; color: #fff; box-shadow: none; bottom: -5px; right: -5px;"
                                    @click="selectImage(item.id)" 
                                >
                                    <v-icon
                                        color="black"
                                        large                            
                                    >mdi-magnify-plus-outline</v-icon>
                                </v-btn>
                            </template>
                        </v-img>
                        <span class="text-center">{{ item.img }}</span>
                    </v-card>
                </div>

                <v-navigation-drawer
                    absolute
                    permanent
                    floating
                    right
                    :hide-overlay="true"
                    width="350"
                    style="transform: translateX (0) !important; visibility: visible !important;"
                    dark
                    >
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="white--text">Image Cart</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>


                    <v-divider></v-divider>

                    <v-list dense>
                        <v-subheader>Select image for workspace</v-subheader>
                        <v-list-item-group class="d-flex justify-start align-start">
                            <v-list-item
                                v-for="item in getCartItems"
                                :key="item.id"
                                link
                                class="py-1 my-1 mx-1 d-inline-block"
                                
                                @click="setAsActiveImage(item.img)"
                                >
                                <v-list-item-avatar 
                                    :class="{ 'active-image': item.is_active }"
                                    tile
                                >
                                    <v-avatar                                                    
                                        size="50"
                                        tile                                                        
                                    >
                                        <v-img                            
                                            :src="`./listing/${item.img}`"                               
                                        />
                                    </v-avatar>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title class="text-caption font-weight-light">
                                        {{ item.img }}
                                    </v-list-item-title>
                                </v-list-item-content>
                                <v-btn
                                    fab
                                    absolute
                                    bottom
                                    right
                                    depressed
                                    rounded
                                    plain
                                    small
                                    style="background: transparent; color: #fff; box-shadow: none; top: 0px; right: -5px;"                            
                                    @click="removeFromCart(item.id)"
                                >
                                        <v-icon 
                                        light
                                        small
                                        color="white">mdi-delete</v-icon>
                                </v-btn>                        
                            </v-list-item>
                        </v-list-item-group>
                    
                        
                    </v-list>

                    <v-list>
                        <v-list-item 
                            v-for="selected_item in getSelectedImage"
                            :key="selected_item.id"
                            class="grey lighten-1" 
                            style="position: absolute; bottom: 0px; width: 100%; height: 50vh;">

                            <v-list-item-avatar 
                                style="position: absolute; top: 5px; left:12px"
                                tile>
                                <v-avatar                        
                                    tile
                                    size="100"
                                >
                                    <v-img
                                        max-width="100"
                                        max-height="100"                        
                                        :src="`./listing/${selected_item.img}`"   
                                    />
                                </v-avatar>
                            </v-list-item-avatar>

                            <v-list-item-title 
                                class="black--text px-12 py-4"
                                style="position: absolute; top: 8px;"
                            >Text for {{ selected_item.img }}</v-list-item-title>

                            <v-btn 
                                @click="addToCart(selected_item.id)"
                                style="position: absolute; top: 15px; right: 20px;">Add</v-btn>

                            <hr />

                            <v-list-item-content
                                style="position: absolute; top: 60px; left: 3px; width:98%; height: 50vh; overflow-y: scroll; border: 1px solid grey"
                                class="grey lighten-2 hide-system-scrollbar"
                            >                                     
                                <v-chip-group
                                    active-class="primary--text"
                                    column
                                >
                                    <v-chip
                                        v-for="(item, index) in current_keywords"
                                        :key="index"
                                        class="grey lighten-1 d-inline-block ma-2 text-caption black--text"
                                        label        
                                    >
                                        {{ (item.doc_text).substr(0,15) }}
                                    </v-chip>
                                </v-chip-group>
                            </v-list-item-content>
                                
                        </v-list-item>
                    </v-list>

                </v-navigation-drawer>

            </div>
    </div>
    
</template>

<script>

    export default {
        name: 'WorkspaceImageSearch',

        props:{
            prop_images: [],
            parent_bus: null
        },
        
        data(){
            return {
                images_list: [],
                current_keywords:[],
                cartDrawer: false,
                search_keyword:null,

                autocomplete_ocr: {
                    items:[],
                    values:[],
                    value: null
                },
            }
        },

        computed:{
            getImageListing(){
                if(!this.autocomplete_ocr.value) return this.images_list
                return this.images_list.filter(elem => 
                    elem.keywords.includes(this.autocomplete_ocr.value)
                ); 
            },

            getAutoCompleteList(){
                return this.autocomplete_ocr
            },

            getCartItems(){
                return this.images_list
                            .filter(elem => elem.in_cart == true)
            },

            getSelectedImage(){
                return this.images_list
                            .filter(elem => elem.is_selected == true)
            },

            isCartEmpty(){
                return this.images_list
                            .filter(elem => elem.in_cart == true).length == 0
            },

            hasSelectedImage(){
                return this.images_list
                            .filter(elem => elem.is_selected == true).length > 0
            },
        },

        methods:{

            selectImage(image_id){
                // unselect current selection first
                this.unSelectImage();

                this.images_list.forEach((item) => {
                    if(item.id == image_id) {
                        item.is_selected = true
                        this.current_keywords = this.getKeywords(item.attributes.entities_list)
                    }
                });
            },

            unSelectImage(){
                this.images_list.forEach((item) => {
                    if(item.is_selected) item.is_selected = false
                })                
            },

            getKeywords(ocrtextList){                
                /* eslint-disable */
                return [...ocrtextList].sort((a, b) => {                    
                    return 0.25 - Math.random(); 
                });
            },

            clearKeywords(){
                this.current_keywords = []
            },  

            showCart(){
                this.cartDrawer = !this.cartDrawer;
            },

            addToCart(img){
                this.images_list.forEach((item) => {
                    if(item.id == img) item.in_cart = true
                })
            },

            removeFromCart(img){
                if(confirm("Remove this from your cart?")){
                    this.images_list.forEach((item) => {
                        if(item.id == img) item.in_cart = false
                    })
                }        
            },

            setAsActiveImage(img){
                if(confirm("Set as active image?")){

                    this.images_list.forEach((item) => {   
                        // Deactivate existing active image
                        if(item.is_active_image === true) item.is_active_image = false
                    })

                    this.images_list.forEach((item) => {   
                        // Proceed
                        if(item.id == img) {
                            item.is_active_image = true
                        }
                    })

                    this.$emit('setactiveimage', {
                        data:{
                            img_path: img,
                            keywords: this.current_keywords
                        }
                    })
                }        
            },

           /*  initAutoComplete(){
                this.autocomplete_ocr.items = []
                this.autocomplete_ocr.values = []

                let _all_keywords = new Set()

                this.images_list.forEach(img => {
                    img.attributes.entities_list.forEach(entity => {
                        //this.autocomplete_ocr.items.push(entity.doc_text.substring(0,15))
                        //this.autocomplete_ocr.values.push(entity.doc_text.substring(0,15))
                        _all_keywords.add()
                    })
                })
            } */
        },

        mounted(){
            console.log("WorkspaceImageSearch: ", this.$props.prop_images)
            this.images_list = this.$props.prop_images

            let _all_keywords = []

            this.images_list.forEach(img => {

                const _string = img.attributes.entities_list.map(entity => {
                    return entity.doc_text.toLowerCase()
                }).join(' ').replace(/[^a-zA-Z0-9\s]/ig, "")
                
                // Break up into unique array of words
                // and store as new attribute in each image
                const _tokens = [...new Set(_string.split(' '))]

                img['keywords'] = _tokens
                
                // We don't need duplicates in autocomplete, so we dedupe
                const _deduped = [...new Set([..._all_keywords, ..._tokens])]
                                    .filter(word => word.length > 2)
                                    .sort()
                _all_keywords = _deduped
            })

            Array.from(_all_keywords).forEach((keyword) => {
                this.autocomplete_ocr.items.push(keyword)
                this.autocomplete_ocr.values.push(keyword)
            })
        }
    }
</script>

<style>
    .card-upload {
        display: block; width: 80vw; padding: 30px 0px 0px 0px;
    }

    .v-list.list-cart-items .v-list-item:not(.on-hover) {
        opacity: 0.6;
        border: 1px solid gray;
    }

    .active-image {
        border: 2px solid orange;
    }

    .hide-system-scrollbar::-webkit-scrollbar {
        display: none;
    }

    .hide-system-scrollbar {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }
</style>