import { useEffect } from 'react'
import { account, tablesDB } from '../appwrite'
import { useAuth } from '../Contexts/AuthContext'

export default function OAuthRedirect () {
  const { setLoggedInUser, createUserProfile } = useAuth()

  async function createSession () {
    // get token's userId & secret
    const urlParams = new URLSearchParams(window.location.search)
    const userId = urlParams.get('userId')
    const secret = urlParams.get('secret')

    // create session 
    if (userId && secret) {
      await account.createSession(userId, secret) 
    }
    // get current logged-in account
    const user = await account.get()

    // create a new userProfile table row for the created user
    createUserProfile(user)
    // set loggedInUser in authContext
    setLoggedInUser(user)

    // Session created successfully, redirect to profile
    window.location.href = '/profile'
  }

  useEffect(() => {
    createSession()
  }, [])

  return <></>
}
