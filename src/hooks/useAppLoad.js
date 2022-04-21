import * as React from 'react'
import Amplify from 'aws-amplify';
import awsconfig from '../aws-exports';
import { Auth, Hub, DataStore } from 'aws-amplify'

export default function useAppLoad(){
  const [isAuth, setAuth] = React.useState()
  const [ready, setReady] = React.useState(false)
  const [user, setUser] = React.useState({})

  const listener = (data) => {
    switch (data.payload.event) {
       case 'signIn':
          getCurrentUserInfo()
          break;
       case 'signOut':
          DataStore.clear()
          DataStore.stop()
          setUser({})
          setAuth(false)
          setReady(false)
          break;
        case 'ready' :
          setReady(true)
          break;
    }
  }
  const getCurrentUserInfo = () => {
    Auth.currentUserInfo().then(user => {
      if (user && Object.keys(user).length > 0 ) {
        setUser(user)
        setAuth(true)
        Auth.currentSession().then((token) => {
          user.groups = token.accessToken.payload["cognito:groups"]
          setReady(true)
          if(user.groups?.includes('admin') || user.groups?.includes('user')) {
            Auth.signOut()
            setReady(false)
          }
        }).catch(e => console.log(e))
      }
      else {
        setAuth(false)
        setReady(false)
      }
    })
  }

  React.useEffect(() => {
    Amplify.configure(awsconfig);
    getCurrentUserInfo()
  },[])

  Hub.listen('auth', listener);

  return [ready, isAuth, user]
}
