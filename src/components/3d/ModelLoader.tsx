import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Group, Mesh, MeshStandardMaterial, Box3, Vector3, AnimationMixer } from 'three';
import { isMobile } from '../../utils/deviceDetection';

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

export const ModelLoader = () => {
  const groupRef = useRef<Group>(null);
  const mixerRef = useRef<AnimationMixer | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const gltf = useLoader(
    GLTFLoader,
    MODEL_PATH,
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
      (loader as GLTFLoader).setDRACOLoader(dracoLoader);
    },
    undefined,
    (error) => {
      console.error('Error loading model:', error);
      setError(error);
    }
  );

  useEffect(() => {
    if (!gltf?.scene) return;

    try {
      // Reset transformations
      gltf.scene.position.set(0, 1, 0);
      gltf.scene.rotation.set(0, 0, 0);
      gltf.scene.scale.set(1, 1, 1);

      // Calculate bounding box
      const box = new Box3().setFromObject(gltf.scene);
      const size = new Vector3();
      box.getSize(size);
      const center = new Vector3();
      box.getCenter(center);

      // Calculate scale to fit in view
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = isMobile() ? 1.5 / maxDim : 1.85 / maxDim;
      gltf.scene.scale.multiplyScalar(scale);

      // Center the model
      gltf.scene.position.x = -center.x * scale;
      gltf.scene.position.y = (-center.y * scale) - 1; // Offset down by 1 unit
      gltf.scene.position.z = isMobile() ? -2 : 0;

      // Setup animations if they exist
      if (gltf.animations?.length > 0) {
        const mixer = new AnimationMixer(gltf.scene);
        mixerRef.current = mixer;

        gltf.animations.forEach((clip) => {
          const action = mixer.clipAction(clip);
          action.play();
        });
      }

      // Apply material settings for better visibility from all angles
      gltf.scene.traverse((child) => {
        if (child instanceof Mesh) {
          if (child.material instanceof MeshStandardMaterial) {
            child.material.roughness = 0.5;
            child.material.metalness = 0.5;
            child.material.envMapIntensity = 1.5;
            child.material.side = 2; // Enable double-sided rendering
          }
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    } catch (err) {
      console.error('Error processing model:', err);
      setError(err as Error);
    }

    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
      if (gltf.scene) {
        gltf.scene.traverse((child) => {
          if (child instanceof Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach(m => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      }
    };
  }, [gltf]);

  useFrame((_, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  if (error || !gltf?.scene) {
    return <FallbackModel />;
  }

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} />
    </group>
  );
};

useLoader.clear(GLTFLoader);