import React, { useRef, useEffect, useState } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Group, Mesh, Box3, Vector3, AnimationMixer } from 'three';
import { isMobile } from '../../utils/deviceDetection';

interface ModelLoaderProps {
  onLoad?: () => void;
}

const MODEL_PATH = '/models/model.glb';

const FallbackModel = () => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#1f8ad1" />
    </mesh>
  );
};

export const ModelLoader: React.FC<ModelLoaderProps> = ({ onLoad }) => {
  const groupRef = useRef<Group>(null);
  const mixerRef = useRef<AnimationMixer | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  const gltf = useLoader(
    GLTFLoader,
    MODEL_PATH,
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
      (loader as GLTFLoader).setDRACOLoader(dracoLoader);
    }
  );

  useEffect(() => {
    if (!gltf?.scene) return;

    const setupModel = async () => {
      try {
        gltf.scene.position.set(0, 0, 0);
        gltf.scene.rotation.set(0, 0, 0);
        gltf.scene.scale.set(1, 1, 1);

        const box = new Box3().setFromObject(gltf.scene);
        const size = new Vector3();
        box.getSize(size);
        const center = new Vector3();
        box.getCenter(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = isMobile() ? 5.0 / maxDim : 4.0 / maxDim;
        gltf.scene.scale.multiplyScalar(scale);

        gltf.scene.position.x = -center.x * scale;
        gltf.scene.position.y = -center.y * scale;
        gltf.scene.position.z = isMobile() ? -0.5 : -1;

        if (gltf.animations?.length > 0) {
          const mixer = new AnimationMixer(gltf.scene);
          mixerRef.current = mixer;

          gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            action.play();
          });
        }

        // Ensure model is fully loaded before triggering callback
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!modelLoaded) {
          setModelLoaded(true);
          onLoad?.();
        }
      } catch (err) {
        console.error('Error processing model:', err);
      }
    };

    setupModel();

    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
    };
  }, [gltf, modelLoaded, onLoad]);

  useFrame((_, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  if (!gltf?.scene) {
    return <FallbackModel />;
  }

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} />
    </group>
  );
};