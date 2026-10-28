import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  const signIn = (provider) =>
    supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    })
  const signOut = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{ session, user: session?.user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}