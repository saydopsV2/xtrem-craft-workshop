import { Bank } from '../src/Bank';
import { Currency } from '../src/Currency';

export default class BankDataBuilder {
  private _pivotCurrency: Currency | undefined;
  private to: Currency = Currency.USD;
  private rate: number = 0.9;

  withPivotCurrency(currency: Currency) {
    this._pivotCurrency = currency;
    return this;
  }

  withExchangeRate(to: Currency, rate: number) {
    this.to = to;
    this.rate = rate;
    return this;
  }

  build() {
    const bank = new Bank(this._pivotCurrency);
    const hasExchangeRate = this.to !== undefined && this.rate !== undefined;
    if (hasExchangeRate) {
      bank.addExchangeRate(this.to, this.rate);
    }
    return bank;
  }
}
