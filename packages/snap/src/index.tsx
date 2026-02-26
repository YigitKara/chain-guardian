import type { OnTransactionHandler, OnRpcRequestHandler } from '@metamask/snaps-sdk';
import {
  heading,
  panel,
  text,
  divider,
  copyable,
} from '@metamask/snaps-sdk';

// ============================================================
// ADDRESS FORMAT DETECTION
// Order matters! Most specific checks must come before broad ones.
// Solana check must be LAST among non-EVM since its regex is broadest.
// ============================================================

function isEVMAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

function isBitcoinAddress(address: string): boolean {
  return (
    /^1[a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address) ||
    /^3[a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address) ||
    /^bc1[a-z0-9]{39,59}$/.test(address)
  );
}

function isTronAddress(address: string): boolean {
  return /^T[a-zA-Z0-9]{33}$/.test(address);
}

function isXRPAddress(address: string): boolean {
  return /^r[a-km-zA-HJ-NP-Z1-9]{24,34}$/.test(address);
}

function isLitecoinAddress(address: string): boolean {
  return (
    /^L[a-km-zA-HJ-NP-Z1-9]{26,33}$/.test(address) ||
    /^M[a-km-zA-HJ-NP-Z1-9]{26,33}$/.test(address) ||
    /^ltc1[a-z0-9]{39,59}$/.test(address)
  );
}

function isCardanoAddress(address: string): boolean {
  return (
    /^addr1[a-z0-9]{50,100}$/.test(address) ||
    /^Ae2[a-km-zA-HJ-NP-Z1-9]{55,60}$/.test(address)
  );
}

function isCosmosAddress(address: string): boolean {
  return /^cosmos1[a-z0-9]{38}$/.test(address);
}

function isPolkadotAddress(address: string): boolean {
  // Polkadot SS58: starts with 1, exactly 48 chars, base58
  return /^1[a-km-zA-HJ-NP-Z1-9]{47}$/.test(address);
}

function isStellarAddress(address: string): boolean {
  // Stellar: starts with G, exactly 56 chars, base32 uppercase
  return /^G[A-Z0-9]{55}$/.test(address);
}

