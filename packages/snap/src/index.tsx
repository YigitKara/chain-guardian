import type {
  OnTransactionHandler,
  OnNameLookupHandler,
  OnRpcRequestHandler,
} from '@metamask/snaps-sdk';
import { heading, panel, text, divider, copyable } from '@metamask/snaps-sdk';

// ============================================================
// ADDRESS FORMAT DETECTION
// ============================================================

function isEVMAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

function isSolanaAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
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
  return /^addr1[a-z0-9]{50,100}$/.test(address);
}

function isCosmosAddress(address: string): boolean {
  return /^cosmos1[a-z0-9]{38}$/.test(address);
}

function isPolkadotAddress(address: string): boolean {
  return /^1[a-km-zA-HJ-NP-Z1-9]{46,47}$/.test(address);
}

function isStellarAddress(address: string): boolean {
  return /^G[A-Z2-7]{55}$/.test(address);
}

type ChainInfo = {
  name: string;
  isEVM: boolean;
  emoji: string;
  warning: string;
  bridges: string[];
};

function detectAddressType(address: string): ChainInfo | null {
  if (isEVMAddress(address)) {
    return {
      name: 'EVM (Ethereum / Polygon / BNB / etc.)',
      isEVM: true,
      emoji: '✅',
      warning: '',
      bridges: [],
    };
  }
  if (isSolanaAddress(address)) {
    return {
      name: 'Solana',
      isEVM: false,
      emoji: '🚨',
      warning:
        'This looks like a Solana address. Solana uses a completely different network than EVM chains.',
      bridges: ['Wormhole (wormhole.com)', 'Allbridge (allbridge.io)'],
    };
  }
  if (isBitcoinAddress(address)) {
    return {
      name: 'Bitcoin',
      isEVM: false,
      emoji: '🚨',
      warning:
        'This looks like a Bitcoin address. Bitcoin is not compatible with EVM chains.',
      bridges: ['Thorchain (thorchain.org)', 'Ren Protocol (renproject.io)'],
    };
  }
  if (isTronAddress(address)) {
    return {
      name: 'Tron',
      isEVM: false,
      emoji: '🚨',
      warning:
        'This looks like a Tron address. Tron is not compatible with EVM chains.',
      bridges: ['Sun.io (sun.io)', 'Swft Bridge (swft.pro)'],
    };
  }
  if (isXRPAddress(address)) {
    return {
      name: 'XRP Ledger',
      isEVM: false,
      emoji: '🚨',
      warning:
        'This looks like an XRP address. XRP Ledger is not compatible with EVM chains.',
      bridges: ['Wanchain (wanchain.org)'],
    };
  }
  if (isLitecoinAddress(address)) {
    return {
      name: 'Litecoin',
      isEVM: false,
      emoji: '🚨',
      warning:
        'This looks like a Litecoin address. Litecoin is not compatible with EVM chains.',
      bridges: ['Thorchain (thorchain.org)'],
    };
  }
  if (isCardanoAddress(address)) {
    return {
      name: 'Cardano',
      isEVM: false,
      emoji: '🚨',
      warning:
        'This looks like a Cardano address. Cardano is not compatible with EVM chains.',
      bridges: ['Wanchain (wanchain.org)'],
    };
  }
  if (isCosmosAddress(address)) {
    return {
      name: 'Cosmos',
      isEVM: false,
      emoji: '🚨',
      warning:
        'This looks like a Cosmos address. Cosmos is not compatible with EVM chains.',
      bridges: ['Gravity Bridge (gravitybridge.net)'],
    };
  }
  if (isPolkadotAddress(address)) {
    return {
      name: 'Polkadot',
      isEVM: false,
      emoji: '🚨',
      warning:
        'This looks like a Polkadot address. Polkadot is not compatible with EVM chains.',
      bridges: ['Wanchain (wanchain.org)'],
    };
  }
  if (isStellarAddress(address)) {
    return {
      name: 'Stellar',
      isEVM: false,
      emoji: '🚨',
      warning:
        'This looks like a Stellar address. Stellar is not compatible with EVM chains.',
      bridges: ['Allbridge (allbridge.io)'],
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
    '0x171': 'Cronos zkEVM',
    '0x144': 'zkSync Era',
    '0x44d': 'Polygon zkEVM',
  };
  const normalized = normalizeChainId(chainId);
  return chains[normalized] ?? `Chain ${chainId}`;
}

// ============================================================
// SHARED UI BUILDERS
// ============================================================

function buildMismatchWarning(
  toAddress: string,
  currentChainName: string,
  detected: ChainInfo,
) {
  const bridgeList = detected.bridges.map((b) => `→ ${b}`).join('\n');

  return panel([
    heading('🚨 Wrong Chain Detected!'),
    divider(),
    text(`**You are on:** ${currentChainName}`),
    text(`**Address type:** ${detected.name}`),
    divider(),
    text(`⚠️ ${detected.warning}`),
    divider(),
    text('**Your funds will be permanently lost if you proceed.**'),
    divider(),
    text('**What to do:**'),
    text('❌ Cancel this transaction immediately'),
    text('🌉 Use a bridge to send cross-chain:'),
    text(bridgeList),
    divider(),
    text('**Destination address:**'),
    copyable(toAddress),
  ]);
}

function buildSafeConfirmation(toAddress: string, currentChainName: string) {
  return panel([
    heading('✅ Address Format Compatible'),
    divider(),
    text(`**Network:** ${currentChainName}`),
    divider(),
    text('The destination address format matches this network.'),
    text('Always verify the full address before confirming.'),
    divider(),
    text('**Sending to:**'),
    copyable(toAddress),
  ]);
}

function buildUnknownWarning(toAddress: string, currentChainName: string) {
  return panel([
    heading('⚠️ Unrecognized Address Format'),
    divider(),
    text(`**Network:** ${currentChainName}`),
    text('This address format is not recognized by Chain Guardian.'),
    text(
      'Proceed only if you are certain this address is correct for this network.',
    ),
    divider(),
    text('**Destination address:**'),
    copyable(toAddress),
  ]);
}

// ============================================================
// onTransaction — fires on EVM confirmation screen
// ============================================================

export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
}) => {
  const toAddress = transaction.to as string | undefined;

  // No destination = contract deployment, skip
  if (!toAddress) {
    return null;
  }

  const currentChainName = getChainName(chainId);
  const detected = detectAddressType(toAddress);

  if (detected && !detected.isEVM) {
    return { content: buildMismatchWarning(toAddress, currentChainName, detected) };
  }

  if (detected?.isEVM) {
    return { content: buildSafeConfirmation(toAddress, currentChainName) };
  }

  return { content: buildUnknownWarning(toAddress, currentChainName) };
};

