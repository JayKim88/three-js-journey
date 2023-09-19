import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import { StrictMode } from 'react'

const root = ReactDOM.createRoot(document.querySelector('#root'))

/** StrictMode 
    It warn you about potential problems in your application.
    Here are some examples:
    - Unused import
    - Infinite render loop
    - Forgotten useEffect dependencies
    - Deprecated practices
    - Etc.
 */

root.render(
    <StrictMode> 
        <Canvas
            camera={ {
                fov: 45,
                near: 0.1,
                far: 200,
                position: [ - 4, 3, 6 ]
            } }
        >
            <Experience /> 
        </Canvas>
    </StrictMode>
)
