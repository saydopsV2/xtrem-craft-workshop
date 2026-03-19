import Money from '@xtrem-craft/Money';
import { Currency } from './Currency';
import { MissingExchangeRateError } from './MissingExchangeRateError';

export class Bank {
  private readonly _exchangeRates: Map<string, number> = new Map();

  private readonly _pivotCurrency: Currency;

  constructor(pivotCurrency?: Currency) {
    if (!pivotCurrency) {
      throw new Error('The bank should have a pivot currency');
    }
    this._pivotCurrency = pivotCurrency;
  }

  /**
   * Add exchange rate to the bank.
   * @param from
   * @param to
   * @param rate
   */
  addExchangeRate(to: Currency, rate: number): void {
    this._exchangeRates.set(this.getExchangeRateKey(this._pivotCurrency, to), rate);
  }

  /**
   * Convert from one currency to another using the exchange rate provided in the bank.
   * @param to
   * @param baseMoney
   */
  convert(to: Currency, baseMoney: Money): Money {
    const fromCurrency = baseMoney.currency;
    const exchangeRateIsMissing: boolean = fromCurrency !== to && !this._exchangeRates.has(this.getExchangeRateKey(fromCurrency, to));

    if (exchangeRateIsMissing) {
      throw new MissingExchangeRateError(fromCurrency, to);
    }

    if (to === fromCurrency) {
      return baseMoney;
    }
    const rate = this._exchangeRates.get(this.getExchangeRateKey(fromCurrency, to)) ?? 0;
    const newAmount = baseMoney.amount * rate;
    return new Money(newAmount, to);
  }

  private getExchangeRateKey(from: Currency, to: Currency): string {
    return `${from}->${to}`;
  }
}
