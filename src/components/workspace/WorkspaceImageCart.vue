<template>
    <div class="card-upload">
        <div class="d-flex justify-start" style="flex-wrap: wrap">
            <v-card
                v-for="(item, index) in getCartItems"
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
</template>

<script>

    export default {
        name: 'WorkspaceImageCart',

        props:{
            image_listing: [],
            parent_bus: null
        },

        created(){
            this.parent_bus.$on('addToCartOnClick', (args) => {
                this.addToCart(args.data.image_id)
            })

            this.parent_bus.$on('removeFromCartOnClick', (args) => {
                this.removeFromCart(args.data.image_id)
            })
        },

        data(){
            return {
                images: this.image_listing,
            }
        },

        computed:{
            getCartItems(){
                return Array.from(this.images).filter(elem => elem.in_cart == true)
            },

            isCartEmpty(){
                return (Array.from(this.images).filter(elem => elem.in_cart == true)).length == 0
            },

            createImagesWithCartProperty(){
                return Array.from(this.images).map((elem) => {                
                    this.$set(elem, 'in_cart', false)
                    this.$set(elem, 'is_selected', false)
                })
            },

        },

        methods:{
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
            },

            setAsActiveImage(image_id){
                Array.from(this.images).forEach((item) => {
                    if(item.id == image_id) item.is_active_workspace_image = true
                })
            }
        },

        mounted(){
            //this.images = Array.from(this.image_listing).filter(elem => elem.id != null);
            this.images = this.createImagesWithCartProperty();
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
</style>