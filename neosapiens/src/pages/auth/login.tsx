import Head from 'next/head'
import AuthForm from '../../components/auth/AuthForm'

export default function Login() {
  return (
    <>
      <Head>
        <title>Login - NeoSapiens</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <AuthForm mode="login" />
      </div>
    </>
  )
}
