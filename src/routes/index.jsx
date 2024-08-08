import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PATH } from '../constant/_path'
import { lazy, Suspense } from 'react'
const Dashboard = lazy(() => import('./dashboard'))

const useRoutes = () => [
  {
    path: PATH.LOGIN,
    component: null,
  },
  {
    path: PATH.REGISTER,
    component: null,
  },
  {
    path: PATH.BASE,
    component: <Dashboard />,
  },
  {
    path: PATH.DASHBOARD,
    component: null,
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
