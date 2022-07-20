<template>
  <div class="adsense-content">
    
    <div style="padding: 2rem" ref="ad2">
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$refs.ad2 && this.appendAdUnit(this.$refs.ad2);
  },
  methods: {
    appendAdUnit(parent) {
      const script = document.createElement("script");
      const ins = document.createElement("ins");
      ins.setAttribute("class", "adsbygoogle");
      ins.setAttribute("data-ad-format", "auto");
      ins.setAttribute("data-ad-client", "ca-pub-2288127327453255");
      ins.setAttribute("data-full-width-responsive", true)
      ins.setAttribute("data-ad-slot", "5338463102");
      ins.setAttribute("style", "display:block;");
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