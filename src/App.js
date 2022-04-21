import * as React from 'react'
import logo from './logo.svg'
import {
  BrowserRouter,
  useRouteMatch,
  Routes,
  Route
} from 'react-router-dom'
import { UserProvider } from './context/userContext.js'
import { SellerProvider } from './context/sellerContext.js'
import SignInScreen from './auth/SignInScreen'
import DashboardScreen from './offers/DashboardScreen'
import useAppLoad from './hooks/useAppLoad'

function App() {
  const [ready, auth, user] = useAppLoad()

  return (
    <BrowserRouter>
      <SellerProvider seller={false}>
        { auth ? (
          ready ? (
            <UserProvider user={user}>
              <Routes>
                <Route path="*" element={ <DashboardScreen/> }/>
              </Routes>
            </UserProvider>
          ) : (
            <div>wait..</div>
          )
        ) : (
          <Routes>
            <Route path="/" element={ <SignInScreen/> }/>
            <Route path="*" element={ <div>noay cafe</div> }/>
          </Routes>
        )}
      </SellerProvider>
    </BrowserRouter>
  );
}

export default App;
