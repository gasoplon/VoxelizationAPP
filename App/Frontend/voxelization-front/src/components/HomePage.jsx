import React from "react";
export function HomePage() {
  return (
    <div class="container bg-primary text-white vh-100">
      <div class="row justify-content-center text-center" id="presentacion">
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
            </div>
            <div class="col-md-6 bg-danger  text-center">
              <span>Voxeliza-Me</span> te permitirá subir tu modelo 3D en
              formato .gltf, visualizarlo y aplicar el voxelizado y texturizado
              para obtener una réplica en Minecraft.
            </div>
          </div>
        </div>
      </div>
      <div class="row justify-content-center text-center " id="presentacion">
        <div class="col col-7 bg-info m-5">
          <div class="row bg-info">
            <h4>Tutorial</h4>
          </div>
          <div class="row justify-content-center">
            <div class="col-md bg-light">1 of 2</div>
            <div class="col-md bg-danger">2 of 2</div>
          </div>
          <div class="row justify-content-center">
            <div class="col-md bg-light">1 of 2</div>
            <div class="col-md bg-danger">2 of 2</div>
          </div>
          <div class="row justify-content-center">
            <div class="col-md bg-light">1 of 2</div>
            <div class="col-md bg-danger">2 of 2</div>
          </div>
        </div>
      </div>
    </div>
  );
}
