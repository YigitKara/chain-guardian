import type {
  OnNameLookupHandler,
  OnRpcRequestHandler,
  OnTransactionHandler,
} from '@metamask/snaps-sdk';
import { copyable, divider, heading, panel, text } from '@metamask/snaps-sdk';

// ============================================================
// ADDRESS FORMAT DETECTION (unchanged from v0.1)
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
// CROSS-ECOSYSTEM CHAIN DETECTION (unchanged)
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
  const normalized = normalizeChainId(chainId);
  return EVM_CHAINS[normalized]?.name ?? `Unknown Chain (${chainId})`;
}

// ============================================================
// EVM CHAIN REGISTRY
// Public RPC endpoints. These are rate-limited but free.
// For production use a paid provider key (Alchemy, Infura, etc.)
// via an environment-injected config.
// ============================================================

type EVMChain = {
  name: string;
  rpcUrl: string;
};

const EVM_CHAINS: Record<string, EVMChain> = {
  '0x1': { name: 'Ethereum Mainnet', rpcUrl: 'https://eth.llamarpc.com' },
  '0x89': { name: 'Polygon', rpcUrl: 'https://polygon-rpc.com' },
  '0x38': { name: 'BNB Smart Chain', rpcUrl: 'https://bsc-dataseed.binance.org' },
  '0xa86a': { name: 'Avalanche', rpcUrl: 'https://api.avax.network/ext/bc/C/rpc' },
  '0xa': { name: 'Optimism', rpcUrl: 'https://mainnet.optimism.io' },
  '0xa4b1': { name: 'Arbitrum', rpcUrl: 'https://arb1.arbitrum.io/rpc' },
  '0x2105': { name: 'Base', rpcUrl: 'https://mainnet.base.org' },
  '0xe708': { name: 'Linea', rpcUrl: 'https://rpc.linea.build' },
  '0xfa': { name: 'Fantom', rpcUrl: 'https://rpc.ftm.tools' },
  '0x19': { name: 'Cronos', rpcUrl: 'https://evm.cronos.org' },
  '0xaa36a7': { name: 'Sepolia Testnet', rpcUrl: 'https://rpc.sepolia.org' },
};

// ============================================================
// EVM CHAIN FINGERPRINTING
// Core idea: query eth_getCode and eth_getTransactionCount across
// chains. An address that is a contract on chain A and completely
// silent on chain B is a near-certain wrong-chain mistake.
// ============================================================

type ChainFingerprint = {
  chainId: string;
  chainName: string;
  isContract: boolean;
  txCount: number;
  errored: boolean;
};

/**
 * Fetches a chain fingerprint for a single address on a single chain.
 *
 * @param address - The target address.
 * @param chainId - Normalized hex chain ID.
 * @param timeoutMs - Per-request timeout.
 * @returns ChainFingerprint with errored=true if the request failed.
 */
