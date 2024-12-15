<template>
    <div ref="threeCanvas" style="width: 100%; height: 100%;"></div>
</template>
  
<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default {
    mounted() {
        this.initThree();
        },
        methods: {
        initThree() {
            // Initialisation de la scène, caméra et rendu
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            700 
            );
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0xFFFFFF, 1);
            document.body.appendChild(renderer.domElement);

            // Lumières
            const ambientLight = new THREE.AmbientLight(0xffffff, 1);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
            directionalLight.position.set(5, 10, 5);
            scene.add(directionalLight);

            // Charger le fichier .glb
            const loader = new GLTFLoader();
            loader.load(
            '/assets/car.glb', // Chemin vers votre fichier .glb
            (gltf) => {

                // Centrer la caméra autour du modèle
                const box = new THREE.Box3().setFromObject(gltf.scene);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());

                const maxDim = Math.max(size.x, size.y, size.z);
                const fov = camera.fov * (Math.PI / 180);
                const distance = maxDim / Math.tan(fov / 2);

                camera.position.set(center.x, center.y, distance * 0.3 );
                camera.lookAt(center);

                gltf.scene.scale.set(0.5, 0.5, 0.5);

                scene.add(gltf.scene);
            },
            undefined,
            (error) => {
                console.error('Erreur lors du chargement du fichier GLB :', error);
            }
            );

            const controls = new OrbitControls(camera, renderer.domElement);

            //Empeche le zoom
            controls.enableZoom = false;
            renderer.domElement.addEventListener('wheel', (event) => {
                event.preventDefault(); 
            });

            // Animation
            const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
            };
            animate();
        },
        },

};

  </script>
  
  <style scoped>
        div {
        width: 50%;
        height: 50%;
        }
        html, body {
        margin: 0;
        height: 100%;
        }
  </style>
  