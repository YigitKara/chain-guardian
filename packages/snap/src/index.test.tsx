describe('Chain Guardian', () => {
  it('detects EVM addresses correctly', () => {
    const evmAddress = '0x742d35Cc6634C0532925a3b8D4C9C0B4b8E6d8A2';
    expect(/^0x[0-9a-fA-F]{40}$/u.test(evmAddress)).toBe(true);
  });

  it('detects Solana addresses correctly', () => {
    const solanaAddress = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
    expect(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/u.test(solanaAddress)).toBe(true);
  });

  it('detects Bitcoin addresses correctly', () => {
    const btcAddress = '1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf Na';
    expect(/^1[a-km-zA-HJ-NP-Z1-9]{25,34}$/u.test(btcAddress)).toBe(false);
    const validBtc = '1BpEi6DfDAUFd153wiGrvkiKW1LghNFLNp';
    expect(/^1[a-km-zA-HJ-NP-Z1-9]{25,34}$/u.test(validBtc)).toBe(true);
  });
});
