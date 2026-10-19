# Cronómetro React

Mini proyecto independiente para probar el flujo de admisión y despliegue de Atlas. Configura minutos, segundos y milisegundos, pulsa **Start** para comenzar la cuenta atrás y **Pausa** para detenerla. **Continuar** conserva el tiempo restante y **Reiniciar** recupera la duración configurada. Al llegar a cero, se detiene y muestra «Tiempo terminado»; otro Start repite la duración.

La duración se puede editar mientras está detenido o en pausa; editarla reinicia la cuenta. El cálculo usa un reloj monotónico en lugar de restar una cantidad fija en cada actualización, para evitar que se acumule retraso entre fotogramas. El estado vive en el navegador y no se guarda al recargar.

## Desarrollo

Con Node.js 22.12 o posterior y npm, ejecuta desde esta carpeta:

```sh
npm ci
npm run dev
```

Abre http://localhost:5173. Para generar los archivos de producción: `npm run build`.

## Docker

Desde esta carpeta, con Docker iniciado:

```sh
docker build -t contador-react:local .
docker run --rm -p 8080:8080 contador-react:local
```

Abre http://localhost:8080. Detén el contenedor con Ctrl+C.

El Dockerfile tiene dos etapas: Node compila React y Nginx sirve los archivos generados por HTTP en el puerto **8080**. `EXPOSE` documenta ese puerto; `-p 8080:8080` conecta el puerto de tu PC con el del contenedor.

## Prueba en Atlas

1. Publica el contenido de esta carpeta en un repositorio personal de GitHub. `Dockerfile`, `package.json` y `package-lock.json` deben quedar en la raíz de ese repositorio.
2. Desde la cuenta de estudiante con GitHub vinculado, registra ese repositorio y su rama.
3. Indica **8080** como puerto HTTP de la aplicación. No necesita variables de entorno ni base de datos.
4. Desde la cuenta de administrador, revisa y aprueba la solicitud.
5. Con el worker local de Atlas activo, se construirá la imagen con este Dockerfile y se desplegará mediante Kubero en K3s.

Esta carpeta no configura Docker Hub, CI ni workflows. Atlas utiliza el registro que tenga configurado para sus construcciones.
