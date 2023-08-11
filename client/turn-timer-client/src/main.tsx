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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Connect />,
    errorElement: <ErrorPage />,
    // children: [
    //   {
    //     path: "connect",
    //     element: <ConnectionManager />,
    //   }
    // ]
  },
  {
    path: '/joinorhost',
    element: <JoinOrHost />,
    errorElement: <ErrorPage />
  }
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
