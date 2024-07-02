<template>
  <AppLayout>
        <router-view />
    </AppLayout>
</template>

<script>

import AppLayout from '@/layouts/AppLayout.vue'

export default {
  name: 'MetaBuilder',

  /**/   
  components:{
    AppLayout
  } /**/
}
</script>