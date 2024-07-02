<template>
    <div id="content">
    
        <h1 class="font-weight-regular">Select Initial Images</h1>

        <div class="card-note">
            <p class="font-weight-light">
                Choose the images you want to work with. You can also search for the ones you need
            </p>
        </div>

        <div class="card-upload" style="width: 32vw">
            <v-form>
                <v-text-field
                    v-model="search_keyword"
                    label="Search"
                >
                </v-text-field>
            </v-form>
        </div> 
        
        
        <div class="card-upload">
            <div class="d-flex justify-start" style="flex-wrap: wrap">
                <v-card
                    v-for="(item, index) in getImages"
                    :key="index"
                    width="156"
                    height="142"
                    class="mx-2 my-2 grey lighten-3"
                    :id="`img-thumbnail-${index}`"
                    :title="item.download_url"
                >
                    <v-img
                        max-width="170"
                        max-height="142"
                        aspect-ratio="1"
                        :src="item.download_url"   
                    >
                        <template v-slot:placeholder>
                            <v-row
                            class="fill-height ma-0"
                            align="center"
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
                                    light    
                                    small                            
                                >mdi-magnify-plus-outline</v-icon>
                            </v-btn>
                        </template>
                    </v-img>
                </v-card>
            </div>
        </div>

        <v-fab-transition>
            <v-btn
            style="background-color: #D78423; z-index: 999999;"
            dark
            fixed
            bottom
            right
            fab
            @click="showCart(); unSelectImage()"
            >
            <v-icon>mdi-cart</v-icon>
            </v-btn>
        </v-fab-transition>

        <v-navigation-drawer
            v-model="drawer"
            fixed
            temporary
            right
            class="black"
            style="width: 30vw"

            >         
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="white--text">Image Cart</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

         
            <v-divider></v-divider>

            <v-list-item v-if="isCartEmpty">
                <v-list-item-content>
                    <v-list-item-title class="white--text font-weight-light">You have no images.</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list class="list-cart-items" dense v-else>
                <v-list-item
                    v-for="item in getCartItems"
                    :key="item.title"
                    link
                    class="py-1 my-1 mx-1 rounded d-inline-block"
                >
                    <v-list-item-avatar                         
                        tile>
                        <v-avatar                                                    
                            size="50"
                            tile                                                        
                        >
                            <v-img                            
                                :src="item.download_url"                               
                            />
                        </v-avatar>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title class="white--text font-weight-regular text-caption text-center">Image ID {{ item.id }}</v-list-item-title>
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
            </v-list>

            <v-divider></v-divider>

            <!-- Image preview -->

            <v-list-item v-if="!hasSelectedImage">
                <!-- <v-list-item-content>
                    <v-list-item-title class="white--text font-weight-light">Please select an image.</v-list-item-title>
                </v-list-item-content> -->
            </v-list-item>

            <v-list-item 
                v-else
                v-for="selected_item in getSelectedImage"
                :key="selected_item.id"
                class="grey" style="position: absolute; bottom: 0px; width: 100%; height: 60vh;">

                <v-list-item-avatar 
                    style="position: absolute; top: 10px;"
                    tile>
                    <v-avatar                        
                        tile
                        size="100"
                    >
                    <v-img
                        max-width="100"
                        max-height="100"                        
                        :src="selected_item.download_url"   
                    />
                    </v-avatar>
                </v-list-item-avatar>

                <v-list-item-title 
                    class="black--text font-weight-regular px-12 py-4"
                    style="position: absolute; top: 10px; font-size: 20px;"
                >OCR Text</v-list-item-title>

                <v-btn 
                    @click="addToCart(selected_item.id)"
                    style="position: absolute; top: 20px; right: 20px;">Add</v-btn>

                <hr />

                <v-list-item-content
                style="position: absolute; top: 60px; left: 6px"
                >                                     
                    <v-chip-group
                        active-class="primary--text"
                        column
                    >
                        <v-chip
                            v-for="(item, index) in current_keywords"
                            :key="index"
                            class="white d-inline-block ma-2"                                            
                            label        
                        >
                            {{ item }}
                        </v-chip>
                    </v-chip-group>
                </v-list-item-content>                
            </v-list-item>

        </v-navigation-drawer>
    
    </div>
</template>

