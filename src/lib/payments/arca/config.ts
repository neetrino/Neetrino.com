const ARCA_BANK_BASE_URLS = {
  idbank: {
    test: 'https://ipaytest.arca.am:8445/payment/rest',
    live: 'https://ipay.arca.am/payment/rest',
  },
  inecobank: {
    test: 'https://pg.inecoecom.am/payment/rest',
    live: 'https://pg.inecoecom.am/payment/rest',
  },
} as const;

type ArcaBank = keyof typeof ARCA_BANK_BASE_URLS;

type ArcaConfig = {
  baseUrl: string;
  userName: string;
  password: string;
  appUrl: string;
};

function readRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required for Arca payments.`);
  }

  return value;
}

function readArcaBank(): ArcaBank {
  const bank = process.env.ARCA_BANK?.trim().toLowerCase();

  if (bank === 'idbank' || bank === 'inecobank') {
    return bank;
  }

  throw new Error('ARCA_BANK must be one of: idbank, inecobank.');
}

export function getArcaConfig(): ArcaConfig {
  const isTestMode = process.env.ARCA_TEST_MODE === 'true';
  const credentialPrefix = isTestMode ? 'ARCA' : 'ARCA_LIVE';
  const bank = readArcaBank();
  const appUrl = readRequiredEnv('APP_URL').replace(/\/+$/, '');

  return {
    appUrl,
    baseUrl: ARCA_BANK_BASE_URLS[bank][isTestMode ? 'test' : 'live'],
    userName: readRequiredEnv(`${credentialPrefix}_USERNAME`),
    password: readRequiredEnv(`${credentialPrefix}_PASSWORD`),
  };
}
