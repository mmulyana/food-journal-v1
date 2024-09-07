import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PATH } from '../constant/_path'
import { lazy, Suspense } from 'react'
import ProtectedLayout from '../components/protected-layout'
const Dashboard = lazy(() => import('./dashboard'))
const Login = lazy(() => import('./auth/login'))
const Register = lazy(() => import('./auth/register'))

const useRoutes = () => [
  {
    path: PATH.LOGIN,
    component: <Login />,
    auth: false,
  },
  {
    path: PATH.REGISTER,
    component: <Register />,
    auth: false,
  },
  {
    path: PATH.BASE,
    component: <Login />,
    auth: false,
  },
  {
    path: PATH.DASHBOARD,
    component: <Dashboard />,
    auth: true,
  },
  {
    path: PATH.NOT_FOUND,
    component: null,
    auth: false,
  },
]

export default function Routers() {
  const routes = useRoutes()

  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              <Suspense fallback={<p>loading</p>}>
                {route.auth ? (
                  <ProtectedLayout>{route.component}</ProtectedLayout>
                ) : (
                  route.component
                )}
              </Suspense>
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  )
}
