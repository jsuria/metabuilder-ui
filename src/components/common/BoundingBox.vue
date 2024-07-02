<template>
    <div class="box-wrapper">
        <div class="box" 
            :style="box_style">
        </div>
    </div>
</template>

<script>
    export default {
        name: "Box",
        props: {
            bTop: {
                type: Number,
                default: 0
            },
            bLeft: {
                type: Number,
                default: 0
            },
            bWidth: {
                type: Number,
                default: 0
            },
            bHeight: {
                type: Number,
                default: 0
            },
        },

        data(){
            return {
                box_style:{
                    top: this.bTop + 'px', 
                    left: this.bLeft + 'px', 
                    width: this.bWidth + 'px', 
                    height: this.bHeight + 'px'
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .box {
        position: absolute;
        border: 2px #a40000 solid;

        &:hover, &.active {
            background-color: rgba(144, 238, 144, .2);
        }

        z-index: 3;
    }
</style>