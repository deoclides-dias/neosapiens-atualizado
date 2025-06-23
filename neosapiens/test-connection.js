const https = require('https')

const url = 'https://rlnfyrfeupkztgpgezbj.supabase.co/auth/v1/signup'

console.log('Testando conexão direta com Supabase...')
console.log('URL:', url)

https.get(url, (res) => {
  console.log('✅ Status:', res.statusCode)
  console.log('✅ Conectou com sucesso!')
}).on('error', (err) => {
  console.log('❌ Erro:', err.message)
})
