#  Country Clash — Population Battle

**Country Clash** es un juego web interactivo hecho con **React + Vite** donde los jugadores deben adivinar qué país tiene **mayor población**.  
Cada vez que aciertas, sumas puntos y continúas hasta fallar. ¡Pon a prueba tu conocimiento del mundo!

---

## 🕹️ Demo

🔗 **[Jugar en GitHub Pages](https://juanbeltranv.github.io/country-clash/)**  

---

## 📸 Vista previa

<p align="center">
  <a href="https://juanbeltranv.github.io/country-clash/" target="_blank">
    <img src="public/assets/preview-example.png" alt="Country Clash Preview" width="600">
  </a>
</p>

---

## 🚀 Características

-  Muestra la **silueta real** de cada país usando datos de `world-atlas`
-  Cada tarjeta incluye la **bandera** y el **nombre del país**
-  Al pasar el mouse, las siluetas brillan con un suave efecto
-  Acierta cuál país tiene **más población**
-  Si fallas, aparece un **modal animado** con tu puntaje y opción de **reiniciar**
-  Datos obtenidos desde la **API pública [REST Countries](https://restcountries.com)**
-  Interfaz moderna, **oscura**

---

##  Tecnologías utilizadas

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [REST Countries API](https://restcountries.com/)
- [D3-Geo](https://github.com/d3/d3-geo)
- [TopoJSON](https://github.com/topojson/topojson-client)
- [world-atlas](https://github.com/topojson/world-atlas)
- [GitHub Pages](https://pages.github.com/) — para el despliegue

---

## ⚙️ Instalación local

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/JuanBeltranV/country-clash.git
   cd country-clash
   
2. **Instala las dependencias:**
   ```bash
    npm install

3. **Ejecuta en modo desarrollo:**
   ```bash
    npm run dev

4. **Abre en tu navegador:**
    ```bash
   http://localhost:5173
