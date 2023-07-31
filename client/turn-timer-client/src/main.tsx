import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { MantineProvider } from '@mantine/core';
import './index.css'
import { ContextProvider } from './Context/RoomContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <MantineProvider>
    <ContextProvider>
      <App />
    </ContextProvider>
  </MantineProvider>
)
