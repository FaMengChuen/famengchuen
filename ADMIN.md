# Panel de administración — Fa Meng Chuen

CMS interno sobre **Firebase** (Auth + Firestore + Storage) para administrar el
sitio sin tocar código. El sitio público sigue en Next.js App Router y lee su
contenido desde Firestore (con _fallback_ al contenido por defecto si Firestore
no responde, para que la web nunca quede en blanco).

## Arquitectura

- **Sitio público** (`app/page.tsx`, `app/[slug]/page.tsx`): renderiza secciones
  desde el CMS vía `components/SectionRenderer.tsx`. Páginas `force-dynamic` →
  los cambios se publican al guardar.
- **Lectura de contenido**: `lib/cms/repository.ts` (Firebase Admin, lado
  servidor). El navegador nunca lee Firestore directamente.
- **Panel** (`app/admin/...`): login con Google, dashboard y gestores de
  páginas, productos, medios y usuarios.
- **Escrituras**: todas pasan por APIs internas `/api/admin/*` con validación
  Zod y verificación de rol. Auditoría en la colección `auditLogs`.
- **Imágenes**: se suben a **Vercel Blob** directamente desde el navegador
  (token generado por `/api/admin/media/blob-token`, solo para admins). Los
  metadatos viven en Firestore (`media`).
- **Reglas**: Firestore bloquea todo acceso de cliente (`firestore.rules`).

## Roles

- `owner`: definido por la variable `FIREBASE_OWNER_EMAILS`. No se puede revocar
  desde la UI.
- `admin`: puede editar contenido, subir imágenes, crear páginas y promover o
  revocar otros admins. Se otorga invitando un email; cuando esa persona entra
  con Google, recibe el rol automáticamente.

## Configuración (una sola vez)

El proyecto Firebase `fa-meng-chuen` ya tiene: web app registrada, Firestore
(región `southamerica-west1`), reglas desplegadas y una service account para el
Admin SDK. Faltan **dos pasos manuales en la consola** (no automatizables de
forma fiable por CLI):

1. **Activar Google como proveedor de acceso** (necesario para entrar al panel):
   Firebase Console → Authentication → _Get started_ → pestaña _Sign-in method_
   → Google → _Enable_ → elegir email de soporte → _Save_.

2. **(Opcional) Crear un store de Vercel Blob** para poder **subir imágenes
   nuevas**: panel de Vercel → _Storage_ → _Create_ → _Blob_. Copia el token a
   `BLOB_READ_WRITE_TOKEN` en `.env.local` (en producción se inyecta solo al
   enlazar el store al proyecto). Mientras tanto el sitio funciona referenciando
   imágenes por ruta (ej. `/assets/team.jpg`). Capa gratuita: 1 GB, sin tarjeta.

### Variables de entorno

Ver `.env.example`. En local viven en `.env.local` (ya configurado). En
producción (Vercel) hay que definir las mismas variables.

## Sembrar contenido inicial

Copia el contenido actual de la web a Firestore (idempotente, no sobreescribe):

```bash
npm run seed
```

…o desde el panel: **Inicio → “Inicializar contenido base”**.

## Desarrollo

```bash
npm run dev      # http://localhost:3000  (panel en /admin)
npm run build    # build de producción
npm run lint
```
