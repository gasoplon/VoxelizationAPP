import React from "react";
import { motion } from "framer-motion/dist/framer-motion";
export function HomePage() {
  return (
    <div class="container bg-primary text-white ">
      <motion.div
        class="row justify-content-center text-center "
        // initial={{ scale: 0 }}
        // animate={{ rotate: 360, scale: 1 }}
        // transition={{
        //   type: "spring",
        //   stiffness: 260,
        //   damping: 20,
        // }}
        id="presentacion"
      >
        <div class="col col-7 bg-info m-5">
          <div class="row">
            <h4>
              ¿QUÉ ES
              <span class="titulo_app"> Voxeliza-Me</span>?
            </h4>
          </div>
          <div class="row">
            <div class="col-md-6 bg-light">
              <img
                src=""
                class="img-fluid img-tutorial-1 rounded m-1"
                alt="No image"
              />
              {/* <RenderBox selectedURLFile="./models/OldCar.glb"></RenderBox> */}
            </div>
            <div class="col-md-6 bg-danger  text-center">
              <span>Voxeliza-Me</span> te permitirá subir tu modelo 3D en
              formato .gltf, visualizarlo y aplicar el voxelizado y texturizado
              para obtener una réplica en Minecraft.
            </div>
          </div>
        </div>
      </motion.div>
      <div class="row justify-content-center text-center " id="presentacion">
        <div class="col col-7 bg-info m-5">
          <div class="row bg-info">
            <h4>Tutorial</h4>
          </div>
          <div class="row justify-content-center">
            <div class="col-md bg-light">1 of 2</div>
            <div class="col-md bg-danger">
              Cree o descargue su modelo personalizado en formato GLFT y súbalo
              en la pestaña Herramienta.
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="col-md bg-danger">
              Determine los parámetros que más se ajustan al resultado que
              desee.
            </div>
            <div class="col-md bg-light">2 of 2</div>
          </div>
          <div class="row justify-content-center">
            <div class="col-md bg-light">1 of 2</div>
            <div class="col-md bg-danger">
              Copie el comando de Minecraft que puede ser pegado directamente en
              el chat de Minecraft
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
