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
| `modulo` | sublista dentro del bloque, tomada del `utm_campaign` del enlace (p. ej. `las_ultimas`) |
| `destino` | ruta o dominio de destino (solo `tipo` = `seccion` o `externo`) |
| `disp` | `movil` o `escritorio` |

**portada-bloque-visto**: una vez por visita, cuando al menos el 40% del bloque entra en pantalla. Datos: `bloque`, `disp`. Es el denominador para comparar bloques de arriba con los de abajo.

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
