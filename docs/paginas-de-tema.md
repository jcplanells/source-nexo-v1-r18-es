# Páginas de tema (portada de un tag)

La página de un tag (`/tag/<slug>/`) puede llevar una intro encima del listado de notas.
Sirve como portada del tema para mandar ahí los links de WhatsApp y de la bio de Instagram.

## Cómo armar una

1. En Ghost, crear una **página** (no un post) con slug `tema-<slug del tag>`.
   Ejemplo: para `/tag/terremotos/`, la página va con slug `tema-terremotos`.
2. Escribir la intro: un párrafo de contexto y los enlaces a las notas de entrada
   (las que funcionan como índice, p. ej. "Terremoto: lo que sabemos").
   Se pueden usar tarjetas de bookmark del editor.
3. **Publicarla.** El tema solo lee páginas publicadas. El título de la página no se
   muestra; arriba sale el nombre del tag.
4. Revisar que las notas del tema tengan ese tag. El listado de abajo es el del tag.

Si no existe la página, el tag se ve como siempre.

## Tags actuales

| Tema         | Tag              | Página de intro       |
|--------------|------------------|-----------------------|
| Terremoto    | `terremotos`     | `tema-terremotos`     |
| Cobre Panamá | `cobre-panama`   | `tema-cobre-panama`   |
| Canal        | `canal-de-panama`| `tema-canal-de-panama`|
| Reposeídos   | (no existe aún)  | —                     |
