# Calculadora de antigüedad

Este plugin añade el campo personalizado **Antigüedad calculada**, basado en el tipo
`string` de Strapi. Al agregar o editar ese campo desde el Content-Type Builder, elige
el campo `date` o `datetime` de origen y el formato del resultado en sus opciones.

El selector de fecha muestra los campos fecha del mismo tipo de contenido. El resultado
se actualiza en el formulario al cambiar la fecha y se recalcula en el servidor al crear
el registro o modificar esa fecha. Los campos `datetime` se usan por su fecha, ignorando
la hora.

Formatos disponibles:

- **Años cumplidos**: número entero como texto.
- **Años, meses y días**: tiempo transcurrido en calendario.
- **Días totales**: días completos transcurridos.
- **Años decimales**: años aproximados con dos decimales.

Si la fecha está vacía, no es válida o es futura, el valor calculado queda vacío.
