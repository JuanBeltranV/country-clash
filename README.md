# Country Clash

**Country Clash** es un juego web hecho con **React + Vite** donde debes elegir que pais tiene mayor poblacion.

Cada acierto suma un punto y mantiene al pais ganador para la siguiente ronda. La partida continua hasta que fallas.

## Demo

[Jugar en GitHub Pages](https://juanbeltranv.github.io/country-clash/)

## Vista Previa

<p align="center">
  <a href="https://juanbeltranv.github.io/country-clash/" target="_blank">
    <img src="public/assets/preview-example.png" alt="Vista previa de Country Clash" width="700">
  </a>
</p>

## Caracteristicas

- Siluetas reales de paises usando `world-atlas`, `topojson-client` y `d3-geo`.
- Comparacion entre bandera, nombre y poblacion de dos paises.
- Puntaje actual y mejor puntaje de la sesion.
- Modal de derrota con opcion para reiniciar rapidamente.
- Datos locales de respaldo para que GitHub Pages siga funcionando aunque cambie la API publica.
- Interfaz oscura y responsive para escritorio y telefono.

## Tecnologias

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [D3 Geo](https://github.com/d3/d3-geo)
- [TopoJSON Client](https://github.com/topojson/topojson-client)
- [world-atlas](https://github.com/topojson/world-atlas)
- [GitHub Pages](https://pages.github.com/)

## Instalacion Local

```bash
git clone https://github.com/JuanBeltranV/country-clash.git
cd country-clash
npm install
npm run dev
```

Luego abre:

```text
http://localhost:5173
```
