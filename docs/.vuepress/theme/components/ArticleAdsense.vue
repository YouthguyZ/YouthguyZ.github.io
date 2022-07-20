<template>
  <div class="adsense-content">
    
    <div style="padding: 2rem 2rem 1rem 2rem" ref="ad1">
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$refs.ad1 && this.appendAdUnit(this.$refs.ad1);
  },
  methods: {
    appendAdUnit(parent) {
      const script = document.createElement("script");
      const ins = document.createElement("ins");
      ins.setAttribute("class", "adsbygoogle");
      ins.setAttribute("data-ad-format", "fluid");
      ins.setAttribute("data-ad-client", "ca-pub-2288127327453255");
      ins.setAttribute("data-ad-layout", "in-article");
      ins.setAttribute("data-ad-slot", "3642716982");
      ins.setAttribute("style", "display:block; text-align:center;");
      script.innerHTML = `
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      `;
      parent.innerHTML = "";
      parent.appendChild(ins);
      parent.appendChild(script);
    },
  },
};
</script>

<style scoped>
.adsense-content {
  margin: 0 auto;
  width: 100%;
}
</style>