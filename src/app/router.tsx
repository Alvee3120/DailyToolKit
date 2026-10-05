import { createBrowserRouter, type RouteObject } from 'react-router-dom'

import { tools } from '@/registry'
import { Layout } from './Layout'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'

// Every registered tool becomes a route, lazily loaded via its own code chunk.
// Adding a tool to the registry is all it takes — the router follows.
const toolRoutes: RouteObject[] = tools.map((tool) => {
  const Component = tool.component
  return {
    path: tool.route.replace(/^\//, ''),
    element: <Component />,
  }
})

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      ...toolRoutes,
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
