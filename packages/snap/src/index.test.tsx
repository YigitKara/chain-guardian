import { installSnap } from '@metamask/snaps-simulation';

describe('Chain Guardian', () => {
  it('shows insight for a valid EVM address', async () => {
    const { onTransaction } = await installSnap(
      'local:http://localhost:8080' as any,
    );

    const response = await onTransaction({
      chainId: 'eip155:1',
      from: '0x1234567890123456789012345678901234567890',
      to: '0x742d35Cc6634C0532925a3b8D4C9C0B4b8E6d8A2',
      value: '0x0',
      gasLimit: '0x5208',
    });

    expect(response).not.toBeNull();
  });
});
