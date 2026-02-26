import styled from 'styled-components';

import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  Card,
} from '../components';
import { defaultSnapOrigin } from '../config';
import {
  useMetaMask,
  useInvokeSnap,
  useMetaMaskContext,
  useRequestSnap,
} from '../hooks';
import { isLocalSnap, shouldDisplayReconnectButton } from '../utils';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary?.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background?.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border?.default};
  color: ${({ theme }) => theme.colors.text?.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error?.muted};
  border: 1px solid ${({ theme }) => theme.colors.error?.default};
  color: ${({ theme }) => theme.colors.error?.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const redButtonStyle = {
  backgroundColor: '#e41d1d',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  padding: '12px 24px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
} as React.CSSProperties;

const greenButtonStyle = {
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  padding: '12px 24px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
} as React.CSSProperties;

const Index = () => {
  const { error } = useMetaMaskContext();
  const { isFlask, snapsDetected, installedSnap } = useMetaMask();
  const requestSnap = useRequestSnap();
  const invokeSnap = useInvokeSnap();

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? isFlask
    : snapsDetected;

  const handleTestTransactionClick = async () => {
    const accounts = (await window.ethereum.request({
      method: 'eth_requestAccounts',
    })) as string[];
    await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: accounts[0],
          to: '0x742d35Cc6634C0532925a3b8D4C9C0B4b8E6d8A2',
          value: '0x0',
        },
      ],
    });
  };

  const previewWarning = async (address: string) => {
    await invokeSnap({
      method: 'previewWarning',
      params: { address, chainId: 'eip155:1' },
    });
  };

  return (
    <Container>
      <Heading>
        Welcome to <Span>Chain Guardian</Span>
      </Heading>
      <Subtitle>
        Protecting your transactions from cross-chain mistakes
      </Subtitle>
      <CardContainer>
        {error && (
          <ErrorMessage>
            <b>An error happened:</b> {error.message}
          </ErrorMessage>
        )}
        {!isMetaMaskReady && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}
        {!installedSnap && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Get started by connecting to and installing the Chain Guardian snap.',
              button: (
                <ConnectButton
                  onClick={requestSnap}
                  disabled={!isMetaMaskReady}
                />
              ),
            }}
            disabled={!isMetaMaskReady}
          />
        )}
        {shouldDisplayReconnectButton(installedSnap) && (
          <Card
            content={{
              title: 'Reconnect',
              description:
                'While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.',
              button: (
                <ReconnectButton
                  onClick={requestSnap}
                  disabled={!installedSnap}
                />
              ),
            }}
            disabled={!installedSnap}
          />
        )}
        <Card
          content={{
            title: '✅ Test Valid Transaction',
            description:
              'Send a test transaction to a valid EVM address and see the green insight panel.',
            button: (
              <button
                onClick={handleTestTransactionClick}
                disabled={!installedSnap}
                style={greenButtonStyle}
              >
                Test Valid Address
              </button>
            ),
          }}
          disabled={!installedSnap}
        />
        <Card
          content={{
            title: '🚨 Preview Solana Warning',
            description: 'Preview warning for a Solana address.',
            button: (
              <button
                onClick={() => previewWarning('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU')}
                disabled={!installedSnap}
                style={redButtonStyle}
              >
                Preview Solana
              </button>
            ),
          }}
          disabled={!installedSnap}
        />
        <Card
          content={{
            title: '🚨 Preview Bitcoin Warning',
            description: 'Preview warning for a Bitcoin address.',
            button: (
              <button
                onClick={() => previewWarning('1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf')}
                disabled={!installedSnap}
                style={redButtonStyle}
              >
                Preview Bitcoin
              </button>
            ),
          }}
          disabled={!installedSnap}
        />
        <Card
          content={{
            title: '🚨 Preview Tron Warning',
            description: 'Preview warning for a Tron address.',
            button: (
              <button
                onClick={() => previewWarning('TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9')}
                disabled={!installedSnap}
                style={redButtonStyle}
              >
                Preview Tron
              </button>
            ),
          }}
          disabled={!installedSnap}
        />
        <Card
          content={{
            title: '🚨 Preview XRP Warning',
            description: 'Preview warning for an XRP address.',
            button: (
              <button
                onClick={() => previewWarning('rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh')}
                disabled={!installedSnap}
                style={redButtonStyle}
              >
                Preview XRP
              </button>
            ),
          }}
          disabled={!installedSnap}
        />
        <Card
          content={{
            title: '🚨 Preview Litecoin Warning',
            description: 'Preview warning for a Litecoin address.',
            button: (
              <button
                onClick={() => previewWarning('LaMT348PWRnrqeeWArpwQPbuanpXDZGEUz')}
                disabled={!installedSnap}
                style={redButtonStyle}
              >
                Preview Litecoin
              </button>
            ),
          }}
          disabled={!installedSnap}
        />
        <Card
          content={{
            title: '🚨 Preview Cosmos Warning',
            description: 'Preview warning for a Cosmos address.',
            button: (
              <button
                onClick={() => previewWarning('cosmos1yw6g44c4pqd2rxgrcqekxg9k8f4fd8xpab8xk9')}
                disabled={!installedSnap}
                style={redButtonStyle}
              >
                Preview Cosmos
              </button>
            ),
          }}
          disabled={!installedSnap}
        />
        <Card
          content={{
            title: '🚨 Preview Stellar Warning',
            description: 'Preview warning for a Stellar address.',
            button: (
              <button
                onClick={() => previewWarning('GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWNA')}
                disabled={!installedSnap}
                style={redButtonStyle}
              >
                Preview Stellar
              </button>
            ),
          }}
          disabled={!installedSnap}
        />
        <Notice>
          <p>
            Chain Guardian protects your transactions by detecting address format
            mismatches across EVM, Solana, Bitcoin, Tron, XRP, Litecoin, Cardano,
            Cosmos, Polkadot, and Stellar networks.
          </p>
        </Notice>
      </CardContainer>
    </Container>
  );
};

export default Index;