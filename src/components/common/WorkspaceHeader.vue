<template>
    <div id="workspace-header" style="width: 100%">
        <v-toolbar
            :class="'elevation-0 white--text d-flex justify-end'"
            style="background-color: transparent; width: 100%;"
            flat
        >
           <!--  <v-btn icon @click="onClickOpenSuggestions($event)">
                <v-icon color="grey">mdi-flash-outline</v-icon>
            </v-btn> -->

            <v-btn icon @click="verifyExit">
                <v-icon color="grey">mdi-content-save</v-icon>
            </v-btn>
          
            <v-btn icon @click="verifyExit">
                <v-icon color="grey">mdi-restart</v-icon>
            </v-btn>

          <!-- <v-btn icon>
            <v-icon color="white">mdi-dots-vertical</v-icon>
          </v-btn> -->
        </v-toolbar>
    </div>
</template>

<script>

export default {
  name: 'NavHeader',

    methods:{
        verifyExit(){
             if(confirm('Leave this page and start over?')) this.$router.push('/dashboard')
        },

     /*    onClickOpenSuggestions(e) {
            e.preventDefault()
            this.$emit('open-suggestions')
        } */
    }

}

</script>

<style>
    
  div#header {
      position: relative;
  }

  div#header h1 {
      height: 80px;
      line-height: 80px;
      margin: 0;    
      color: #fff;
  }

 /*  div#header a {
      position: absolute;
      right: 0;
      top: 23px;
      padding: 10px;
      color: #006;
  } */
</style>