import * as React from 'react'
import { Auth, API } from 'aws-amplify'
import { useSeller } from '../context/sellerContext.js'

export default function SignInScreen(props){
  const [email, setEmail] = React.useState('')
  const [code, setCode] = React.useState()
  const [businessName, setName] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [signingUp, setSignUp] = React.useState(true)
  const [user, setUser] = React.useState()
  const [seller, setSeller] = useSeller()

  const auth = () => {
    async function signUp() {
      try {
        console.log(email);
        const { user } = await Auth.signUp({
          username : email,
          password : password
        })
        setUser(user)
      } catch (e) {
        console.log(e)
      }
    }
    async function signIn() {
      try {
        await Auth.signIn(email, password)
      } catch (e) {
        console.log(e)
      }
    }
    if (signingUp) signUp()
    else signIn()
  }
  const confirmUser = async () => {
    try {
      await Auth.confirmSignUp(user.username, code);
      setSeller({creating : 'true', name: businessName})
      await Auth.signIn(user.username, password);
      setUser({...user, userConfirmed : true})
    } catch (error) {
        console.log('error confirming sign up', error);
    }
  }

  return (
    <main>
      { signingUp ? (
          user && !user.userConfirmed ? (
            <div>
              <input placeholder='code'
                value={code}
                onChange={(e) => setCode(e.target.value)}/>
              <button onClick={confirmUser}>confirm</button>
            </div>
          ) : (
            <div>
              <input placeholder='seller name'
                value={businessName}
                onChange={(e) => setName(e.target.value)}/>
              <input placeholder='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}/>
              <input placeholder='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}/>
              <button onClick={auth}>sign up</button>
              <button onClick={(e) => setSignUp(false)}>sign in</button>
            </div>
          )
      ) : (
        <div>
          <input placeholder='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}/>
          <input placeholder='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}/>
          <button onClick={auth}>sign in</button>
        </div>
      )}
    </main>
  )
}
