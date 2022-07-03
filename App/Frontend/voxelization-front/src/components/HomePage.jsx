import React from "react";
import { motion } from "framer-motion/dist/framer-motion";
export function HomePage() {
  return (
    <div class="container text-white ">
      <motion.div
        class="row justify-content-center text-center "
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div class="col col-7 m-5">
          <div class="row texto_titulo p-3">
            <h4>
              ¿QUÉ ES
              <span class="titulo_app "> Voxeliza-Me</span>?
            </h4>
          </div>
          {/* align items on a boostratp row
          <div class="row justify-content-center text-center"> */}
          <div class="row">
            <div class="col-md-5 rounded">
              <img
                src=""
                class="img-fluid img-tutorial-1  m-1 "
                alt="No image"
              />
            </div>
            <div class="col-md-1 "></div>
            <div class="col-md-5 ">
              <span class="texto_normal">
                <span class="titulo_app">Voxeliza-Me</span> te permitirá subir
                tu modelo 3D en formato .gltf, visualizarlo y aplicar el
                voxelizado y texturizado para obtener una réplica en Minecraft.
              </span>
            </div>
          </div>
        </div>
      </motion.div>
      <div class="row justify-content-center text-center p-5">
        <div class="row">
          <h4 class="texto_titulo">TUTORIAL</h4>
        </div>
        <div class="row pt-2 pb-1">
          <div class="col-md rounded m-1">
            <img src="" class="img-fluid img-tut-1  " alt="No image" />
          </div>
          <div class="col-md texto_normal">
            Cree o descargue su modelo personalizado en formato GLFT y súbalo a
            la <a href="http://localhost:3000/herramienta">Herramienta</a>.
          </div>
        </div>
        <div class="row justify-content-center pt-1 pb-1">
          <div class="col-md-6">2 of 2</div>
          <div class="col-md-6 texto_normal">
            Determine los parámetros que más se ajustan al resultado que desee.
          </div>
        </div>
        <div class="row justify-content-center pt-1 pb-1">
          <div class="col-md ">1 of 2</div>
          <div class="col-md texto_normal">
            Copie el comando de Minecraft que puede ser pegado directamente en
            el chat de Minecraft
          </div>
        </div>
      </div>
    </div>
  );
}
