import React, { useEffect, createRef, useState } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import PropTypes from "prop-types";

export function RenderBox(props) {
  //TODO:  THREE.Cache.enabled = true;
  // Crea la refencia para instanciar el render en un DIV
  const canvasRef = createRef();

  // Loader
  const loader = new OBJLoader();

  // Escena
  var scene = new THREE.Scene();

  // Camara
  var camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight
  );
  // Render
  var renderer = new THREE.WebGLRenderer({ antialias: true });

  // Controles
  const controls = new OrbitControls(camera, renderer.domElement);

  // Repintar
  const animate = function () {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };

  const loadObject = () => {
    if (props.selectedModel && props.selectedModel.pathFile)
      loader.load(
        // Archivo de carga
        props.selectedModel.pathFile,
        // LLamada cuando se termina de cargar el objeto
        function (object) {
          // console.log(object);
          if (object && object.children && object.children.length === 1) {
            scene.add(object);
          } else {
            // TODO: Set errors, eliminar hijos...
            var new_state = { ...props.selectedModel };
            new_state.errores.push(["WARN", "Demasiados objetos"]);
            props.setSelectedModel(new_state);
          }
        },
        // Llamada cuando está siendo cargado
        //TODO: Quitar
        function (xhr) {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        // TODO: Tratar errores
        function (error) {
          console.log("An error happened");
        }
      );
  };

  // componentDidMount componentDidUpdate
  useEffect(() => {
    // Eliminamos el anterior
    if (canvasRef.current.children[0] !== undefined)
      canvasRef.current.removeChild(canvasRef.current.children[0]);

    // Background
    scene.background = new THREE.Color(0xbfe3dd);

    // Camara
    camera.position.set(0, 20, 50);

    // Render
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);

    // Luz
    const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    scene.add(light);

    // Plano
    scene.add(new THREE.GridHelper(40, 10, 0x888888, 0x444444));

    // Controles
    controls.minDistance = 20;
    controls.maxDistance = 60;
    controls.enablePan = false;
    controls.enableDamping = true;

    // OBJ Loader
    loadObject();
    // console.log(scene);
    // Animar
    animate();
  }, [props.selectedModel]);

  return <div ref={canvasRef} />;
}

//TODO:
RenderBox.propTypes = {
  // selectedModel: PropTypes.any.isRequired,
};

export default RenderBox;
