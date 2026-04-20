import { classifyEVMRisk } from './index';

type ChainFingerprint = {
  chainId: string;
  chainName: string;
  isContract: boolean;
  txCount: number;
  errored: boolean;
};

describe('Chain Guardian — address format regex', () => {
  it('detects EVM addresses correctly', () => {
    const evmAddress = '0x742d35Cc6634C0532925a3b8D4C9C0B4b8E6d8A2';
    expect(/^0x[0-9a-fA-F]{40}$/u.test(evmAddress)).toBe(true);
  });

  it('detects Solana addresses correctly', () => {
    const solanaAddress = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
    expect(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/u.test(solanaAddress)).toBe(true);
  });

  it('detects Bitcoin addresses correctly', () => {
    const invalid = '1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf Na';
    expect(/^1[a-km-zA-HJ-NP-Z1-9]{25,34}$/u.test(invalid)).toBe(false);
    const validBtc = '1BpEi6DfDAUFd153wiGrvkiKW1LghNFLNp';
    expect(/^1[a-km-zA-HJ-NP-Z1-9]{25,34}$/u.test(validBtc)).toBe(true);
  });
});

describe('Chain Guardian — EVM risk classifier', () => {
  const ethereum = '0x1';
  const base = '0x2105';
  const arbitrum = '0xa4b1';

  it('flags a contract-elsewhere, silent-here address as DANGEROUS', () => {
    const fingerprints: ChainFingerprint[] = [
      {
        chainId: ethereum,
        chainName: 'Ethereum Mainnet',
        isContract: false,
        txCount: 0,
        errored: false,
      },
      {
        chainId: base,
        chainName: 'Base',
        isContract: true,
        txCount: 10000,
        errored: false,
      },
    ];
    const risk = classifyEVMRisk(ethereum, fingerprints);
    expect(risk.level).toBe('dangerous');
  });

  it('flags high activity elsewhere with zero here as SUSPICIOUS', () => {
    const fingerprints: ChainFingerprint[] = [
      {
        chainId: ethereum,
        chainName: 'Ethereum Mainnet',
        isContract: false,
        txCount: 0,
        errored: false,
      },
      {
        chainId: arbitrum,
        chainName: 'Arbitrum',
        isContract: false,
        txCount: 500,
        errored: false,
      },
    ];
    const risk = classifyEVMRisk(ethereum, fingerprints);
    expect(risk.level).toBe('suspicious');
  });

  it('treats addresses active on the current chain as SAFE', () => {
    const fingerprints: ChainFingerprint[] = [
      {
        chainId: ethereum,
        chainName: 'Ethereum Mainnet',
        isContract: false,
        txCount: 42,
        errored: false,
      },
      {
        chainId: base,
        chainName: 'Base',
        isContract: false,
        txCount: 5,
        errored: false,
      },
    ];
    const risk = classifyEVMRisk(ethereum, fingerprints);
    expect(risk.level).toBe('safe');
  });

  it('degrades gracefully when the current-chain probe errors', () => {
    const fingerprints: ChainFingerprint[] = [
      {
        chainId: ethereum,
        chainName: 'Ethereum Mainnet',
        isContract: false,
        txCount: 0,
        errored: true,
      },
      {
        chainId: base,
        chainName: 'Base',
        isContract: true,
        txCount: 10000,
        errored: false,
      },
    ];
    const risk = classifyEVMRisk(ethereum, fingerprints);
    expect(risk.level).toBe('safe');
  });

  it('treats fresh/unused addresses as SAFE with a cautionary note', () => {
    const fingerprints: ChainFingerprint[] = [
      {
        chainId: ethereum,
        chainName: 'Ethereum Mainnet',
        isContract: false,
        txCount: 0,
        errored: false,
      },
      {
        chainId: base,
        chainName: 'Base',
        isContract: false,
        txCount: 0,
        errored: false,
      },
    ];
    const risk = classifyEVMRisk(ethereum, fingerprints);
    expect(risk.level).toBe('safe');
  });
});
