import { Bank } from '../src/Bank';
import { Currency } from '../src/Currency';

export default class BankDataBuilder {
  private _pivotCurrency: Currency | undefined;
  private from: Currency | undefined;
  private to: Currency | undefined;
  private rate: number | undefined;

  withPivotCurrency(currency: Currency) {
    this._pivotCurrency = currency;
  }

  withExchangeRate(from: Currency, to: Currency, rate: number) {
    this.from = from;
    this.to = to;
    this.rate = rate;
  }

  build() {
    return new Bank(this._pivotCurrency);
  }
}
