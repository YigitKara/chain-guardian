import type {
  OnRpcRequestHandler,
  OnTransactionHandler,
} from '@metamask/snaps-sdk';
import { copyable, divider, heading, panel, text } from '@metamask/snaps-sdk';

// ============================================================
// ADDRESS FORMAT DETECTION
// Order matters! Most specific checks must come before broad ones.
// Solana check must be LAST among non-EVM since its regex is broadest.
// ============================================================

/**
 * Checks if an address is an EVM address.
 *
 * @param address - The address to check.
 * @returns True if the address is an EVM address.
 */
function isEVMAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/u.test(address);
}

/**
 * Checks if an address is a Bitcoin address.
 *
 * @param address - The address to check.
 * @returns True if the address is a Bitcoin address.
 */
function isBitcoinAddress(address: string): boolean {
  return (
    /^1[a-km-zA-HJ-NP-Z1-9]{25,34}$/u.test(address) ||
    /^3[a-km-zA-HJ-NP-Z1-9]{25,34}$/u.test(address) ||
    /^bc1[a-z0-9]{39,59}$/u.test(address)
  );
}

/**
 * Checks if an address is a Tron address.
 *
 * @param address - The address to check.
 * @returns True if the address is a Tron address.
 */
function isTronAddress(address: string): boolean {
  return /^T[a-zA-Z0-9]{33}$/u.test(address);
}

/**
 * Checks if an address is an XRP address.
 *
 * @param address - The address to check.
 * @returns True if the address is an XRP address.
 */
function isXRPAddress(address: string): boolean {
  return /^r[a-km-zA-HJ-NP-Z1-9]{24,34}$/u.test(address);
}

/**
 * Checks if an address is a Litecoin address.
 *
 * @param address - The address to check.
 * @returns True if the address is a Litecoin address.
 */
function isLitecoinAddress(address: string): boolean {
  return (
    /^L[a-km-zA-HJ-NP-Z1-9]{26,33}$/u.test(address) ||
    /^M[a-km-zA-HJ-NP-Z1-9]{26,33}$/u.test(address) ||
    /^ltc1[a-z0-9]{39,59}$/u.test(address)
  );
}

/**
 * Checks if an address is a Cardano address.
 *
 * @param address - The address to check.
 * @returns True if the address is a Cardano address.
 */
function isCardanoAddress(address: string): boolean {
  return (
    /^addr1[a-z0-9]{50,100}$/u.test(address) ||
    /^Ae2[a-km-zA-HJ-NP-Z1-9]{55,60}$/u.test(address)
  );
}

/**
 * Checks if an address is a Cosmos address.
 *
 * @param address - The address to check.
 * @returns True if the address is a Cosmos address.
 */
function isCosmosAddress(address: string): boolean {
  return /^cosmos1[a-z0-9]{38}$/u.test(address);
}

/**
 * Checks if an address is a Polkadot address.
 *
 * @param address - The address to check.
 * @returns True if the address is a Polkadot address.
 */
function isPolkadotAddress(address: string): boolean {
  return /^1[a-km-zA-HJ-NP-Z1-9]{47}$/u.test(address);
}

/**
 * Checks if an address is a Stellar address.
 *
 * @param address - The address to check.
 * @returns True if the address is a Stellar address.
 */
function isStellarAddress(address: string): boolean {
  return /^G[A-Z0-9]{55}$/u.test(address);
}

/**
 * Checks if an address is a Solana address.
 *
 * @param address - The address to check.
 * @returns True if the address is a Solana address.
 */
function isSolanaAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/u.test(address);
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

/**
 * Detects the blockchain network of an address.
 *
 * @param address - The address to detect.
 * @returns A ChainMatch object or null if undetected.
 */
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
      warning:
        'This looks like a Bitcoin address. Bitcoin is not compatible with EVM chains.',
    };
  }
  if (isTronAddress(address)) {
    return {
      name: 'Tron',
      isEVM: false,
      bridges: ['Sun.io (sun.io)', 'Swft Bridge (swft.pro)'],
      warning:
        'This looks like a Tron address. Tron is not compatible with EVM chains.',
    };
  }
  if (isXRPAddress(address)) {
    return {
      name: 'XRP (Ripple)',
      isEVM: false,
      bridges: ['Thorchain (thorchain.org)', 'Bitrue (bitrue.com)'],
      warning:
        'This looks like an XRP Ledger address. XRP is not compatible with EVM chains.',
    };
  }
  if (isLitecoinAddress(address)) {
    return {
      name: 'Litecoin',
      isEVM: false,
      bridges: ['Thorchain (thorchain.org)'],
      warning:
        'This looks like a Litecoin address. Litecoin is not compatible with EVM chains.',
    };
  }
  if (isCardanoAddress(address)) {
    return {
      name: 'Cardano',
      isEVM: false,
      bridges: ['Milkomeda (milkomeda.com)', 'Axelar (axelar.network)'],
      warning:
        'This looks like a Cardano address. Cardano is not compatible with EVM chains.',
    };
  }
  if (isCosmosAddress(address)) {
    return {
      name: 'Cosmos',
      isEVM: false,
      bridges: [
        'Gravity Bridge (gravitybridge.net)',
        'Axelar (axelar.network)',
      ],
      warning:
        'This looks like a Cosmos address. Cosmos is not compatible with EVM chains.',
    };
  }
  if (isPolkadotAddress(address)) {
    return {
      name: 'Polkadot',
      isEVM: false,
      bridges: ['Snowbridge (snowbridge.network)', 'Wormhole (wormhole.com)'],
      warning:
        'This looks like a Polkadot address. Polkadot is not compatible with EVM chains.',
    };
  }
  if (isStellarAddress(address)) {
    return {
      name: 'Stellar',
      isEVM: false,
      bridges: ['Allbridge (allbridge.io)', 'StellarTerm (stellarterm.com)'],
      warning:
        'This looks like a Stellar address. Stellar is not compatible with EVM chains.',
    };
  }
  if (isSolanaAddress(address)) {
    return {
      name: 'Solana',
      isEVM: false,
      bridges: ['Wormhole (wormhole.com)', 'Allbridge (allbridge.io)'],
      warning:
        'This looks like a Solana address. Solana uses a completely different network than EVM chains.',
    };
  }
  return null;
}

// ============================================================
// CHAIN ID MAPPING
// ============================================================

/**
 * Normalizes a chain ID to hex format.
 *
 * @param chainId - The chain ID to normalize.
 * @returns The normalized chain ID.
 */
function normalizeChainId(chainId: string): string {
  if (chainId.startsWith('eip155:')) {
    const chainNumber = parseInt(chainId.replace('eip155:', ''), 10);
    return `0x${chainNumber.toString(16)}`;
  }
  return chainId;
}

/**
 * Gets the human-readable name of a chain.
 *
 * @param chainId - The chain ID.
 * @returns The chain name.
 */
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

/**
 * Builds the warning panel content.
 *
 * @param currentChainName - The name of the current chain.
 * @param detected - The detected chain match.
 * @param toAddress - The destination address.
 * @param isPreview - Whether this is a preview.
 * @returns The panel content.
 */
function buildWarningContent(
  currentChainName: string,
  detected: ChainMatch,
  toAddress: string,
  isPreview = false,
) {
  const bridgeList = detected.bridges.map((bridge) => `→ ${bridge}`).join('\n');
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
          content: buildWarningContent(
            currentChainName,
            detected,
            address,
            true,
          ),
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
      text(
        'Proceed only if you are certain this address is correct for this network.',
      ),
      divider(),
      text('**Destination address:**'),
      copyable(toAddress),
    ]),
  };
};
