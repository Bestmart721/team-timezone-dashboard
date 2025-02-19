import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from "react-redux";
import { store } from "./store/store";
import TeamDashboard from './components/TeamDashboard.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <TeamDashboard />
    </Provider>
  </StrictMode>,
)
