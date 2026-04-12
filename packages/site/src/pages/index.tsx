import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: sans-serif; background: #ffffff; color: #1a1a1a; -webkit-font-smoothing: antialiased; }
`;

const Wrap = styled.div`
  max-width: 860px;
  margin: 0 auto;
  padding: 0 1.5rem 4rem;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 0 3rem;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 4rem;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  font-size: 15px;
  letter-spacing: -0.01em;
`;

const LogoIcon = styled.div`
  width: 28px;
  height: 28px;
  background: #1a1a1a;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const NavBtn = styled.a`
  background: #1a1a1a;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
`;

const NavBtnOutline = styled.a`
  background: transparent;
  color: #1a1a1a;
  border: 1px solid #ddd;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 400;
  cursor: pointer;
  text-decoration: none;
`;

const Hero = styled.div`
  text-align: center;
  margin-bottom: 5rem;
`;

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f7f7f7;
  border: 1px solid #ebebeb;
  border-radius: 100px;
  padding: 5px 14px;
  font-size: 12px;
  color: #666;
`;

const BadgeDot = styled.div`
  width: 6px;
  height: 6px;
  background: #1d9e75;
  border-radius: 50%;
`;

const MetaMaskBadge = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fff8f2;
  border: 1px solid #f6851b;
  border-radius: 100px;
  padding: 5px 14px;
  font-size: 12px;
  color: #c4610a;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  &:hover { background: #fff0e0; }
`;

const MetaMaskDot = styled.div`
  width: 6px;
  height: 6px;
  background: #f6851b;
  border-radius: 50%;
`;

const H1 = styled.h1`
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 300;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin: 0 0 1.5rem;
  color: #1a1a1a;
`;

const Sub = styled.p`
  font-size: 1.05rem;
  color: #666;
  line-height: 1.7;
  max-width: 520px;
  margin: 0 auto 2.5rem;
  font-weight: 300;
