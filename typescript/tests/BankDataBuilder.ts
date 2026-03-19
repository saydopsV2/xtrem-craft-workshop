import { Bank } from '../src/Bank';
import { Currency } from '../src/Currency';

export default class BankDataBuilder {
  private _pivotCurrency: Currency | undefined;
  private from: Currency = Currency.EUR;
  private to: Currency = Currency.USD;
  private rate: number = 0.9;

  withPivotCurrency(currency: Currency) {
    this._pivotCurrency = currency;
  }

  withExchangeRate(from: Currency, to: Currency, rate: number) {
    this.from = from;
    this.to = to;
    this.rate = rate;
  }

  build() {
    const bank = new Bank(this._pivotCurrency);
    const hasExchangeRate = this.from !== undefined && this.to !== undefined && this.rate !== undefined;
    if (hasExchangeRate) {
      bank.addExchangeRate(this.from, this.to, this.rate);
    }
    return bank;
  }
}