async function fetchChainFingerprint(
  address: string,
  chainId: string,
  timeoutMs: number,
): Promise<ChainFingerprint> {
  const chain = EVM_CHAINS[chainId];
  if (!chain) {
    return {
      chainId,
      chainName: `Unknown (${chainId})`,
      isContract: false,
      txCount: 0,
      errored: true,
    };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const body = JSON.stringify([
      { jsonrpc: '2.0', id: 1, method: 'eth_getCode', params: [address, 'latest'] },
      { jsonrpc: '2.0', id: 2, method: 'eth_getTransactionCount', params: [address, 'latest'] },
    ]);

    const response = await fetch(chain.rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const results = (await response.json()) as {
      id: number;
      result?: string;
      error?: unknown;
    }[];

    const codeResult = results.find((item) => item.id === 1);
    const nonceResult = results.find((item) => item.id === 2);

    const code = codeResult?.result ?? '0x';
    const nonceHex = nonceResult?.result ?? '0x0';

    return {
      chainId,
      chainName: chain.name,
      isContract: code !== '0x' && code !== '0x0',
      txCount: parseInt(nonceHex, 16) || 0,
      errored: false,
    };
  } catch {
    clearTimeout(timer);
    return {
      chainId,
      chainName: chain.name,
      isContract: false,
      txCount: 0,
      errored: true,
    };
  }
}

/**
 * Fetches fingerprints across multiple chains in parallel.
 *
 * @param address - The target address.
 * @param chainIds - Normalized hex chain IDs to query.
 * @param timeoutMs - Per-request timeout.
 * @returns Array of fingerprints (one per chain).
 */
async function fetchAllFingerprints(
  address: string,
  chainIds: string[],
  timeoutMs: number,
): Promise<ChainFingerprint[]> {
  return Promise.all(
    chainIds.map(async (chainId) =>
      fetchChainFingerprint(address, chainId, timeoutMs),
    ),
  );
}

// ============================================================
// RISK CLASSIFICATION
// Converts raw fingerprints into an actionable verdict.
// ============================================================

type EVMRisk =
  | { level: 'safe'; reason: string }
  | { level: 'suspicious'; reason: string; evidence: ChainFingerprint[] }
  | { level: 'dangerous'; reason: string; evidence: ChainFingerprint[] };

/**
 * Classifies risk based on current-chain and other-chain fingerprints.
 *
 * @param currentChainId - The chain the user is sending on.
 * @param fingerprints - Fingerprints for all queried chains.
 * @returns A risk verdict.
 */
function classifyEVMRisk(
  currentChainId: string,
  fingerprints: ChainFingerprint[],
): EVMRisk {
  const current = fingerprints.find((fp) => fp.chainId === currentChainId);
  const others = fingerprints.filter((fp) => fp.chainId !== currentChainId);

  // If we can't get any data, degrade gracefully.
  if (!current || current.errored) {
    return {
      level: 'safe',
      reason:
        'Could not verify cross-chain activity. Format check passed.',
    };
  }

  const activeElsewhere = others.filter(
    (fp) => !fp.errored && (fp.isContract || fp.txCount > 0),
  );

  // DANGEROUS: Address is a contract on another chain but pristine here.
  // Sending to a contract address that doesn't exist on this chain = funds lost.
  const contractElsewhere = activeElsewhere.filter((fp) => fp.isContract);
  const isContractHere = current.isContract;
  const hasActivityHere = current.txCount > 0 || isContractHere;

  if (contractElsewhere.length > 0 && !hasActivityHere) {
    return {
      level: 'dangerous',
      reason: `This address is a smart contract on ${contractElsewhere
        .map((fp) => fp.chainName)
        .join(', ')} but has never been used on ${current.chainName}. Sending here will almost certainly result in permanent loss of funds.`,
      evidence: [current, ...contractElsewhere],
    };
  }

  // SUSPICIOUS: Address has significant activity on another chain and
  // very little (or none) on the current chain. Common for exchange
  // deposits paid to the wrong network.
  const highActivityThreshold = 10;
  const significantlyMoreActiveElsewhere = activeElsewhere.filter(
    (fp) => fp.txCount > current.txCount + highActivityThreshold,
  );

  if (significantlyMoreActiveElsewhere.length > 0 && current.txCount === 0) {
    return {
      level: 'suspicious',
      reason: `This address has activity on ${significantlyMoreActiveElsewhere
        .map((fp) => `${fp.chainName} (${fp.txCount} txs)`)
        .join(', ')} but zero activity on ${current.chainName}. You may be sending on the wrong chain.`,
      evidence: [current, ...significantlyMoreActiveElsewhere],
    };
  }

  return {
    level: 'safe',
    reason: hasActivityHere
      ? `Address has prior activity on ${current.chainName}.`
      : `Address has no known activity on any queried chain. This is normal for a new address, but double-check the chain before sending.`,
  };
}

// ============================================================
// CACHING (snap_manageState)
// Public RPCs are rate-limited. Cache fingerprints for 1 hour per
// (address, chain) pair. Most wrong-chain mistakes target well-known
// contracts that will be cache hits.
// ============================================================

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

type CacheEntry = {
  fingerprint: ChainFingerprint;
  cachedAt: number;
};

type CacheState = Record<string, CacheEntry>;

/**
 * Builds a cache key for an address-chain pair.
 *
 * @param address - The target address.
 * @param chainId - Normalized hex chain ID.
 * @returns Cache key.
 */
function cacheKey(address: string, chainId: string): string {
  return `${address.toLowerCase()}:${chainId}`;
}

/**
 * Loads the full cache state from Snap storage.
 *
 * @returns The cache state, or empty object if none.
 */
async function loadCache(): Promise<CacheState> {
  try {
    const state = (await snap.request({
      method: 'snap_manageState',
      params: { operation: 'get' },
    })) as CacheState | null;
    return state ?? {};
  } catch {
    return {};
  }
}

/**
 * Saves the cache state to Snap storage.
 *
 * @param state - The full cache state.
 */
async function saveCache(state: CacheState): Promise<void> {
  try {
    await snap.request({
      method: 'snap_manageState',
      params: { operation: 'update', newState: state },
    });
  } catch {
    // Non-fatal: caching is an optimization, not a correctness requirement.
  }
}

/**
 * Fetches fingerprints with caching layered on top.
 *
 * @param address - The target address.
 * @param chainIds - Normalized hex chain IDs to query.
 * @param timeoutMs - Per-request timeout.
 * @returns Array of fingerprints.
 */
async function fetchAllFingerprintsCached(
  address: string,
  chainIds: string[],
  timeoutMs: number,
): Promise<ChainFingerprint[]> {
  const cache = await loadCache();
  const now = Date.now();

  const results: ChainFingerprint[] = [];
  const toFetch: string[] = [];

  for (const chainId of chainIds) {
    const entry = cache[cacheKey(address, chainId)];
    if (entry && now - entry.cachedAt < CACHE_TTL_MS && !entry.fingerprint.errored) {
      results.push(entry.fingerprint);
    } else {
      toFetch.push(chainId);
    }
  }

  if (toFetch.length === 0) {
    return results;
  }

  const fresh = await fetchAllFingerprints(address, toFetch, timeoutMs);

  for (const fp of fresh) {
    if (!fp.errored) {
      cache[cacheKey(address, fp.chainId)] = {
        fingerprint: fp,
        cachedAt: now,
      };
    }
  }

  await saveCache(cache);

  return [...results, ...fresh];
}

// ============================================================
// SHARED UI BUILDERS
// ============================================================

/**
 * Builds the warning panel for a cross-ecosystem mismatch.
 *
 * @param currentChainName - The name of the current chain.
 * @param detected - The detected chain match.
 * @param toAddress - The destination address.
 * @param isPreview - Whether this is a preview.
 * @returns The panel content.
 */
function buildCrossEcosystemWarning(
  currentChainName: string,
  detected: ChainMatch,
  toAddress: string,
  isPreview = false,
) {
  const bridgeList = detected.bridges
    .map((bridge) => `\u2192 ${bridge}`)
    .join('\n');
  return panel([
    heading(
      `\ud83d\udea8 Wrong Chain Detected!${isPreview ? ' (Preview)' : ''}`,
    ),
    divider(),
    text(`**You are on:** ${currentChainName}`),
    text(`**Address looks like:** ${detected.name}`),
    divider(),
    text(`\u26a0\ufe0f ${detected.warning}`),
    divider(),
    text('**Your funds will be permanently lost if you proceed.**'),
    divider(),
    text('**What to do instead:**'),
    text('\u274c Cancel this transaction immediately'),
    text('\ud83c\udf09 Use a bridge to send cross-chain:'),
    text(bridgeList),
    divider(),
    text('**Destination address:**'),
    copyable(toAddress),
  ]);
}

/**
 * Builds the panel for an EVM-chain-specific risk verdict.
 *
 * @param currentChainName - The name of the current chain.
 * @param toAddress - The destination address.
 * @param risk - The risk verdict.
 * @returns The panel content.
 */
function buildEVMRiskPanel(
  currentChainName: string,
  toAddress: string,
  risk: EVMRisk,
) {
  if (risk.level === 'dangerous') {
    const evidenceLines = risk.evidence.map((fp) => {
      const kind = fp.isContract ? 'smart contract' : `${fp.txCount} transactions`;
      return `\u2022 ${fp.chainName}: ${kind}`;
    });
    return panel([
      heading('\ud83d\udea8 Wrong EVM Chain Detected!'),
      divider(),
      text(`**You are sending on:** ${currentChainName}`),
      divider(),
      text(`\u26a0\ufe0f ${risk.reason}`),
      divider(),
      text('**Address activity by chain:**'),
      text(evidenceLines.join('\n')),
      divider(),
      text('**Funds sent to a contract on the wrong chain are permanently lost.**'),
      divider(),
      text('**Destination address:**'),
      copyable(toAddress),
    ]);
  }

  if (risk.level === 'suspicious') {
    const evidenceLines = risk.evidence.map(
      (fp) => `\u2022 ${fp.chainName}: ${fp.txCount} transactions`,
    );
    return panel([
      heading('\u26a0\ufe0f Possible Wrong Chain'),
      divider(),
      text(`**You are sending on:** ${currentChainName}`),
      divider(),
      text(risk.reason),
      divider(),
      text('**Address activity by chain:**'),
      text(evidenceLines.join('\n')),
      divider(),
      text('Verify the recipient expects funds on this specific chain before sending.'),
      divider(),
      text('**Destination address:**'),
      copyable(toAddress),
    ]);
  }

  return panel([
    heading('\u2705 Address Looks Compatible'),
    divider(),
    text(`**Network:** ${currentChainName}`),
    divider(),
    text(risk.reason),
    text('Always verify the full address before confirming.'),
    divider(),
    text('**Sending to:**'),
    copyable(toAddress),
  ]);
}

// ============================================================
// onRpcRequest — for previewing warnings from the test site
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
          content: buildCrossEcosystemWarning(
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
// onTransaction — fires on EVM confirmation screen
// Tier 1: synchronous regex for cross-ecosystem mismatch
// Tier 2: async EVM fingerprint for same-ecosystem wrong-chain
// ============================================================

const FINGERPRINT_TIMEOUT_MS = 2000;

export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
}) => {
  const toAddress = transaction.to as string | undefined;

  if (!toAddress) {
    return null;
  }

  const normalizedChainId = normalizeChainId(chainId);
  const currentChainName = getChainName(chainId);
  const detected = detectAddressType(toAddress);

  // Tier 1: cross-ecosystem mismatch — return immediately.
  if (detected && !detected.isEVM) {
    return {
      content: buildCrossEcosystemWarning(
        currentChainName,
        detected,
        toAddress,
      ),
    };
  }

  // Tier 2: address is EVM-shaped. Probe other EVM chains.
  if (detected?.isEVM) {
    const otherChainIds = Object.keys(EVM_CHAINS).filter(
      (id) => id !== normalizedChainId,
    );
    const chainIdsToQuery = [normalizedChainId, ...otherChainIds];

    const fingerprints = await fetchAllFingerprintsCached(
      toAddress,
      chainIdsToQuery,
      FINGERPRINT_TIMEOUT_MS,
    );
    const risk = classifyEVMRisk(normalizedChainId, fingerprints);

    return {
      content: buildEVMRiskPanel(currentChainName, toAddress, risk),
    };
  }

  return {
    content: panel([
      heading('\u26a0\ufe0f Unrecognized Address'),
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

// ============================================================
// onNameLookup — fires WHILE USER IS TYPING
// Stays synchronous (regex only). Running fetch() on every
// keystroke would lag the send UI and burn rate limits.
// ============================================================

export const onNameLookup: OnNameLookupHandler = async (request) => {
  const { chainId, address } = request;

  if (!address) {
    return null;
  }

  const currentChainName = getChainName(chainId);
  const detected = detectAddressType(address);

  if (detected && !detected.isEVM) {
    return {
      resolvedDomains: [
        {
          resolvedDomain: `\ud83d\udea8 ${detected.name} address on ${currentChainName} \u2014 funds will be lost!`,
          protocol: 'Chain Guardian',
        },
      ],
    };
  }

  if (detected?.isEVM) {
    return {
      resolvedDomains: [
        {
          resolvedDomain: `\u2705 EVM address \u2014 compatible with ${currentChainName}`,
          protocol: 'Chain Guardian',
        },
      ],
    };
  }

  return {
    resolvedDomains: [
      {
        resolvedDomain: `\u26a0\ufe0f Unrecognized address format \u2014 verify before sending`,
        protocol: 'Chain Guardian',
      },
    ],
  };
};
