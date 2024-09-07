import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PATH } from '../constant/_path'
import { lazy, Suspense } from 'react'
const Dashboard = lazy(() => import('./dashboard'))
const Login = lazy(() => import('./auth/login'))
const Register = lazy(() => import('./auth/register'))

const useRoutes = () => [
  {
    path: PATH.LOGIN,
    component: <Login />,
  },
  {
    path: PATH.REGISTER,
    component: <Register />,
  },
  {
    path: PATH.BASE,
    component: <Login />,
  },
  {
    path: PATH.DASHBOARD,
    component: <Dashboard />,
  },
  {
    path: PATH.NOT_FOUND,
    component: null,
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
              <Suspense fallback={<p>loading</p>}>{route.component}</Suspense>
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  )
}
