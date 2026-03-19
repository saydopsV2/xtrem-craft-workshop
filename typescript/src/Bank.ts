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
    if (rate < 0) {
      throw new Error('the rate must be positive');
    }
    this._exchangeRates.set(this.getExchangeRateKey(this._pivotCurrency, to), rate);
  }
  /**
   * Updates an existing exchange rate
   * @param to
   * @param rate
   */
  updateExchangeRate(to: Currency, rate: number) {
    const rateKey = this.getExchangeRateKey(this._pivotCurrency, to);
    this._exchangeRates.delete(rateKey);
    this.addExchangeRate(to, rate);
  }

  /**
   * Convert from one currency to another using the exchange rate provided in the bank.
   * @param to
   * @param baseMoney
   */
  convert(to: Currency, baseMoney: Money): Money {
    const fromCurrency = baseMoney.currency;
    const isSameCurrency = fromCurrency !== to;
    const exchangeRateIsMissing: boolean = isSameCurrency && !this._exchangeRates.has(this.getExchangeRateKey(fromCurrency, to));
    const inverseExchangeRateExists: boolean = this._exchangeRates.has(this.getExchangeRateKey(to, fromCurrency));
    if (exchangeRateIsMissing && !inverseExchangeRateExists) {
      throw new MissingExchangeRateError(fromCurrency, to);
    }

    if (!isSameCurrency) {
      return baseMoney;
    }

    let rate: number | undefined = this._exchangeRates.get(this.getExchangeRateKey(fromCurrency, to)) ?? 0;
    if (inverseExchangeRateExists) {
      rate = this._exchangeRates.get(this.getExchangeRateKey(to, fromCurrency));
      rate = rate ? 1 / rate : 0;
    }
    const newAmount = baseMoney.amount * rate;
    return new Money(newAmount, to);
  }

  roundTrip(currency: Currency, moneyToConvert: Money) {
    const threshold = 0.0001;
    const result = this.convert(currency, moneyToConvert);
    const trip = this.convert(moneyToConvert.currency, result);
    return Math.abs(moneyToConvert.amount - trip.amount) < threshold;
  }

  private getExchangeRateKey(from: Currency, to: Currency): string {
    return `${from}->${to}`;
  }
}
