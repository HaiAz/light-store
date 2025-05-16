import dayjs from 'dayjs';

const SITE_CONFIGURATION_SETTING_KEY = 'site-config';
const CURRENCY_CODES = [ 'USD', 'EUR', 'VND' ] as const;
const LOCALES = [ 'en', 'vi', 'de' ] as const;
const COUNTRIES = [ 'US', 'VN', 'DE' ] as const;
const DATE_FORMAT = 'DD-MM-YYYY';
const PERIOD_TIME = [ 'day', 'week', 'month', 'year', 'all' ] as const;
const USER_ROLE = [ 'user', 'admin' ] as const;

type Currency = (typeof CURRENCY_CODES)[number];
type Locale = (typeof LOCALES)[number];
type Country = (typeof COUNTRIES)[number];
type PeriodTime = (typeof PERIOD_TIME)[number];
type UserRole = (typeof USER_ROLE)[number];

type FractionSetting = {
  maximumFractionDigits: number;
  minimumFractionDigits: number;
};

type LocaleSetting = {
  locale: Locale;
  iso: Country;
}

type Configs = {
  currencies: Currency[];
  locales: Locale[];
  localeSettings: LocaleSetting[];
};

type SelectDateTime = {
  timeStart: string,
  timeEnd: string,
}

const AllSiteConfigs: Configs = {
  currencies: [ 'EUR', 'USD', 'VND' ],
  locales: [ 'en', 'de', 'vi' ],
  localeSettings: [ {
    locale: 'en',
    iso: 'US',
  }, {
    locale: 'vi',
    iso: 'VN',
  }, {
    locale: 'de',
    iso: 'DE',
  } ],
};

function getNumberFormat(locale: Locale = 'en', currency: Currency | undefined) {
  if (!currency) {
    return (new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 2 })
      .formatToParts(1000.0));
  }

  return (new Intl.NumberFormat(locale, { maximumFractionDigits: 2 })
    .formatToParts(1000.0));
}

function formatNumber(number: number, locale: Locale, fraction: FractionSetting =
{ maximumFractionDigits: 2, minimumFractionDigits: 2 }) {
  return (new Intl.NumberFormat(locale, { ...fraction })).format(number);
}

function formatCurrency(number: number, locale: Locale, currency: Currency,
  fraction: FractionSetting = { maximumFractionDigits: 2, minimumFractionDigits: 2 }) {
  return (new Intl.NumberFormat(locale, { style: 'currency', currency, ...fraction })
    .format(number));
}

function formatDate(date: Date | string | null, format: string = DATE_FORMAT) {
  if (date === null) {
    return '';
  }
  return dayjs(date).format(format);
}

function parseDate(date: string | null) {
  if (date === null) {
    return new Date();
  }
  return dayjs(date).toDate();
}

export {
  type Currency,
  type Locale,
  type FractionSetting,
  type PeriodTime,
  type SelectDateTime,
  type UserRole,
  AllSiteConfigs,
  getNumberFormat,
  formatNumber,
  formatCurrency,
  formatDate,
  parseDate,
  COUNTRIES,
  LOCALES,
  DATE_FORMAT,
  CURRENCY_CODES,
  SITE_CONFIGURATION_SETTING_KEY,
  PERIOD_TIME,
  USER_ROLE,
};
