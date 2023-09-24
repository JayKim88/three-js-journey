import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import * as THREE from 'three'

const root = ReactDOM.createRoot(document.querySelector('#root'))

// the renderer will be available in the gl property
// const created = ({ gl, scene }) =>
// {
//     gl.setClearColor('#ff0000', 1)
//     scene.background = new THREE.Color('#ff0000')
// }

root.render(
    <Canvas
        shadows={false}
        camera={{
            fov: 45,
            near: 0.1,
            far: 200,
            position: [- 4, 3, 6]
        }}
        // onCreated={created}
        
    >        
        <Experience />
    </Canvas>
)
