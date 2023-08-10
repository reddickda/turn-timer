import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { MantineProvider } from '@mantine/core';
import './index.css'
import { ContextProvider } from './Context/RoomContext.tsx';
import { WakeLock } from './Components/WakeLock.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <MantineProvider>
    <ContextProvider>
      <App />
      <WakeLock />
    </ContextProvider>
  </MantineProvider>
)
