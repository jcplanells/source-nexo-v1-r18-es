# Rutas personalizadas (routes.yaml)

Algunos bloques de la portada agrupan notas de varios tags primarios. Las páginas
de tag de Ghost (`/tag/{slug}/`) solo muestran un tag, así que para que el
"ver más..." de esos bloques lleve a un archivo con todos sus tags usamos
**channels** definidos en `routes.yaml`.

## Rutas actuales

| URL | Filtro | Plantilla | Usada por |
|---|---|---|---|
| `/tecnologia-y-energia/` | `primary_tag:[tecnologia,energia]` | `tecnologia-energia.hbs` | `partials/components/bloque-tecnologia.hbs` (título y "ver más...") |

El filtro del channel debe coincidir con el filtro del `{{#get}}` del bloque. Si
se añade o quita un tag en uno, hay que cambiarlo también en el otro.

## Importante: routes.yaml no viaja con el tema

Subir el ZIP del tema **no** aplica `routes.yaml`. Hay que subirlo a mano:

1. Ghost Admin → **Settings → Labs → Routes**.
2. **Descargar primero** el `routes.yaml` activo y compararlo con el del repo.
   Si el de producción tiene rutas que no están aquí, copiarlas al del repo
   antes de subir; subir un archivo reemplaza el anterior completo.
3. Subir el `routes.yaml` del repo.
4. Comprobar que la URL responde (ej. `https://nexo.la/tecnologia-y-energia/`).

Orden al desplegar un cambio de este tipo: primero el tema (para que exista la
plantilla), después `routes.yaml`. Si se sube la ruta sin la plantilla, Ghost
usa `index.hbs` como respaldo.

## Añadir otra ruta combinada

Ejemplo para Economía y Finanzas:

1. En `routes.yaml`, bajo `routes:`:
   ```yaml
   /economia-y-finanzas/:
     controller: channel
     filter: primary_tag:[economia,finanzas]
     template: economia-finanzas
   ```
2. Copiar `tecnologia-energia.hbs` como `economia-finanzas.hbs` y cambiar el `<h1>`.
   Mantener la línea `{{#contentFor "body_class"}} tag-template{{/contentFor}}`:
   los channels no reciben la clase `tag-template` en el `<body>`, y sin ella la
   página pierde el layout de las páginas de tag (nota grande + 2 en columna +
   banner + grilla de 3). `default.hbs` la inserta con `{{{block "body_class"}}}`.
   Mantener también el bloque `{{#contentFor "archive_ads"}}`: los scripts de
   Google Ad Manager (`partials/ads/gpt-loader.hbs` y `partials/ads/archive.hbs`)
   solo se cargan solos en páginas de tag/autor. Sin ese bloque el banner tras la
   nota 3 aparece como un espacio vacío.
3. Apuntar el título y el "ver más..." del bloque a la nueva URL.
4. Añadir la fila a la tabla de arriba y subir tema + `routes.yaml`.

## Limitaciones conocidas

- El `<title>` de la página del channel es el título del sitio, no
  "Tecnología y Energía" (los channels no tienen metadatos propios).
- Las notas siguen apareciendo también en sus páginas de tag individuales
  (`/tag/tecnologia/`, `/tag/energia/`); el channel no las reemplaza.