`;

const BtnRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const PrimaryBtn = styled.a`
  background: #f6851b;
  color: #ffffff;
  border: none;
  padding: 13px 28px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  &:hover { background: #e07400; }
`;

const SecondaryBtn = styled.a`
  background: transparent;
  color: #666;
  border: 1px solid #ddd;
  padding: 13px 28px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  text-decoration: none;
`;

const Demo = styled.div`
  background: #f7f7f7;
  border: 1px solid #ebebeb;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 5rem;
`;

const DemoLabel = styled.div`
  font-size: 11px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 1.5rem;
`;

const WarningCard = styled.div`
  background: #ffffff;
  border: 1px solid #ebebeb;
  border-radius: 12px;
  overflow: hidden;
  max-width: 420px;
  margin: 0 auto;
`;

const WarningHeader = styled.div`
  background: #fff5f5;
  border-bottom: 1px solid #ffd7d7;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const WarningIconCircle = styled.div`
  width: 20px;
  height: 20px;
  background: #e24b4a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const WarningTitle = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #a32d2d;
`;

const WarningBody = styled.div`
  padding: 16px 18px;
`;

const WarningMsg = styled.p`
  font-size: 13px;
  color: #555;
  line-height: 1.6;
  margin-bottom: 14px;
`;

const WarningAddress = styled.div`
  font-family: monospace;
  font-size: 11px;
  background: #f7f7f7;
  border: 1px solid #ebebeb;
  border-radius: 8px;
  padding: 8px 12px;
  color: #666;
  word-break: break-all;
  margin-bottom: 14px;
`;

const BridgeLabel = styled.div`
  font-size: 11px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
`;

const BridgeRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const BridgeChip = styled.div`
  background: #f7f7f7;
  border: 1px solid #ebebeb;
  border-radius: 100px;
  padding: 5px 12px;
  font-size: 12px;
  color: #666;
`;

const GreenCard = styled.div`
  background: #f0faf4;
  border: 1px solid #c3e6d0;
  border-radius: 12px;
  padding: 16px 18px;
  max-width: 420px;
  margin: 12px auto 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const GreenDot = styled.div`
  width: 8px;
  height: 8px;
  background: #1d9e75;
  border-radius: 50%;
  flex-shrink: 0;
`;

const GreenText = styled.p`
  font-size: 13px;
  color: #1a6640;
  line-height: 1.5;
`;

const SectionLabel = styled.div`
  font-size: 11px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 400;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
`;

const SectionSub = styled.p`
  font-size: 14px;
  color: #666;
  font-weight: 300;
  margin-bottom: 2rem;
`;

const Steps = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: #ebebeb;
  border: 1px solid #ebebeb;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 5rem;
`;

const Step = styled.div`
  background: #ffffff;
  padding: 1.75rem;
`;

const StepNum = styled.div`
  font-size: 11px;
  color: #999;
  margin-bottom: 1rem;
`;

const StepTitle = styled.h3`
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
`;

const StepDesc = styled.p`
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  font-weight: 300;
`;

const ChainSection = styled.div`
  margin-bottom: 5rem;
`;

const ChainGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chain = styled.div`
  background: #f7f7f7;
  border: 1px solid #ebebeb;
  border-radius: 100px;
  padding: 6px 16px;
  font-size: 13px;
  color: #666;
  font-weight: 300;
`;

const ChainFeatured = styled.div`
  background: #f7f7f7;
  border: 1px solid #d0d0d0;
  border-radius: 100px;
  padding: 6px 16px;
  font-size: 13px;
  color: #1a1a1a;
  font-weight: 400;
`;

const CtaSection = styled.div`
  background: #1a1a1a;
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  margin-bottom: 4rem;
`;

const CtaTitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 300;
  color: #ffffff;
  letter-spacing: -0.02em;
  margin-bottom: 0.75rem;
`;

const CtaSub = styled.p`
  font-size: 14px;
  color: #999;
  margin-bottom: 2rem;
  font-weight: 300;
`;

const CtaBtn = styled.a`
  background: #f6851b;
  color: #ffffff;
  border: none;
  padding: 14px 32px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  &:hover { background: #e07400; }
`;

const Footer = styled.footer`
  border-top: 1px solid #f0f0f0;
  padding-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FooterLeft = styled.div`
  font-size: 12px;
  color: #999;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const FooterLink = styled.a`
  font-size: 12px;
  color: #999;
  text-decoration: none;
`;

const Divider = styled.div`
  margin-bottom: 5rem;
`;

const MetaMaskIcon = () => (
  <svg width="16" height="16" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32.9583 1L19.8242 10.7183L22.2666 4.99099L32.9583 1Z" fill="#E17726" stroke="#E17726" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.04834 1L15.0707 10.809L12.7398 4.99099L2.04834 1Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M28.2292 23.5334L24.7346 28.872L32.2521 30.9324L34.4088 23.6501L28.2292 23.5334Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M0.608154 23.6501L2.75153 30.9324L10.2557 28.872L6.77434 23.5334L0.608154 23.6501Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SNAP_URL = 'https://snaps.metamask.io/snap/npm/yigitkara/chain-guardian/';

const Index = () => (
  <>
    <GlobalStyle />
    <Wrap>
      <Nav>
        <Logo>
          <LogoIcon>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
              <path d="M8 1L2 4v4c0 3.3 2.5 6.4 6 7 3.5-.6 6-3.7 6-7V4L8 1zm-1 9.4L4.6 8l1.1-1.1 1.3 1.3 3.3-3.3 1.1 1.1L7 10.4z" />
            </svg>
          </LogoIcon>
          Chain Guardian
        </Logo>
        <NavLinks>
          <NavBtnOutline href="https://github.com/YigitKara/chain-guardian" target="_blank">
            GitHub
          </NavBtnOutline>
          <NavBtn href={SNAP_URL} target="_blank">
            Add to MetaMask
          </NavBtn>
        </NavLinks>
      </Nav>

      <Hero>
        <BadgeRow>
          <Badge>
            <BadgeDot />
            Approved MetaMask Snap
          </Badge>
          <MetaMaskBadge href={SNAP_URL} target="_blank">
            <MetaMaskDot />
            Listed on MetaMask Snaps Directory
          </MetaMaskBadge>
        </BadgeRow>
        <H1>Never send crypto to the wrong blockchain</H1>
        <Sub>
          Chain Guardian watches every transaction you make in MetaMask and
          warns you instantly if the destination address belongs to a different
          blockchain network.
        </Sub>
        <BtnRow>
          <PrimaryBtn href={SNAP_URL} target="_blank">
            <MetaMaskIcon />
            Add to MetaMask — It&apos;s free
          </PrimaryBtn>
          <SecondaryBtn href="https://github.com/YigitKara/chain-guardian" target="_blank">
            View source code
          </SecondaryBtn>
        </BtnRow>
      </Hero>

      <Demo>
        <DemoLabel>Live preview — what you see in MetaMask</DemoLabel>
        <WarningCard>
          <WarningHeader>
            <WarningIconCircle>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
                <path d="M5 1L1 8h8L5 1zm0 5.5a.5.5 0 110 1 .5.5 0 010-1zm-.5-3h1v2.5h-1V3.5z" />
              </svg>
            </WarningIconCircle>
            <WarningTitle>Wrong network detected</WarningTitle>
          </WarningHeader>
          <WarningBody>
            <WarningMsg>
              This address appears to be a Solana address. You are currently on
              Ethereum Mainnet. Sending funds here will result in permanent loss.
            </WarningMsg>
            <WarningAddress>
              7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
            </WarningAddress>
            <BridgeLabel>Send via bridge instead</BridgeLabel>
            <BridgeRow>
              <BridgeChip>Wormhole</BridgeChip>
              <BridgeChip>Allbridge</BridgeChip>
              <BridgeChip>deBridge</BridgeChip>
            </BridgeRow>
          </WarningBody>
        </WarningCard>
        <GreenCard>
          <GreenDot />
          <GreenText>
            When the address is compatible, you will see a green confirmation —
            safe to proceed.
          </GreenText>
        </GreenCard>
      </Demo>

      <Divider>
        <SectionLabel>How it works</SectionLabel>
        <SectionTitle>Three steps, zero configuration</SectionTitle>
        <SectionSub>Install once, protected forever. No setup required.</SectionSub>
        <Steps>
          <Step>
            <StepNum>01</StepNum>
            <StepTitle>Install the Snap</StepTitle>
            <StepDesc>
              Add Chain Guardian to MetaMask in one click from the official
              Snaps directory. No accounts, no emails.
            </StepDesc>
          </Step>
          <Step>
            <StepNum>02</StepNum>
            <StepTitle>Send a transaction</StepTitle>
            <StepDesc>
              Every time you initiate a send in MetaMask, Chain Guardian
              silently analyzes the destination address.
            </StepDesc>
          </Step>
          <Step>
            <StepNum>03</StepNum>
            <StepTitle>Get warned instantly</StepTitle>
            <StepDesc>
              If the address format does not match your current network, you see
              a clear warning before you confirm.
            </StepDesc>
          </Step>
        </Steps>
      </Divider>

      <ChainSection>
        <SectionLabel>Supported networks</SectionLabel>
        <SectionTitle>10+ blockchains protected</SectionTitle>
        <SectionSub>
          Chain Guardian detects address mismatches across all major blockchain ecosystems.
        </SectionSub>
        <ChainGrid>
          <ChainFeatured>Ethereum</ChainFeatured>
          <ChainFeatured>Polygon</ChainFeatured>
          <ChainFeatured>BNB Chain</ChainFeatured>
          <ChainFeatured>Avalanche</ChainFeatured>
          <ChainFeatured>Optimism</ChainFeatured>
          <ChainFeatured>Arbitrum</ChainFeatured>
          <ChainFeatured>Base</ChainFeatured>
          <Chain>Solana</Chain>
          <Chain>Bitcoin</Chain>
          <Chain>Tron</Chain>
          <Chain>XRP</Chain>
          <Chain>Litecoin</Chain>
          <Chain>Cardano</Chain>
          <Chain>Cosmos</Chain>
          <Chain>Polkadot</Chain>
          <Chain>Stellar</Chain>
        </ChainGrid>
      </ChainSection>

      <CtaSection>
        <CtaTitle>Start protecting your transactions today</CtaTitle>
        <CtaSub>
          Free, open source, and takes 10 seconds to install. Works automatically on every transaction.
        </CtaSub>
        <CtaBtn href={SNAP_URL} target="_blank">
          <MetaMaskIcon />
          Add to MetaMask — It&apos;s free
        </CtaBtn>
      </CtaSection>

      <Footer>
        <FooterLeft>© 2026 Chain Guardian — Free and open source</FooterLeft>
        <FooterLinks>
          <FooterLink href={SNAP_URL} target="_blank">
            MetaMask Directory
          </FooterLink>
          <FooterLink href="https://github.com/YigitKara/chain-guardian" target="_blank">
            GitHub
          </FooterLink>
          <FooterLink href="https://www.npmjs.com/package/@yigitkara/chain-guardian" target="_blank">
            npm
          </FooterLink>
        </FooterLinks>
      </Footer>
    </Wrap>
  </>
);

export default Index;
