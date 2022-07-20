<template>
  <ParentLayout>
    <MenuAdsense slot="sidebar-bottom"/>
    <ArticleAdsense slot="page-bottom"/>
  </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue';
import ArticleAdsense from '../components/ArticleAdsense.vue';
import MenuAdsense from '../components/MenuAdsense.vue';

export default {
  components: {
    ParentLayout,
    ArticleAdsense,
    MenuAdsense
  }
}
</script>