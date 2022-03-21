import React, { useEffect, createRef } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function RenderBox(props) {
  // Crea la refencia para instanciar el render en un DIV
  const canvasRef = createRef();

  // Loader
  const loader = new OBJLoader();

  // componentDidMount componentDidUpdate
  useEffect(() => {
    // Escena
    var scene = new THREE.Scene();
    // Background
    scene.background = new THREE.Color(0xbfe3dd);

    // Camara
    var camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight
    );
    camera.position.set(0, 20, 50);

    // Render
    var renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);
    // Luz
    const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    scene.add(light);
    // Plano
    scene.add(new THREE.GridHelper(40, 10, 0x888888, 0x444444));

    // Controles
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 20;
    controls.maxDistance = 60;
    controls.enablePan = false;
    controls.enableDamping = true;

    // OBJ Loader
    loader.load(
      // resource URL
      "./demos-models/Cuerpo.obj",
      // called when resource is loaded
      function (object) {
        console.log(object.children);
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

    // Repintar
    var animate = function () {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }, []);
  return <div ref={canvasRef} id="render-box" />;
}

export default RenderBox;
