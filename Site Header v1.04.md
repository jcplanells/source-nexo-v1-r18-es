# Site Header — v1.04

**Fecha:** 2026-09-03
**Ubicación en Ghost:** Configuración → Código inyectado → Encabezado del sitio (Site Header)

## Cambios respecto a v1.03

- Se **elimina** `<meta http-equiv="refresh" content="300">` del Code Injection.
  El auto-refresco cada 5 min ahora vive en el tema (`default.hbs`), envuelto en
  `{{#is "home"}}`, así solo recarga la portada y no el resto del sitio.
- Contenido depurado: Google Analytics (GA4), Marfeel SDK, Umami, captura de
  `article:section` para Marfeel, fuentes (Host Grotesk), Google AdSense.
- Bloque de Elecciones Colombia 2026 queda comentado / desactivado.

## Contenido actual del Site Header

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-8WN0SK791L"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-8WN0SK791L', {
    send_page_view: true
  });
</script>

<!-- Marfeel -->
<script type="text/javascript">
!function(){"use strict";function e(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],c=document.createElement("script");c.src=e,t?c.type="module":(c.async=!0,c.type="text/javascript",c.setAttribute("nomodule",""));var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(c,n)}!function(t,c){!function(t,c,n){var a,o,r;n.accountId=c,null!==(a=t.marfeel)&&void 0!==a||(t.marfeel={}),null!==(o=(r=t.marfeel).cmd)&&void 0!==o||(r.cmd=[]),t.marfeel.config=n;var i="https://sdk.mrf.io/statics";e("".concat(i,"/marfeel-sdk.js?id=").concat(c),!0),e("".concat(i,"/marfeel-sdk.es5.js?id=").concat(c),!1)}(t,c,arguments.length>2&&void 0!==arguments[2]?arguments[2]:{})}(window,10951,{} /* Config */)}();
</script>

<!-- Umami -->
<script defer src="https://stats.nexo.la/script.js" data-website-id="d0bf099a-4691-4a59-badc-1cf20640ac96"></script>

<script>
// Capturamos la etiqueta primaria leyendo las clases del body de Ghost de forma segura
document.addEventListener("DOMContentLoaded", function() {
    var bodyClasses = document.body.className;
    var match = bodyClasses.match(/tag-([^\s]+)/);
    var primaryTag = match ? match[1] : null;

    // Configuramos el metadato que Marfeel lee automáticamente
    if (primaryTag) {
        var meta = document.createElement('meta');
        meta.setAttribute('property', 'article:section');
        meta.content = primaryTag;
        document.getElementsByTagName('head')[0].appendChild(meta);
    }
});
</script>


<!-- Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@400;600&display=swap" rel="stylesheet">

<!-- Tipografía de encabezados (Host Grotesk) -->
<style>
  h1, h2, h3,
  .post-title,
  .gh-card-title {
    font-family: "Host Grotesk", system-ui, sans-serif;
  }
</style>

<!-- Google AdSense -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9061854370540184"
     crossorigin="anonymous"></script>

<!-- Elecciones Colombia 2026 --- Desactivada
<div id="nexo-col-root"></div> -->
```
