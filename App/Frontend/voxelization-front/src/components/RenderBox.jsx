import React, { useEffect, createRef, useState } from "react";
import {
  AmbientLight,
  AnimationMixer,
  AxesHelper,
  Box3,
  Cache,
  DirectionalLight,
  GridHelper,
  HemisphereLight,
  LinearEncoding,
  LoaderUtils,
  LoadingManager,
  PMREMGenerator,
  PerspectiveCamera,
  REVISION,
  Scene,
  SkeletonHelper,
  Vector3,
  WebGLRenderer,
  sRGBEncoding,
  Color,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import PropTypes from "prop-types";
// import { createBackground } from "three-vignette-background";

Cache.enabled = true;

export function RenderBox(props) {
  // Componentes del RenderBox
  const canvasRef = createRef(); // Crea la refencia para instanciar el render en un DIV
  const loader = new GLTFLoader(); // Loader
  const scene = new Scene(); // Escena
  const renderer = new WebGLRenderer({ antialias: true }); // Render
  const camera = new PerspectiveCamera( // Camara
    50,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
  );
  const controls = new OrbitControls(camera, renderer.domElement); // Controles
  // Configuracion
  const configuracion = {
    sceneBackgroundColor: 0xbfe3dd,
    intensidadDeAmbiente: 0.3,
    colorAmbiente: 0xffffff,
    intensidadDirecta: 0.8 * Math.PI,
    colorDirecto: 0xffffff,
    colorVineta1: "#ffffff",
    colorVineta2: "#353535",
  };
  // const vineta = createBackground({
  //   aspect: this.defaultCamera.aspect,
  //   grainScale: 0.001,
  //   colors: [configuracion.colorVineta1, configuracion.colorVineta2],
  // });

  // Lights
  const luzGlobal = new HemisphereLight();
  const luz1 = new AmbientLight(
    configuracion.colorAmbiente,
    configuracion.intensidadDeAmbiente
  );
  const luz2 = new DirectionalLight(
    configuracion.colorDirecto,
    configuracion.intensidadDirecta
  );

  // Valores iniciales
  scene.add(camera);
  scene.add(luzGlobal);
  camera.add(luz1);
  camera.add(luz2);
  luz2.position.set(0.5, 0, 0.87);
  scene.background = new Color(configuracion.sceneBackgroundColor);
  // renderer.physicallyCorrectLights = true;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  controls.screenSpacePanning = true;

  /****************************************************************************************** */
  // Rendeizar frame
  const render = () => {
    renderer.render(scene, camera);
  };

  // Repintar frame
  const animateFrame = () => {
    // Frame
    requestAnimationFrame(animateFrame);

    // Update controls
    controls.update();

    // Renderizar escena actual
    render();
  };

  // Resize de la pantalla actual
  const resize = () => {
    // // Get size del elemento padre
    // const { clientHeight, clientWidth } = this.parentElement;
    // // Actualizar
    // camera.aspect = clientWidth / clientHeight;
    // camera.updateProjectionMatrix();
    // renderer.setSize(clientWidth, clientHeight);
  };

  window.addEventListener("resize", resize, false);

  const loadObject = () => {
    if (props.selectedModel && props.selectedModel.pathFile)
      loader.load(
        // Archivo de carga
        props.selectedModel.pathFile,
        // LLamada cuando se termina de cargar el objeto
        function (object) {
          if (
            object &&
            object.scene &&
            object.scene.children &&
            object.scene.children.length === 1
          ) {
            setContent(object.scene);
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

  const clear = () => {
    // Eliminamos el anterior
    if (canvasRef.current.children[0] !== undefined)
      canvasRef.current.removeChild(canvasRef.current.children[0]);
  };

  const setContent = (GLFTScene) => {
    // Limpiar escena
    clear();

    canvasRef.current.appendChild(renderer.domElement);

    // Caja adaptada al objeto
    const boxObject = new Box3().setFromObject(GLFTScene);
    const sizeBox = boxObject.getSize(new Vector3()).length();
    const centerBox = boxObject.getCenter(new Vector3());

    // Resetear controles
    controls.reset();

    // Posición del objeto
    GLFTScene.position.x += GLFTScene.position.x - centerBox.x;
    GLFTScene.position.y += GLFTScene.position.y - centerBox.y;
    GLFTScene.position.z += GLFTScene.position.z - centerBox.z;

    // Distancias que se adapatan al objeto
    controls.maxDistance = sizeBox * 10;
    camera.near = sizeBox / 100;
    camera.far = sizeBox * 100;
    camera.updateProjectionMatrix();

    camera.position.copy(centerBox);
    camera.position.x += sizeBox / 2.0;
    camera.position.y += sizeBox / 5.0;
    camera.position.z += sizeBox / 2.0;
    camera.lookAt(centerBox);

    // Añadir el objeto a la escena
    scene.add(GLFTScene);
    window.content = GLFTScene;
  };

  // componentDidMount componentDidUpdate
  useEffect(() => {
    // Eliminamos el anterior
    if (canvasRef.current.children[0] !== undefined)
      canvasRef.current.removeChild(canvasRef.current.children[0]);

    // Render
    canvasRef.current.appendChild(renderer.domElement);

    // Luz
    // const light = new HemisphereLight(0xffffbb, 0x080820, 1);
    // scene.add(light);

    // Plano
    // scene.add(new GridHelper(40, 10, 0x888888, 0x444444));

    // OBJ Loader
    loadObject();
    // console.log(scene);
    // Animar
    animateFrame();
  }, [props.selectedModel]);

  // Comenzar renderizado
  requestAnimationFrame(animateFrame);

  // Devolver componente
  return <div ref={canvasRef} />;
}

//TODO:
RenderBox.propTypes = {
  // selectedModel: PropTypes.any.isRequired,
};

export default RenderBox;
