import { Currency } from '../src/Currency';
import Money from '../src/Money';
import { Portfolio } from '../src/Portfolio';
import BankDataBuilder from './BankDataBuilder';

describe('portfolio', function () {
  test('should evaluate an empty portfolio', () => {
    //ARRANGE
    const portfolio = new Portfolio();
    //ASSERT
    expect(portfolio.getCurrencies().size).toBe(0);
  });

  test('when we add money it should only add on the same currency', () => {
    //ARRANGE
    const portfolio = new Portfolio();
    portfolio.addMoneyInACurrency(new Money(100, Currency.EUR));
    portfolio.addMoneyInACurrency(new Money(8, Currency.USD));
    portfolio.addMoneyInACurrency(new Money(12, Currency.EUR));
    const expectedEur = new Money(112, Currency.EUR);
    //ACT
    const currencies = portfolio.getCurrencies();
    //ASSERT
    expect(currencies.get(Currency.EUR)).toStrictEqual(expectedEur);
  });

  test('should sum eur and usd together and return the right usd amount', () => {
    //ARRANGE
    const portfolio = new Portfolio();
    const bankDataBuilder = new BankDataBuilder();
    bankDataBuilder.withPivotCurrency(Currency.EUR);
    bankDataBuilder.withExchangeRate(Currency.EUR, Currency.USD, 1.4);
    const bank = bankDataBuilder.build();
    portfolio.addMoneyInACurrency(new Money(10, Currency.EUR));
    portfolio.addMoneyInACurrency(new Money(1, Currency.USD));
    //ACT
    const sum: Money = portfolio.sumCurrenciesInOneCurrency(Currency.USD, bank);
    //ASSERT
    expect(sum.amount).toBe(15);
  });
});
