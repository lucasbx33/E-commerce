<template>
    <div ref="threeCanvas" class="three-canvas-container"></div>
  </template>
  
  <script>
  import * as THREE from "three";
  import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
  
  export default {
    name: "ThreeObject",
    mounted() {
      this.initThree();
      window.addEventListener("resize", this.onWindowResize);
    },
    beforeUnmount() {
      window.removeEventListener("resize", this.onWindowResize);
    },
    methods: {
      initThree() {
        const width = this.$refs.threeCanvas.clientWidth;
        const height = this.$refs.threeCanvas.clientHeight;
  
        // Initialisation de la scène, caméra et rendu
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 700);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
  
        // Adaptez la couleur au fond du site (bg-gray-100 = #f7fafc)
        renderer.setClearColor(0xf7fafc, 1);
  
        this.$refs.threeCanvas.appendChild(renderer.domElement);
  
        // Lumières
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);
  
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 10, 5);
        scene.add(directionalLight);
  
        // Charger le fichier .glb
        const loader = new GLTFLoader();
        loader.load(
          "/assets/car.glb",
          (gltf) => {
            const box = new THREE.Box3().setFromObject(gltf.scene);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
  
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = camera.fov * (Math.PI / 180);
            const distance = maxDim / Math.tan(fov / 2);
  
            camera.position.set(center.x, center.y, distance * 0.3);
            camera.lookAt(center);
  
            gltf.scene.scale.set(0.5, 0.5, 0.5);
  
            scene.add(gltf.scene);
          },
          undefined,
          (error) => {
            console.error("Erreur lors du chargement du fichier GLB :", error);
          }
        );
  
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;
  
        const animate = () => {
          requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        };
        animate();
  
        // Ajustement dynamique
        this.onWindowResize = () => {
          const newWidth = this.$refs.threeCanvas.clientWidth;
          const newHeight = this.$refs.threeCanvas.clientHeight;
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        };
      },
    },
  };
  </script>
  
  <style scoped>
  .three-canvas-container {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
  html,
  body {
    margin: 0;
    padding: 0;
    height: 100%;
  }
  </style>
  