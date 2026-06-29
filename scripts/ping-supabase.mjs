const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Variables SUPABASE_URL et SUPABASE_ANON_KEY requises.')
  process.exit(1)
}

const response = await fetch(`${url}/rest/v1/profiles?select=id&limit=1`, {
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
  },
})

if (!response.ok) {
  const body = await response.text()
  console.error(`Échec du ping Supabase (${response.status}): ${body}`)
  process.exit(1)
}

const data = await response.json()
console.log(`Ping Supabase OK — ${new Date().toISOString()} — ${data.length} profil(s) trouvé(s)`)
