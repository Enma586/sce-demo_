# SCE Studio — Demo Pública

Panel de administración demo para **SCE Studio**. Aplicación SPA construida con React, TypeScript, Tailwind CSS v4 y Firebase.

## Stack

| Tecnología | Propósito |
|-----------|-----------|
| React 19 | UI declarativa basada en componentes |
| TypeScript ~6.0 | Tipado estricto en toda la aplicación |
| Tailwind CSS v4 | Estilos utilitarios con tema personalizado |
| Framer Motion | Animaciones y transiciones |
| Firebase (Firestore) | Base de datos en tiempo real |
| React Router v7 | Enrutamiento SPA con layout protegido |
| Lucide React | Iconos |
| Vite 8 | Bundler y dev server |

## Funcionalidades

- **Login demo** — credenciales precargadas, resetea la base de datos al iniciar sesión.
- **Dashboard** — métricas en tiempo real con bento grid asimétrico y animaciones.
- **CRUD completo** — crear, editar y eliminar clientes, reservas y pagos.
- **Relaciones entre colecciones** — los modales de reservas y pagos cargan la lista de clientes desde Firestore.
- **Traducción de estados** — los valores en inglés (`active`, `pending`, `paid`) se muestran en español con badges de colores.
- **Sidebar responsive** — menú off-canvas con animación en móvil y escritorio.
- **Reseteo automático** — al iniciar sesión se eliminan todos los datos y se insertan 3 registros de ejemplo en cada colección.

## Variables de entorno

Copia el archivo `.env.example` a `.env` y completa las credenciales de Firebase:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Instalación

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy en Vercel

El proyecto incluye un `vercel.json` que configura el framework Vite y rewrites para SPA.

```bash
npm run build
# o conecta el repositorio directamente desde el dashboard de Vercel
```

## Estructura del proyecto

```
src/
├── components/       # Componentes reutilizables (Sidebar, Navbar, DataTable, StatsCard, CrudModal, ConfirmModal)
├── context/          # Contextos de React (AuthContext, SidebarContext)
├── pages/            # Vistas principales (Login, Dashboard, Clients, Bookings, Payments)
├── routes/           # Configuración de React Router (AppRouter)
├── services/         # Servicios de Firebase (clients, bookings, payments, seed)
├── types/            # Interfaces TypeScript (Client, Booking, Payment)
├── index.css         # Tema Tailwind y clases personalizadas (doodle-border, doodle-underline, doodle-dots)
├── main.tsx          # Punto de entrada
└── App.tsx           # Componente raíz
```
