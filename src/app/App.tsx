import { RouterProvider } from 'react-router-dom'

import { I18nProvider } from '@/i18n'
import { router } from './router'
import { ThemeProvider } from './ThemeProvider'

export function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <RouterProvider router={router} />
      </I18nProvider>
    </ThemeProvider>
  )
}
