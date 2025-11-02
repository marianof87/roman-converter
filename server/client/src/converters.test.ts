import { describe, it, expect } from 'vitest'
import { intToRoman, romanToInt } from './converters'

describe('converters', () => {
  it('intToRoman - basic values', () => {
    expect(intToRoman(1)).toBe('I')
    expect(intToRoman(4)).toBe('IV')
    expect(intToRoman(9)).toBe('IX')
    expect(intToRoman(1999)).toBe('MCMXCIX')
  })

  it('intToRoman - invalid inputs', () => {
    expect(() => intToRoman(0)).toThrow()
    expect(() => intToRoman(4000)).toThrow()
    expect(() => intToRoman(-5)).toThrow()
  })

  it('romanToInt - basic and canonical', () => {
    expect(romanToInt('I')).toBe(1)
    expect(romanToInt('iv')).toBe(4)
    expect(romanToInt(' MCMXCIX ')).toBe(1999)
  })

  it('romanToInt - invalid or non-canonical', () => {
    expect(() => romanToInt('IIII')).toThrow()
    expect(() => romanToInt('ABC')).toThrow()
  })
})

it('romanToInt - non-string inputs', () => {
  // @ts-expect-error para probar inputs no válidos
  expect(() => romanToInt(null)).toThrow()
  // @ts-expect-error
  expect(() => romanToInt(123)).toThrow()
  // @ts-expect-error
  expect(() => romanToInt(undefined)).toThrow()
})

it('romanToInt - empty or whitespace string', () => {
  expect(() => romanToInt('')).toThrow()
  expect(() => romanToInt('   ')).toThrow()
})

it('romanToInt - invalid sequence but valid letters', () => {
  expect(() => romanToInt('VX')).toThrow()  // nunca se resta V -> X
  expect(() => romanToInt('IL')).toThrow()  // inválido según las reglas romanas
})

it('intToRoman - edge values', () => {
  expect(intToRoman(3999)).toBe('MMMCMXCIX') // valor máximo permitido
})

it('romanToInt - correct parsing of complex valid numbers', () => {
  expect(romanToInt('XLII')).toBe(42)
  expect(romanToInt('XCIV')).toBe(94)
  expect(romanToInt('CDXLIV')).toBe(444)
  expect(romanToInt('MMXXV')).toBe(2025)
})