<script>

    import axios from 'axios'
    import queries from '@/config/queries'

    export default {
        name: 'ImageSelectionContent',

        data() {
            return {
                images: new Set(),
                //cart: new Set(),
                overlay_absolute: true,
                overlay_visible: false,

                drawer: null,

                current_keywords:[],

                search_keyword: '',
            }
        },

        computed:{
            getImages(){
                if(!this.search_keyword) return Array.from(this.images).filter(elem => elem.id != null);
                return Array.from(this.images).filter(elem => 
                    [...elem.keywords_alpha, ...elem.keywords_numeric].includes(this.search_keyword)
                ); 
            },


            getSelectedImage(){
                return Array.from(this.images).filter(elem => elem.is_selected == true)
            },

            createImagesWithCartProperty(){
                return Array.from(this.images).map((elem) => {                
                    this.$set(elem, 'in_cart', false)
                    this.$set(elem, 'is_selected', false)
                })
            },

            getCartItems(){
                return Array.from(this.images).filter(elem => elem.in_cart == true)
            },

            isCartEmpty(){
                return (Array.from(this.images).filter(elem => elem.in_cart == true)).length == 0
            },

            hasSelectedImage(){
                return Array.from(this.images).filter(elem => elem.is_selected == true).length > 0
            }
        },

        methods:{

            getAuthToken(){
                return JSON.parse(localStorage.getItem("user")).token
            },

            getDiagrams(){

                if(!this.getAuthToken()) { 
                    alert("Elasticdocs session expired. Please log in to you account.")
                    return 
                } // redirect to blank page

                const authToken = this.getAuthToken()
                const endpoint = "https://stg.api.elastic-docs.irayaenergies.xyz/search/"
                
                const payload = {
                    params: {
                        q: queries.diagram,
                        page_size: 300,
                        page_from: 0 
                    },
                    headers: { "Authorization":`JWT ${authToken}` }
                }

                axios.get(endpoint, payload)
                    .then((response) => {                    
                        this.images = response.data.search_results
                        // Insert "in_cart" property for flagging cart use
                        // this.images = this.createImagesWithCartProperty();
                    })
                    .catch((error) => {
                        // handle error
                        console.log(error);
                    })
                    .finally(() => {
                        // always executed
                        // Insert "in_cart" property for flagging cart use
                        this.images = this.createImagesWithCartProperty();
                    });
            },
       
            selectImage(image_id){

                // unselect current selection first
                this.unSelectImage();
                
                Array.from(this.images).forEach((item) => {
                    if(item.id == image_id) {
                        item.is_selected = true
                        //console.log(item)
                        this.current_keywords = this.getKeywords(item)
                    }
                });

                this.showCart();
            },

            getKeywords(obj){                
                /* eslint-disable */
                return [...obj.keywords_alpha, ...obj.keywords_numeric].sort((a, b) => {                    
                    return 0.25 - Math.random(); 
                });
            },

            clearKeywords(){
                this.current_keywords = []
            },  
            
            unSelectImage(){
                Array.from(this.images).forEach((item) => {
                    if(item.is_selected) item.is_selected = false
                })                
            },

            showCart(){
                this.drawer = !this.drawer;
            },

            addToCart(image_id){
                Array.from(this.images).forEach((item) => {
                    if(item.id == image_id) item.in_cart = true
                })
            },

            removeFromCart(image_id){
                if(confirm("Remove this from your cart?")){
                    Array.from(this.images).forEach((item) => {
                        if(item.id == image_id) item.in_cart = false
                    })
                }        
            }
        },

        mounted(){
            const endpoint = "https://my.api.mockaroo.com/images_with_keywords.json?key=ccef3e10"

            axios.get(endpoint)
                .then((response) => {                    
                    this.images = response.data
                    // Insert "in_cart" property for flagging cart use
                    this.images = this.createImagesWithCartProperty();
                })
                .catch((error) => {
                    // handle error
                    console.log(error);
                })
                .finally(() => {
                    // always executed
                });
        }


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
    display: block; width: 80vw; padding: 30px 0px 0px 0px;
}

.v-list.list-cart-items .v-list-item:not(.on-hover) {
  opacity: 0.6;
  border: 1px solid gray;
 }

div#content {
  margin: 30px;
}

div#content > h1 {
    margin-bottom: 40px;
}
</style>