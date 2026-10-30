# Medición de la portada

Partial: `partials/components/medicion-portada.hbs`, incluido al final de `home.hbs`.
Envía eventos a Umami (stats.nexo.la). No hace falta tocar los bloques: el bloque sale de la clase `bloque-*` de su `<section>` (la cabecera es `portada`).

## Eventos

**portada-clic**: cada clic (normal o con rueda) en un enlace de la portada.

| Dato | Valores |
|---|---|
| `bloque` | `portada`, `top-extra`, `economia`, `empresas`, `agua-energia`, `datos`, … |
| `tipo` | `nota`, `seccion` (tag, "ver más", páginas propias) o `externo` |
| `slug` | slug de la nota (solo `tipo = nota`) |
| `pos` | posición de la nota en el bloque, contando notas visibles y distintas (1 = la primera) |
| `espacio` | solo en `portada`: `top1`, `top2`, `top3` o `featured` |
| `modulo` | sublista dentro del bloque, tomada del `utm_campaign` del enlace (p. ej. `las_ultimas`, `mas_leidas`), o `widget` si el enlace está fuera de una tarjeta de artículo (p. ej. el ILC) |
| `destino` | ruta o dominio de destino (solo `tipo` = `seccion` o `externo`) |
| `disp` | `movil` o `escritorio` |

**portada-bloque-visto**: una vez por carga de la portada, cuando se ve al menos el 40% del bloque o el bloque ocupa al menos el 40% de la pantalla (necesario para bloques más altos que la pantalla, como la cabecera en móvil). Datos: `bloque`, `disp`. Es el denominador para comparar bloques de arriba con los de abajo.

## Consultas (MySQL de Umami)

Clics por bloque y posición, últimos 7 días:

```sql
SELECT
  MAX(CASE WHEN d.data_key = 'bloque' THEN d.string_value END) AS bloque,
  MAX(CASE WHEN d.data_key = 'espacio' THEN d.string_value END) AS espacio,
  MAX(CASE WHEN d.data_key = 'pos' THEN d.number_value END) AS pos,
  e.event_id
FROM website_event e
JOIN event_data d ON d.website_event_id = e.event_id
WHERE e.event_type = 2
  AND e.event_name = 'portada-clic'
  AND e.created_at >= UTC_TIMESTAMP() - INTERVAL 7 DAY
GROUP BY e.event_id;
```

Agrupar ese resultado por `bloque, espacio, pos` y dividir entre:

- visitas a la home (`event_type = 1 AND url_path = '/'`) para el CTR de la cabecera;
- eventos `portada-bloque-visto` del mismo bloque para el CTR de los bloques de abajo.

## Recarga automática de la portada

La home se recarga sola cada 5 minutos (`default.hbs`). La recarga la hace un script que deja una marca en `sessionStorage`, y la página siguiente sabe que fue automática (`window.__nexoAutoRefresh`). En ese caso:

- Umami descarta la visita a la home gracias a `window.nexoUmamiBeforeSend`. **Requisito:** el script de Umami en Code Injection de Ghost debe llevar `data-before-send="nexoUmamiBeforeSend"`.
- No se envían bloques vistos.
- Cuando la persona vuelve a la pestaña o interactúa (toca, hace scroll o usa el teclado), se registra la visita y empieza a contar los bloques vistos con normalidad.

Antes de este cambio (hasta la subida de la versión con la recarga marcada), las pestañas abiertas inflaban las visitas a la home: usar visitas únicas (`COUNT(DISTINCT visit_id)`) como denominador para esos datos.
