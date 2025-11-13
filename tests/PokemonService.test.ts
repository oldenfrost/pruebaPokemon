import * as PokemonService from '../src/services/PokemonService'

describe('PokemonService', () => {

	beforeEach(() => { (global as any).fetch = jest.fn() })
	afterEach(() => { jest.resetAllMocks(); try { delete (global as any).fetch } catch (e) {} })

	test('getRandomPokemonId devuelve número en rango', () => {
		const id = PokemonService.getRandomPokemonId(20)
		expect(id).toBeGreaterThanOrEqual(1)
		expect(id).toBeLessThanOrEqual(20)
	})

	test('fetchPokemonData - se realiza correctamente', async () => {
		;(global as any).fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ name: 'pikachu' }) })
		const res = await PokemonService.fetchPokemonData(25)
		expect(res.data).toEqual({ name: 'pikachu' })
	})

	test('fetchPokemonData - maneja error', async () => {
		;(global as any).fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 })
		const res = await PokemonService.fetchPokemonData(9999)
		expect(res.data).toBeNull()
		expect(res.error).toBeDefined()
	})
})

