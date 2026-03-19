import { Bank } from '../src/Bank';
import { Currency } from '../src/Currency';

export default class BankDataBuilder {
  private _pivotCurrency: Currency | undefined;

  withPivotCurrency(currency: Currency) {
    this._pivotCurrency = currency;
  }

  build() {
    return new Bank(this._pivotCurrency);
  }
}
