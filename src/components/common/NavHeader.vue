<template>
    <div id="header" style="width: 100%">
        <v-toolbar
            :class="'elevation-0 white--text d-flex justify-end'"
            style="background-color: transparent;"
            flat
        >
            <v-btn icon @click="verifyExit">
                <v-icon color="white">mdi-restart</v-icon>
            </v-btn>
        
            <v-btn icon @click="verifyExit">
                <v-icon color="white">mdi-exit-to-app</v-icon>
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
             if(confirm('Leave this page and start over?')) this.$router.push('/')
        }
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