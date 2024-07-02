import MetaBuilder from "./MetaBuilder.vue";

/* eslint-disable */

const MetabuilderPlugin = {
 install(Vue, options) {
  // Let's register our component globally
  // https://vuejs.org/v2/guide/components-registration.html
  Vue.component("meta-builder", MetaBuilder);
 }
};

// Automatic installation if Vue has been added to the global scope.
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(MetabuilderPlugin);
}

export default MetabuilderPlugin;