# Input File Metadata

Componente de Angular simple y personalizable para manejar la carga de archivos junto con sus metadatos (título, descripción, fecha, etc.).

## Instalación

```bash
npm install input-file-metadata
```
---

## Configuración y Uso

Esta librería exporta un **Standalone Component**, lo cual significa que es compatible tanto con la arquitectura Standalone (recomendada en Angular 19+) como con la arquitectura tradicional basada en `NgModules`.

### 1. Uso en Componentes Standalone (Recomendado)

Si tu aplicación utiliza componentes Standalone, simplemente importa `InputFileMetadataComponent` en el arreglo `imports` de tu componente:

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputFileMetadataComponent } from 'input-file-metadata';

@Component({
  selector: 'app-mi-componente',
  standalone: true,
  imports: [FormsModule, InputFileMetadataComponent], // <--- Importa el componente aquí
  template: `
    <h2>Ejemplo de Carga</h2>
    <input-file-metadata 
      name="documento"
      (fileMetadataChange)="onArchivoCargado($event)">
    </input-file-metadata>
  `
})
export class MiComponente {
  onArchivoCargado(event: any) {
    console.log('Metadatos recibidos:', event);
  }
}
```

### 2. Uso con NgModules (Tradicional)

Si tu aplicación todavía utiliza módulos (`app.module.ts`), puedes importar el componente Standalone directamente en el arreglo `imports` de tu módulo:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

// Importa el componente desde la librería
import { InputFileMetadataComponent } from 'input-file-metadata';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, // Necesario si usas formularios
    InputFileMetadataComponent // <--- Importa el componente aquí
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

---

## Características Principales

- **Soporte para Modal Integrado:** Permite capturar metadatos (título y descripción) a través de un modal propio justo al seleccionar el archivo.
- **Campos Externos:** Se puede vincular a campos `<input>` externos en tu formulario usando las propiedades `metaTitleId` y `metaDescId` (desactivando el modal interno).
- **Standalone:** Listo para usarse sin necesidad de importar módulos enteros.

## Referencia de la API (Inputs y Outputs)

### Entradas (`@Input`)
- `[metaTitleId]` (string): El atributo `id` o `name` de un campo HTML externo para sincronizar el título.
- `[metaDescId]` (string): El atributo `id` o `name` de un campo HTML externo para sincronizar la descripción.
- `[metaModal]` (boolean | string): Indica si se debe mostrar el modal integrado. Por defecto es `true`. Ponlo en `false` si vas a usar campos externos (`metaTitleId` / `metaDescId`).
- `[name]` (string): Nombre del campo file interno (por defecto `'file'`).

### Salidas (`@Output`)
- `(fileMetadataChange)`: Se dispara cuando el usuario carga un archivo y confirma la metadata. Devuelve un objeto que cumple con la interfaz `FileMetadata`:

```typescript
export interface FileMetadata {
  file: File;               // El archivo binario cargado
  titulo: string;           // Título ingresado
  descripcion: string;      // Descripción ingresada
  fecha: string;            // Fecha de carga en formato ISO
  nombreOriginal: string;   // Nombre original del archivo
  extension: string;        // Extensión del archivo (ej. pdf, png)
  size: number;             // Tamaño del archivo en bytes
}
```

## Autor

* **Jack E. Charalla Cutipa** 
  * GitHub: [@JackCharalla](https://github.com/JackCharalla)
  * Gobierno Regional Cusco - Proyecto Modernización Cusco