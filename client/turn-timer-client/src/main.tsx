import ReactDOM from 'react-dom/client'
import { MantineProvider } from '@mantine/core';
import './index.css'
import { ContextProvider } from './Context/RoomContext.tsx';
import { WakeLock } from './Components/WakeLock.tsx';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from './ErrorPage.tsx';
import { Header } from './Components/Header.tsx';
import { Connect } from './routes/Connect.tsx';
import { JoinOrHost } from './routes/JoinOrHost.tsx';
import { Host } from './routes/Host.tsx';
import { Join } from './routes/Join.tsx';
import { Game } from './routes/Game.tsx';
import { PageWrapper } from './Components/PageWrapper.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <PageWrapper />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/connect",
        element: <Connect />,
        errorElement: <ErrorPage />,
      },
      {
        path: '/joinorhost',
        element: <JoinOrHost />,
        errorElement: <ErrorPage />
      },
      {
        path: '/host',
        element: <Host />,
        errorElement: <ErrorPage />
      },
      {
        path: '/join',
        element: <Join />,
        errorElement: <ErrorPage />
      },
      {
        path: '/game',
        element: <Game />,
        errorElement: <ErrorPage />
      }
    ]
  },
  ]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <MantineProvider
    theme={{
      fontFamily: 'Verdana'
    }}
  >
    <ContextProvider>
      <Header />
      <RouterProvider router={router} />
      <WakeLock />
    </ContextProvider>
  </MantineProvider>
)
