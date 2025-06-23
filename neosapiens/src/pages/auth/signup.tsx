import Head from 'next/head'
import AuthForm from '../../components/auth/AuthForm'

export default function Signup() {
  return (
    <>
      <Head>
        <title>Criar Conta - NeoSapiens</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <AuthForm mode="signup" />
      </div>
    </>
  )
}
