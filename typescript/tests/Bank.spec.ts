import { Currency } from '../src/Currency';
import { MissingExchangeRateError } from '../src/MissingExchangeRateError';
import Money from '../src/Money';
import BankDataBuilder from './BankDataBuilder';

describe('Bank', function () {
  it('should throw if bank is not created with a pivot currency', () => {
    // Act
    const dataBuilder = new BankDataBuilder();
    const createBank = () => dataBuilder.build();
    // Assert
    try {
      createBank();
    } catch (error) {
      expect((error as Error).message).toBe('The bank should have a pivot currency');
    }
  });
  it('should convert between different currencies when exchange rate is provided', () => {
    //ARRANGE
    const bankDataBuilder = new BankDataBuilder();
    bankDataBuilder.withPivotCurrency(Currency.EUR);
    bankDataBuilder.withExchangeRate(Currency.USD, 1.2);
    const bank = bankDataBuilder.build();
    const to = Currency.USD;
    const baseMoney = new Money(10, Currency.EUR);
    //ACT
    const convertedMoney = bank.convert(to, baseMoney);
    //ASSERT
    expect(convertedMoney.amount).toBe(12);
  });

  it('Should test if converting two same currencies return same value', () => {
    //ARRANGE
    const bankDataBuilder = new BankDataBuilder();
    bankDataBuilder.withPivotCurrency(Currency.EUR);
    bankDataBuilder.withExchangeRate(Currency.USD, 1.2);
    const bank = bankDataBuilder.build();
    const to = Currency.EUR;
    const baseMoney = new Money(10, Currency.EUR);
    //ACT
    const convertedMoney = bank.convert(to, baseMoney);
    //ASSERT
    expect(convertedMoney.amount).toBe(10);
  });

  it('Should test if converting without an exchange rate return an error', () => {
    //ARRANGE
    const bankDataBuilder = new BankDataBuilder();
    bankDataBuilder.withPivotCurrency(Currency.EUR);
    bankDataBuilder.withExchangeRate(Currency.USD, 1.2);
    const bank = bankDataBuilder.build();
    const to = Currency.KRW;
    const baseMoney = new Money(10, Currency.EUR);
    //ACT
    const convertedMoney = () => bank.convert(to, baseMoney);
    //ASSERT
    expect(convertedMoney).toThrowError(MissingExchangeRateError);
  });

  it('convert with different exchange rates returns different numbers', () => {
    //ARRANGE
    const currency1 = Currency.EUR;
    const currency2 = Currency.USD;
    const bankDataBuilder = new BankDataBuilder();
    bankDataBuilder.withPivotCurrency(currency1);
    bankDataBuilder.withExchangeRate(currency2, 1.2);
    const bank = bankDataBuilder.build();
    const to = currency2;
    const baseMoney = new Money(10, currency1);
    //ACT
    const result12 = bank.convert(to, baseMoney);
    bank.addExchangeRate(currency2, 1.3);
    const result13 = bank.convert(to, baseMoney);
    //ASSERT
    expect(result12.amount).toBe(12);
    expect(result13.amount).toBe(13);
  });
  it('should fail if exchange rate is below 0', () => {
    // Arrange
    const bankDataBuilder = new BankDataBuilder();
    bankDataBuilder.withPivotCurrency(Currency.EUR).withExchangeRate(Currency.USD, 1.1);
    const bank = bankDataBuilder.build();

    //ACT
    const result = () => bank.addExchangeRate(Currency.KRW, -9.7);

    //ASSERT
    expect(result).toThrow(Error);
  });
});
