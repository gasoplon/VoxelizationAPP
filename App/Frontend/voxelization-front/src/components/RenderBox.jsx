import React, { useEffect, createRef, useState } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as Constants from "../constants.js";

export function RenderBox(props) {
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
  var renderer = new THREE.WebGLRenderer();
  const controls = new OrbitControls(camera, renderer.domElement);
  // Repintar
  const animate = function () {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  useEffect(() => {
    // loadObject();
    animate();
  }, [props.selectedModelPath]);

  const loadObject = () => {
    loader.load(
      // resource URL
      props.selectedModelPath,
      // called when resource is loaded
      function (object) {
        scene.add(object);
      },
      // called when loading is in progresses
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      function (error) {
        console.log("An error happened");
      }
    );
  };

  // componentDidMount componentDidUpdate
  useEffect(() => {
    console.log(canvasRef.current.children[0]);
    if (canvasRef.current.children[0] !== undefined)
      canvasRef.current.removeChild(canvasRef.current.children[0]);
    // scene = new THREE.Scene();
    // Background
    scene.background = new THREE.Color(0xbfe3dd);

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

    animate();
  });
  return <div ref={canvasRef} />;
}

export default RenderBox;
