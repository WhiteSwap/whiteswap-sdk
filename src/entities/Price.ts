import { Fraction } from './Fraction'
import { CurrencyAmount } from './CurrencyAmount'
import invariant from 'tiny-invariant'
import JSBI from 'jsbi'
import _Big from 'big.js'
import toFormat from 'toformat'
import { MAX_DECIMAL_PLACES } from '../constants/index'
import { Currency, BigintIsh, Rounding } from '../types'

const Big = toFormat(_Big)

export class Price<TBase extends Currency, TQuote extends Currency> extends Fraction {
  public readonly baseCurrency: TBase // input i.e. denominator
  public readonly quoteCurrency: TQuote // output i.e. numerator
  public readonly scalar: Fraction // used to adjust the raw fraction w/r/t the decimals of the {base,quote}Token

  /**
   * Construct a price, either with the base and quote currency amount, or the
   * @param args
   */
  public constructor(baseCurrency: TBase, quoteCurrency: TQuote, denominator: BigintIsh, numerator: BigintIsh) {
    super(numerator, denominator)

    this.baseCurrency = baseCurrency
    this.quoteCurrency = quoteCurrency
    this.scalar = new Fraction(
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(baseCurrency.decimals)),
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(quoteCurrency.decimals))
    )
  }

  /**
   * Flip the price, switching the base and quote currency
   */
  public invert(): Price<TQuote, TBase> {
    return new Price(this.quoteCurrency, this.baseCurrency, this.numerator, this.denominator)
  }

  /**
   * Multiply the price by another price, returning a new price. The other price must have the same base currency as this price's quote currency
   * @param other the other price
   */
  public multiply<TOtherQuote extends Currency>(other: Price<TQuote, TOtherQuote>): Price<TBase, TOtherQuote> {
    invariant(this.quoteCurrency.equals(other.baseCurrency), 'TOKEN')
    const fraction = super.multiply(other)
    return new Price(this.baseCurrency, other.quoteCurrency, fraction.denominator, fraction.numerator)
  }

  /**
   * Return the amount of quote currency corresponding to a given amount of the base currency
   * @param currencyAmount the amount of base currency to quote against the price
   */
  public quote(currencyAmount: CurrencyAmount<TBase>): CurrencyAmount<TQuote> {
    invariant(currencyAmount.currency.equals(this.baseCurrency), 'TOKEN')
    const result = super.multiply(currencyAmount)
    return CurrencyAmount.fromFractionalAmount(this.quoteCurrency, result.numerator, result.denominator)
  }

  /**
   * Get the value scaled by decimals for formatting
   * @private
   */
  private get adjustedForDecimals(): Fraction {
    return super.multiply(this.scalar)
  }

  public toSignificant(significantDigits: number = 6, format?: object, rounding?: Rounding): string {
    return this.adjustedForDecimals.toSignificant(significantDigits, format, rounding)
  }

  public toFixed(decimalPlaces: number = 4, format?: object, rounding?: Rounding): string {
    return this.adjustedForDecimals.toFixed(decimalPlaces, format, rounding)
  }

  public toDecimalPlaces(decimalPlaces?: number, format?: object, rounding?: Rounding): string {
    const { decimals } = this.quoteCurrency
    if (decimalPlaces) {
      invariant(
        decimalPlaces <= decimals,
        `decimalsPlaces param must be less or equal to token decimals. Received: ${decimalPlaces}, currency decimals: ${decimals}`
      )
    }
    const defaultDecimalsPlaces = decimals < MAX_DECIMAL_PLACES ? decimals : MAX_DECIMAL_PLACES

    return this.adjustedForDecimals.toDecimalPlaces(decimalPlaces ?? defaultDecimalsPlaces, format, rounding)
  }

  public toExact(format: object = { groupSeparator: '' }): string {
    Big.DP = this.quoteCurrency.decimals
    return new Big(this.adjustedForDecimals.numerator.toString()).div(this.adjustedForDecimals.denominator.toString()).toFormat(format)
  }
}
