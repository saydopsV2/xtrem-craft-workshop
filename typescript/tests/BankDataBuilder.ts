import { Bank } from '../src/Bank';
import { Currency } from '../src/Currency';

export default class BankDataBuilder {
  private _from: Currency | null = null;
  private _to: Currency | null = null;
  private _rate: number | null = null;

  withExchangeRate(from: Currency, to: Currency, rate: number) {
    this._from = from;
    this._to = to;
    this._rate = rate;
  }
  build() {
    const hasExchangeRate: boolean = this._from !== null && this._to !== null && this._rate !== null;
    if (hasExchangeRate) return Bank.createWithExchangeRate(this._from, this._to, this._rate);
  }
}
