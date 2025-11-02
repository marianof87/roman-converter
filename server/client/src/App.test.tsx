import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import axios from 'axios'
import App from './App'

afterEach(() => {
  vi.restoreAllMocks()
})

// Helper para activar modo y obtener input + botón
const setup = (mode: 'toRoman' | 'fromRoman', local = true) => {
  render(<App />)
  fireEvent.click(screen.getByLabelText(mode === 'toRoman' ? /A Romano/i : /A Número/i))
  const input = screen.getByPlaceholderText(
    mode === 'toRoman' ? /Ingrese número/i : /Ingrese romano/i
  )
  const button = screen.getByText(local ? /Convertir local/i : /Convertir via servidor/i)
  return { input, button }
}

describe('App component', () => {

  it('renders initial state without result or error', () => {
    render(<App />)
    expect(screen.queryByText(/Resultado:/)).toBeNull()
    expect(screen.queryByText(/Por favor ingrese/)).toBeNull()
  })

  it('renders title', () => {
    render(<App />)
    expect(screen.getByText(/Convertidor Romano/i)).toBeInTheDocument()
  })

  it('converts number to roman locally', async () => {
    const { input, button } = setup('toRoman')
    fireEvent.change(input, { target: { value: '1999' } })
    fireEvent.click(button)
    expect(await screen.findByText(/Resultado: MCMXCIX/i)).toBeInTheDocument()
  })

  it('converts roman to number locally', async () => {
    const { input, button } = setup('fromRoman')
    fireEvent.change(input, { target: { value: 'MCMXCIX' } })
    fireEvent.click(button)
    expect(await screen.findByText(/Resultado: 1999/i)).toBeInTheDocument()
  })

  it('handles invalid number', async () => {
    const { input, button } = setup('toRoman')
    fireEvent.change(input, { target: { value: 'abc' } })
    fireEvent.click(button)
    expect(await screen.findByText(/Por favor ingrese un número válido/i)).toBeInTheDocument()
  })

  it('handles number out of range', async () => {
    const { input, button } = setup('toRoman')
    fireEvent.change(input, { target: { value: '4000' } })
    fireEvent.click(button)
    expect(await screen.findByText(/Número fuera de rango/i)).toBeInTheDocument()
  })

  it('handles empty input as out of range', async () => {
    const { input, button } = setup('toRoman')
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.click(button)
    expect(await screen.findByText(/Número fuera de rango/i)).toBeInTheDocument()
  })

  it('converts number to roman via server', async () => {
    const { input, button } = setup('toRoman', false)
    vi.spyOn(axios, 'post').mockResolvedValueOnce({ data: { roman: 'MCMXCIX' } })
    fireEvent.change(input, { target: { value: '1999' } })
    fireEvent.click(button)
    expect(await screen.findByText(/Resultado: MCMXCIX/i)).toBeInTheDocument()
  })

  it('converts roman to number via server', async () => {
    const { input, button } = setup('fromRoman', false)
    vi.spyOn(axios, 'post').mockResolvedValueOnce({ data: { number: 1999 } })
    fireEvent.change(input, { target: { value: 'MCMXCIX' } })
    fireEvent.click(button)
    expect(await screen.findByText(/Resultado: 1999/i)).toBeInTheDocument()
  })

  it('shows server error message', async () => {
    const { input, button } = setup('toRoman', false)
    vi.spyOn(axios, 'post').mockRejectedValueOnce({ response: { data: { error: 'Servidor no disponible' } } })
    fireEvent.change(input, { target: { value: '123' } })
    fireEvent.click(button)
    expect(await screen.findByText(/Servidor no disponible/i)).toBeInTheDocument()
  })

  it('shows generic unexpected error', async () => {
    const { input, button } = setup('toRoman', false)
    vi.spyOn(axios, 'post').mockRejectedValueOnce(new Error('Error inesperado'))
    fireEvent.change(input, { target: { value: '123' } })
    fireEvent.click(button)
    expect(await screen.findByText(/Error inesperado/i)).toBeInTheDocument()
  })

})

//Test inicial para cubrir ramas "false"
it('renders initial state without result or error', () => {
  render(<App />)
  expect(screen.queryByText(/Resultado:/)).toBeNull()
  expect(screen.queryByText(/Por favor ingrese/)).toBeNull()
})