// ============================================================
// onNameLookup — fires WHILE USER IS TYPING in the send field
// This catches non-EVM addresses BEFORE MetaMask rejects them
// ============================================================

export const onNameLookup: OnNameLookupHandler = async (request) => {
  const { chainId, address } = request;

  // Only act when an address is typed (not a domain name)
  if (!address) {
    return null;
  }

  const currentChainName = getChainName(chainId);
  const detected = detectAddressType(address);

  // If it's a non-EVM address typed into an EVM chain — warn immediately
  if (detected && !detected.isEVM) {
    return {
      resolvedDomains: [
        {
          resolvedDomain: `🚨 ${detected.name} address on ${currentChainName} — funds will be lost!`,
          protocol: 'Chain Guardian',
        },
      ],
    };
  }

  // If it's a valid EVM address — show a reassuring confirmation
  if (detected?.isEVM) {
    return {
      resolvedDomains: [
        {
          resolvedDomain: `✅ EVM address — compatible with ${currentChainName}`,
          protocol: 'Chain Guardian',
        },
      ],
    };
  }

  // Unknown format — mild warning
  return {
    resolvedDomains: [
      {
        resolvedDomain: `⚠️ Unrecognized address format — verify before sending`,
        protocol: 'Chain Guardian',
      },
    ],
  };
};

// ============================================================
// onRpcRequest — for demo/preview dialogs from the test site
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
          content: buildMismatchWarning(address, currentChainName, detected),
        },
      });
    }
    return null;
  }
  throw new Error('Method not found.');
};
