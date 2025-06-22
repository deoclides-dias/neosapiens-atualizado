// src/modules/traditions/numerology/services/NumerologyCalculator.ts

import { NumerologyProfile } from '../types/numerologyTypes';

export default class NumerologyCalculator {
  
  /**
   * Reduz um número a um dígito único (exceto 11, 22, 33)
   */
  private reduceToSingleDigit(num: number): number {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
      num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }
    return num as number;
  }
  
  /**
   * Calcula o número da alma (vogais)
   */
  calculateSoulNumber(name: string): number {
    const vowels = 'AEIOU';
    const vowelValues: Record<string, number> = {
      'A': 1, 'E': 5, 'I': 9, 'O': 6, 'U': 3
    };
    
    let sum = 0;
    for (const char of name.toUpperCase()) {
      if (vowels.includes(char)) {
        sum += vowelValues[char];
      }
    }
    
    return this.reduceToSingleDigit(sum);
  }
  
  /**
   * Calcula o número da personalidade (consoantes)
   */
  calculatePersonalityNumber(name: string): number {
    const consonantValues: Record<string, number> = {
      'B': 2, 'C': 3, 'D': 4, 'F': 6, 'G': 7, 'H': 8, 'J': 1,
      'K': 2, 'L': 3, 'M': 4, 'N': 5, 'P': 7, 'Q': 8, 'R': 9,
      'S': 1, 'T': 2, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
    };
    
    let sum = 0;
    for (const char of name.toUpperCase()) {
      if (consonantValues[char]) {
        sum += consonantValues[char];
      }
    }
    
    return this.reduceToSingleDigit(sum);
  }
  
  /**
   * Calcula o número do destino (nome completo)
   */
  calculateDestinyNumber(name: string): number {
    const letterValues: Record<string, number> = {
      'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
      'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
      'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
    };
    
    let sum = 0;
    for (const char of name.toUpperCase()) {
      if (letterValues[char]) {
        sum += letterValues[char];
      }
    }
    
    return this.reduceToSingleDigit(sum);
  }
  
  /**
   * Calcula o número do caminho de vida (data de nascimento)
   */
  calculateLifePathNumber(birthDate: string): number {
    const date = new Date(birthDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    const sum = day + month + year;
    return this.reduceToSingleDigit(sum);
  }
  
  /**
   * Calcula o número pessoal do ano
   */
  calculatePersonalYearNumber(birthDate: string, year: number): number {
    const date = new Date(birthDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    
    const sum = day + month + year;
    return this.reduceToSingleDigit(sum);
  }
  
  /**
   * Calcula números de desafio
   */
  calculateChallengeNumbers(birthDate: string): {
    firstChallenge: number;
    secondChallenge: number;
    thirdChallenge: number;
    mainChallenge: number;
  } {
    const date = new Date(birthDate);
    const day = this.reduceToSingleDigit(date.getDate());
    const month = this.reduceToSingleDigit(date.getMonth() + 1);
    const year = this.reduceToSingleDigit(date.getFullYear());
    
    const firstChallenge = this.reduceToSingleDigit(Math.abs(month - day));
    const secondChallenge = this.reduceToSingleDigit(Math.abs(day - year));
    const thirdChallenge = this.reduceToSingleDigit(Math.abs(firstChallenge - secondChallenge));
    const mainChallenge = this.reduceToSingleDigit(Math.abs(month - year));
    
    return {
      firstChallenge,
      secondChallenge,
      thirdChallenge,
      mainChallenge
    };
  }
  
  /**
   * Calcula a intensidade de cada número no perfil
   */
  calculateNumberIntensities(name: string, birthDate: string): Record<number, number> {
  const intensities: Record<number, number> = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 11: 0, 22: 0, 33: 0
    };
    
    // Contar números no nome
    const letterValues: Record<string, number> = {
      'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
      'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
      'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
    };
    
    for (const char of name.toUpperCase()) {
      const value = letterValues[char];
      if (value && value <= 9) {
        intensities[value as number]++;
      }
    }
    
    // Adicionar números da data
    const date = new Date(birthDate);
    const dateString = `${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}`;
    for (const digit of dateString) {
      const num = parseInt(digit);
      if (num > 0) {
        intensities[num as number]++;
      }
    }
    
    return intensities;
  }
  
  /**
   * Calcula ciclos de vida
   */
  calculateLifeCycles(birthDate: string): {
    firstCycle: { number: number; endAge: number };
    secondCycle: { number: number; endAge: number };
    thirdCycle: { number: number; endAge: number };
  } {
    const date = new Date(birthDate);
    const lifePathNumber = this.calculateLifePathNumber(birthDate);
    
    const firstCycleEnd = 36 - lifePathNumber;
    const secondCycleEnd = firstCycleEnd + 27;
    
    return {
      firstCycle: {
        number: this.reduceToSingleDigit(date.getMonth() + 1),
        endAge: firstCycleEnd
      },
      secondCycle: {
        number: this.reduceToSingleDigit(date.getDate()),
        endAge: secondCycleEnd
      },
      thirdCycle: {
        number: this.reduceToSingleDigit(date.getFullYear()),
        endAge: 99
      }
    };
  }
  
  /**
   * Calcula o perfil numerológico completo
   */
  calculateCompleteProfile(name: string, birthDate: string): NumerologyProfile {
    const soulNumber = this.calculateSoulNumber(name);
    const personalityNumber = this.calculatePersonalityNumber(name);
    const destinyNumber = this.calculateDestinyNumber(name);
    const lifePathNumber = this.calculateLifePathNumber(birthDate);
    const challengeNumbers = this.calculateChallengeNumbers(birthDate);
    const intensities = this.calculateNumberIntensities(name, birthDate);
    const lifeCycles = this.calculateLifeCycles(birthDate);
    
    return {
        soulNumber: 1,
  personalityNumber: 2,
  destinyNumber: 3,
  lifePathNumber: 4,
  challengeNumbers: [],
  intensities: {},
  lifeCycles: [],
      masterNumbers: [],
    } as any;
  }
  
  /**
   * Identifica números mestres no perfil
   */
  private identifyMasterNumbers(name: string, birthDate: string): number[] {
    const masterNumbers: number[] = [];
    // Verificar no cálculo bruto antes da redução
    const numbers = [
      this.calculateSoulNumber(name),
      this.calculatePersonalityNumber(name),
      this.calculateDestinyNumber(name),
      this.calculateLifePathNumber(birthDate)
    ];
    
   for (const num of numbers) {
  const numberValue = num as number;
  if (numberValue === 11 || numberValue === 22 || numberValue === 33) {
    if (!masterNumbers.includes(numberValue)) {
      masterNumbers.push(numberValue);
        }
      }
    }
    
    return masterNumbers;
  }
}