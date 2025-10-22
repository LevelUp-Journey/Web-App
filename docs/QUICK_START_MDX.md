# Quick Start: Using MDX in Challenges

## 🚀 Cómo Usar

### 1. Guardar Markdown en la Base de Datos

Simplemente guarda el texto Markdown en el campo `description` del challenge:

```typescript
const challenge = {
  name: "Binary Search",
  description: `
# Binary Search Challenge

## Description
Implement a binary search algorithm...

### Requirements
1. Array must be sorted
2. Return index or -1

\`\`\`javascript
function binarySearch(arr, target) {
  // Your code here
}
\`\`\`
  `,
  // ... otros campos
};
```

### 2. El Renderizado es Automático

No necesitas hacer nada más. El componente `MdxRenderer` se encarga de todo:

```tsx
// En page.tsx (ya implementado)
<ChallengeSummary
    challenge={challenge}
    codeVersions={codeVersions}
    renderedMdx={<MdxRenderer source={challenge.description || ""} />}
/>
```

## ✍️ Sintaxis Markdown Soportada

### Headings
```markdown
# H1 - Título Principal
## H2 - Subtítulo
### H3 - Sección
#### H4 - Subsección
```

### Texto con Formato
```markdown
**Texto en negrita**
*Texto en cursiva*
~~Texto tachado~~
```

### Listas

Desordenadas:
```markdown
- Item 1
- Item 2
  - Sub-item 2.1
  - Sub-item 2.2
```

Ordenadas:
```markdown
1. Primer paso
2. Segundo paso
3. Tercer paso
```

### Código

Inline: `` `const x = 10;` ``

Bloque:
````markdown
```javascript
function example() {
  return "Hello World";
}
```
````

### Enlaces
```markdown
[Texto del enlace](https://example.com)
```

### Tablas
```markdown
| Columna 1 | Columna 2 | Columna 3 |
|-----------|-----------|-----------|
| Dato 1    | Dato 2    | Dato 3    |
| Dato 4    | Dato 5    | Dato 6    |
```

### Blockquotes
```markdown
> Esta es una nota importante
> que puede ocupar múltiples líneas
```

### Línea Horizontal
```markdown
---
```

## 📝 Ejemplo Completo para un Challenge

```markdown
# Challenge: Two Sum

## Problem Description

Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.

### Constraints

- `2 <= nums.length <= 10^4`
- `-10^9 <= nums[i] <= 10^9`
- Only one valid answer exists

## Examples

### Example 1

**Input:**
```javascript
nums = [2, 7, 11, 15], target = 9
```

**Output:**
```javascript
[0, 1]
```

**Explanation:** Because `nums[0] + nums[1] == 9`, we return `[0, 1]`.

### Example 2

**Input:**
```javascript
nums = [3, 2, 4], target = 6
```

**Output:**
```javascript
[1, 2]
```

## Hints

💡 **Hint 1**: Try using a hash map to store numbers you've seen.

💡 **Hint 2**: For each number, check if `target - current` exists in the map.

> **Note**: You cannot use the same element twice.

## Approach

| Approach | Time Complexity | Space Complexity |
|----------|----------------|------------------|
| Brute Force | O(n²) | O(1) |
| Hash Map | O(n) | O(n) |

### Recommended Approach: Hash Map

1. Create an empty hash map
2. Iterate through the array
3. For each number:
   - Calculate `complement = target - current`
   - If complement exists in map, return indices
   - Otherwise, add current number to map

## Test Cases

```javascript
// Test Case 1
assert(twoSum([2, 7, 11, 15], 9) == [0, 1]);

// Test Case 2
assert(twoSum([3, 2, 4], 6) == [1, 2]);

// Test Case 3
assert(twoSum([3, 3], 6) == [0, 1]);
```

## Related Topics

- Arrays
- Hash Tables
- Two Pointers

---

**Difficulty**: Easy  
**Tags**: `array`, `hash-table`, `two-pointers`
```

## 🎨 Resultado Visual

Este Markdown se renderizará con:

- ✅ Títulos grandes y jerarquizados
- ✅ Listas con viñetas o números
- ✅ Código con fondo gris y formato
- ✅ Enlaces en azul
- ✅ Tablas bien formateadas
- ✅ Blockquotes con borde izquierdo
- ✅ Soporte para dark mode

## 🔍 Ver un Challenge con Markdown

1. Crea o edita un challenge
2. Agrega Markdown en el campo `description`
3. Guarda el challenge
4. Navega a `/dashboard/challenges/edit/[challengeId]`
5. ¡Verás el Markdown renderizado automáticamente!

## 💡 Tips

### Usa Markdown para:
- Explicar el problema claramente
- Mostrar ejemplos de código
- Listar requisitos y constraints
- Incluir hints y tips
- Mostrar casos de prueba
- Agregar tablas de complejidad

### Evita:
- HTML crudo (usa Markdown)
- Scripts o código malicioso
- Imágenes externas sin HTTPS

## 🆘 Troubleshooting

**Problema**: El Markdown no se muestra

- Verifica que `challenge.description` no sea null
- Revisa la sintaxis del Markdown
- Mira la consola del navegador por errores

**Problema**: Los estilos se ven mal

- Asegúrate de que Tailwind CSS esté funcionando
- Verifica que `@tailwindcss/typography` esté instalado
- Revisa que dark mode esté configurado

**Problema**: El código no tiene formato

- Usa triple backticks (\`\`\`) para bloques de código
- Especifica el lenguaje después de los backticks
- Usa backticks simples (\`) para código inline

## 📚 Más Información

- Ver `docs/MDX_RENDERING.md` para documentación completa
- Ver `docs/CHALLENGE_MARKDOWN_EXAMPLE.md` para un ejemplo extenso
- Ver `docs/MDX_IMPLEMENTATION_SUMMARY.md` para detalles técnicos

---

**¡Listo para usar! No necesitas instalación adicional.**