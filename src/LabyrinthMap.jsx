/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import { useConvexPolyhedron } from '@react-three/cannon';
import { useGLTF } from "@react-three/drei";
import React, { useRef } from "react";

export default function Model(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF("/labyrinth1.glb");
  const [ref, api] = useConvexPolyhedron(() => ({ mass: 10, ...props, args: geo }))
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane.geometry}
        material={nodes.Plane.material}
        position={[0.13, -0.27, 0.3]}
        scale={[2.18, 1, 2.82]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube002.geometry}
        material={nodes.Cube002.material}
        position={[-1.31, -0.09, 0]}
        rotation={[0, -0.01, 0]}
        scale={[-0.03, 0.18, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube003.geometry}
        material={nodes.Cube003.material}
        position={[-1.04, -0.09, -0.72]}
        rotation={[Math.PI, -1.57, Math.PI]}
        scale={[-0.03, 0.18, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube004.geometry}
        material={nodes.Cube004.material}
        position={[-1.06, -0.09, 0.97]}
        rotation={[Math.PI, -1.57, Math.PI]}
        scale={[-0.03, 0.18, 0.23]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube005.geometry}
        material={nodes.Cube005.material}
        position={[-0.2, -0.09, 0.96]}
        rotation={[Math.PI, -1.57, Math.PI]}
        scale={[-0.03, 0.18, 0.17]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube006.geometry}
        material={nodes.Cube006.material}
        position={[0.74, -0.09, 0.96]}
        rotation={[Math.PI, -1.57, Math.PI]}
        scale={[-0.03, 0.18, 0.32]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube007.geometry}
        material={nodes.Cube007.material}
        position={[1.84, -0.09, 0.96]}
        rotation={[Math.PI, -1.57, Math.PI]}
        scale={[-0.03, 0.18, 0.33]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube008.geometry}
        material={nodes.Cube008.material}
        position={[-1.82, -0.09, 1.56]}
        rotation={[Math.PI, -1.57, Math.PI]}
        scale={[-0.03, 0.18, 0.17]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube009.geometry}
        material={nodes.Cube009.material}
        position={[-1.23, -0.09, 2.07]}
        rotation={[Math.PI, -1.57, Math.PI]}
        scale={[-0.03, 0.18, 0.17]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube010.geometry}
        material={nodes.Cube010.material}
        position={[-1.23, -0.09, 2.83]}
        rotation={[0, 0.02, 0]}
        scale={[-0.03, 0.18, 0.17]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube011.geometry}
        material={nodes.Cube011.material}
        position={[-0.67, -0.09, 2.54]}
        rotation={[Math.PI, -1.57, Math.PI]}
        scale={[-0.03, 0.18, 0.17]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube012.geometry}
        material={nodes.Cube012.material}
        position={[-0.06, -0.09, 2.78]}
        rotation={[0, 0.02, 0]}
        scale={[-0.03, 0.18, 0.22]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube013.geometry}
        material={nodes.Cube013.material}
        position={[0.07, -0.09, 2.23]}
        rotation={[Math.PI, -1.57, Math.PI]}
        scale={[-0.03, 0.18, 0.35]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube014.geometry}
        material={nodes.Cube014.material}
        position={[0.38, -0.09, 2.42]}
        rotation={[0, 0.02, 0]}
        scale={[-0.03, 0.18, 0.17]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube015.geometry}
        material={nodes.Cube015.material}
        position={[1.18, -0.09, 2.57]}
        rotation={[Math.PI, -1.57, Math.PI]}
        scale={[-0.03, 0.18, 0.28]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube016.geometry}
        material={nodes.Cube016.material}
        position={[1.76, -0.09, 2.34]}
        rotation={[0, 0.02, 0]}
        scale={[-0.03, 0.18, 0.23]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube017.geometry}
        material={nodes.Cube017.material}
        position={[2.09, -0.09, 1.56]}
        rotation={[Math.PI, -1.57, Math.PI]}
        scale={[-0.03, 0.18, 0.17]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube018.geometry}
        material={nodes.Cube018.material}
        position={[1.18, -0.09, 2.2]}
        rotation={[Math.PI, -1.57, Math.PI]}
        scale={[-0.03, 0.18, 0.28]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube019.geometry}
        material={nodes.Cube019.material}
        position={[0.74, -0.09, 1.59]}
        rotation={[Math.PI, -1.57, Math.PI]}
        scale={[-0.03, 0.18, 0.32]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube020.geometry}
        material={nodes.Cube020.material}
        position={[-0.8, -0.09, 1.56]}
        rotation={[Math.PI, -1.57, Math.PI]}
        scale={[-0.03, 0.18, 0.17]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube021.geometry}
        material={nodes.Cube021.material}
        position={[-0.18, -0.09, 1.56]}
        rotation={[Math.PI, -1.57, Math.PI]}
        scale={[-0.03, 0.18, 0.17]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube022.geometry}
        material={nodes.Cube022.material}
        position={[-0.59, -0.09, 0.43]}
        rotation={[Math.PI, -1.57, Math.PI]}
        scale={[-0.03, 0.18, 0.23]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube023.geometry}
        material={nodes.Cube023.material}
        position={[-0.65, -0.09, -0.13]}
        rotation={[Math.PI, -1.57, Math.PI]}
        scale={[-0.03, 0.18, 0.17]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube024.geometry}
        material={nodes.Cube024.material}
        position={[1, -0.09, 0.43]}
        rotation={[Math.PI, -1.57, Math.PI]}
        scale={[-0.03, 0.18, 0.93]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube025.geometry}
        material={nodes.Cube025.material}
        position={[-0.05, -0.09, -0.13]}
        rotation={[Math.PI, -1.57, Math.PI]}
        scale={[-0.03, 0.18, 0.17]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube026.geometry}
        material={nodes.Cube026.material}
        position={[0.74, -0.09, -0.13]}
        rotation={[Math.PI, -1.57, Math.PI]}
        scale={[-0.03, 0.18, 0.32]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube027.geometry}
        material={nodes.Cube027.material}
        position={[1.84, -0.09, -0.12]}
        rotation={[Math.PI, -1.57, Math.PI]}
        scale={[-0.03, 0.18, 0.33]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube028.geometry}
        material={nodes.Cube028.material}
        position={[1.02, -0.09, -0.75]}
        rotation={[Math.PI, -1.57, Math.PI]}
        scale={[-0.03, 0.18, 0.32]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube029.geometry}
        material={nodes.Cube029.material}
        position={[1.36, -0.09, -1.39]}
        rotation={[Math.PI, -1.57, Math.PI]}
        scale={[-0.03, 0.18, 0.32]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube030.geometry}
        material={nodes.Cube030.material}
        position={[1.69, -0.09, -1.58]}
        rotation={[0, 0.02, 0]}
        scale={[-0.03, 0.18, 0.23]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube031.geometry}
        material={nodes.Cube031.material}
        position={[-0.34, -0.09, -0.89]}
        rotation={[0, 0.02, 0]}
        scale={[-0.03, 0.18, 0.17]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube032.geometry}
        material={nodes.Cube032.material}
        position={[-0.98, -0.09, -1.55]}
        rotation={[0, 0.02, 0]}
        scale={[-0.03, 0.18, 0.23]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube033.geometry}
        material={nodes.Cube033.material}
        position={[-0.43, -0.09, -1.76]}
        rotation={[Math.PI, -1.57, Math.PI]}
        scale={[-0.03, 0.18, 0.93]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube034.geometry}
        material={nodes.Cube034.material}
        position={[0.46, -0.09, -1.92]}
        rotation={[0, 0.02, 0]}
        scale={[-0.04, 0.18, 0.44]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube035.geometry}
        material={nodes.Cube035.material}
        position={[0.46, -0.09, -2.24]}
        rotation={[0, 0.02, 0]}
        scale={[-0.03, 0.18, 0.17]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube036.geometry}
        material={nodes.Cube036.material}
        position={[-2.01, -0.09, 0.3]}
        scale={[-0.03, 0.18, 2.78]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube037.geometry}
        material={nodes.Cube037.material}
        position={[2.28, -0.09, 0.32]}
        scale={[-0.03, 0.18, 2.78]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube038.geometry}
        material={nodes.Cube038.material}
        position={[0.11, -0.09, 3.04]}
        rotation={[0, 1.56, 0]}
        scale={[-0.03, 0.18, 2.15]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube039.geometry}
        material={nodes.Cube039.material}
        position={[0.11, -0.09, -2.43]}
        rotation={[0, 1.56, 0]}
        scale={[-0.03, 0.18, 2.15]}
      />
    </group>
  );
}

useGLTF.preload("/labyrinth1.glb");

