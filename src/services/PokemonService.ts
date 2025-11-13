
export type PokemonInfo = {
  source?: string
  meta?: Record<string, any>
}

export function getRandomPokemonId(max = 898) {

  return Math.floor(Math.random() * max) + 1
}


export async function fetchPokemonData(id: number) {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Pokemon API returned ${res.status}`)
    const data = await res.json()
    return { id, data }
  } catch (err) {
    console.error('[PokemonService] fetchPokemonData error', err)
    return { id, data: null, error: (err as Error).message }
  }
}



export async function fetchPokemonSvg(id: number) {
  const url =  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`SVG request returned ${res.status}`)
    const svg = await res.text()
    return { id, svg, url }
  } catch (err) {
    console.error('[PokemonService] fetchPokemonSvg error', err)
    return { id, svg: null, url, error: (err as Error).message }
  }
}

export async function fetchMultipleRandomPokemon() {
  let count = 4
  let max = 898
  const ids = new Array<number>()
  for (let i = 0; i < count; i++) {
  ids.push(getRandomPokemonId(max))
  }
  const jobs = ids.map(async (id, idx) => {
    if (idx === 0) {
      const [p, s] = await Promise.all([fetchPokemonData(id), fetchPokemonSvg(id)])
      return { id, data: p.data ?? null, svg: s.svg ?? null, svgUrl: s.url }
    }
    const p = await fetchPokemonData(id)
    return { id, data: p.data ?? null, svg: null, svgUrl: null }
  })

  const results = await Promise.all(jobs)
  return results
}

export default {
  fetchMultipleRandomPokemon
}