function isSolanaAddress(address: string): boolean {
  // Solana: base58, 32-44 chars — checked LAST because it's the broadest
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

// ============================================================
// CHAIN DETECTION
// ============================================================

type ChainMatch = {
  name: string;
  isEVM: boolean;
  bridges: string[];
  warning: string;
};

function detectAddressType(address: string): ChainMatch | null {
  if (isEVMAddress(address)) {
    return {
      name: 'EVM (Ethereum / Polygon / BSC / etc.)',
      isEVM: true,
      bridges: [],
      warning: '',
    };
  }
  if (isBitcoinAddress(address)) {
    return {
      name: 'Bitcoin',
      isEVM: false,
      bridges: ['Thorchain (thorchain.org)', 'RenBridge (renproject.io)'],
      warning: 'This looks like a Bitcoin address. Bitcoin is not compatible with EVM chains.',
    };
  }
  if (isTronAddress(address)) {
    return {
      name: 'Tron',
      isEVM: false,
      bridges: ['Sun.io (sun.io)', 'Swft Bridge (swft.pro)'],
      warning: 'This looks like a Tron address. Tron is not compatible with EVM chains.',
    };
  }
  if (isXRPAddress(address)) {
    return {
      name: 'XRP (Ripple)',
      isEVM: false,
      bridges: ['Thorchain (thorchain.org)', 'Bitrue (bitrue.com)'],
      warning: 'This looks like an XRP Ledger address. XRP is not compatible with EVM chains.',
    };
  }
  if (isLitecoinAddress(address)) {
    return {
      name: 'Litecoin',
      isEVM: false,
      bridges: ['Thorchain (thorchain.org)'],
      warning: 'This looks like a Litecoin address. Litecoin is not compatible with EVM chains.',
    };
  }
  if (isCardanoAddress(address)) {
    return {
      name: 'Cardano',
      isEVM: false,
      bridges: ['Milkomeda (milkomeda.com)', 'Axelar (axelar.network)'],
      warning: 'This looks like a Cardano address. Cardano is not compatible with EVM chains.',
    };
  }
  if (isCosmosAddress(address)) {
    return {
      name: 'Cosmos',
      isEVM: false,
      bridges: ['Gravity Bridge (gravitybridge.net)', 'Axelar (axelar.network)'],
      warning: 'This looks like a Cosmos address. Cosmos is not compatible with EVM chains.',
    };
  }
  if (isPolkadotAddress(address)) {
    return {
      name: 'Polkadot',
      isEVM: false,
      bridges: ['Snowbridge (snowbridge.network)', 'Wormhole (wormhole.com)'],
      warning: 'This looks like a Polkadot address. Polkadot is not compatible with EVM chains.',
    };
  }
  if (isStellarAddress(address)) {
    return {
      name: 'Stellar',
      isEVM: false,
      bridges: ['Allbridge (allbridge.io)', 'StellarTerm (stellarterm.com)'],
      warning: 'This looks like a Stellar address. Stellar is not compatible with EVM chains.',
    };
  }
  if (isSolanaAddress(address)) {
    return {
      name: 'Solana',
      isEVM: false,
      bridges: ['Wormhole (wormhole.com)', 'Allbridge (allbridge.io)'],
      warning: 'This looks like a Solana address. Solana uses a completely different network than EVM chains.',
    };
  }
  return null;
}

// ============================================================
// CHAIN ID MAPPING
// ============================================================

function normalizeChainId(id: string): string {
  if (id.startsWith('eip155:')) {
    const num = parseInt(id.replace('eip155:', ''), 10);
    return '0x' + num.toString(16);
  }
  return id;
}

function getChainName(chainId: string): string {
  const chains: Record<string, string> = {
    '0x1': 'Ethereum Mainnet',
    '0xaa36a7': 'Sepolia Testnet',
    '0x89': 'Polygon',
    '0x38': 'BNB Smart Chain',
    '0xa86a': 'Avalanche',
    '0xa': 'Optimism',
    '0xa4b1': 'Arbitrum',
    '0x2105': 'Base',
    '0xe708': 'Linea',
    '0xfa': 'Fantom',
    '0x19': 'Cronos',
  };
  const normalized = normalizeChainId(chainId);
  return chains[normalized] ?? `Unknown Chain (${chainId})`;
}

// ============================================================
// SHARED UI BUILDER
// ============================================================

function buildWarningContent(
  currentChainName: string,
  detected: ChainMatch,
  toAddress: string,
  isPreview = false,
) {
  const bridgeList = detected.bridges.map((b) => `→ ${b}`).join('\n');
  return panel([
    heading(`🚨 Wrong Chain Detected!${isPreview ? ' (Preview)' : ''}`),
    divider(),
    text(`**You are on:** ${currentChainName}`),
    text(`**Address looks like:** ${detected.name}`),
    divider(),
    text(`⚠️ ${detected.warning}`),
    divider(),
    text('**Your funds will be permanently lost if you proceed.**'),
    divider(),
    text('**What to do instead:**'),
    text('❌ Cancel this transaction immediately'),
    text('🌉 Use a bridge to send cross-chain:'),
    text(bridgeList),
    divider(),
    text('**Destination address:**'),
    copyable(toAddress),
  ]);
}

// ============================================================
// RPC HANDLER — for previewing warnings from the test site
// ============================================================

export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  if (request.method === 'previewWarning') {
    const { address, chainId } = request.params as {
      address: string;
      chainId: string;
    };
    const currentChainName = getChainName(chainId);
    const detected = detectAddressType(address);
    if (detected && !detected.isEVM) {
      await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'alert',
          content: buildWarningContent(currentChainName, detected, address, true),
        },
      });
    }
    return null;
  }
  throw new Error('Method not found.');
};

// ============================================================
// MAIN SNAP HANDLER
// ============================================================

export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
}) => {
  const toAddress = transaction.to as string | undefined;

  if (!toAddress) {
    return null;
  }

  const currentChainName = getChainName(chainId);
  const detected = detectAddressType(toAddress);

  if (detected && !detected.isEVM) {
    return {
      content: buildWarningContent(currentChainName, detected, toAddress),
    };
  }

  if (detected?.isEVM) {
    return {
      content: panel([
        heading('✅ Address Looks Compatible'),
        divider(),
        text(`**Network:** ${currentChainName}`),
        divider(),
        text('The destination address format is compatible with this network.'),
        text('Always verify the full address before confirming.'),
        divider(),
        text('**Sending to:**'),
        copyable(toAddress),
      ]),
    };
  }

  return {
    content: panel([
      heading('⚠️ Unrecognized Address'),
      divider(),
      text(`**Network:** ${currentChainName}`),
      text('This address format is not recognized.'),
      text('Proceed only if you are certain this address is correct for this network.'),
      divider(),
      text('**Destination address:**'),
      copyable(toAddress),
    ]),
  };
};

