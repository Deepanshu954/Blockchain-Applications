import { HeroSection } from "@/components/scrolly/hero-section";
import { Section, SectionHeader, Subsection } from "@/components/scrolly/section";
import { TableOfContents } from "@/components/scrolly/table-of-contents";
import { MetricCard, MetricGrid } from "@/components/scrolly/metric-card";
import { Footer } from "@/components/report/footer";
import { ConsensusMechanismsWidget } from "@/components/scrolly/consensus-mechanisms-widget";
import { CryptographyPrimitivesWidget } from "@/components/scrolly/cryptography-primitives-widget";
import { PlatformComparisonWidget } from "@/components/scrolly/platform-comparison-widget";
import { DeFiGrowthAndCBDCMapWidget } from "@/components/scrolly/defi-cbdc-widget";
import { EnterpriseCaseStudiesWidget } from "@/components/scrolly/enterprise-case-studies-widget";
import { SecurityVulnerabilityTaxonomyWidget } from "@/components/scrolly/security-vulnerability-taxonomy-widget";
import { ZKPComparisonWidget } from "@/components/scrolly/zkp-comparison-widget";
import { Layer2SolutionsWidget } from "@/components/scrolly/layer2-solutions-widget";
import { FutureResearchWidget } from "@/components/scrolly/future-research-widget";
import { EthereumShardingAnimation } from "@/components/scrolly/ethereum-sharding-animation";
import { SupplyChainSimulation } from "@/components/visualizations/supply-chain-simulation";
import { DefiProtocolTable } from "@/components/visualizations/defi-protocol-table";
import { CBDCAdoptionMap } from "@/components/visualizations/cbdc-adoption-map";
import { MetaverseArchitecture3D } from "@/components/visualizations/metaverse-architecture-3d";
import { HealthcareDataSharing } from "@/components/visualizations/healthcare-data-sharing";
import { DIDIdentityWallet } from "@/components/visualizations/did-identity-wallet";
import { SmartGridTrading } from "@/components/visualizations/smart-grid-trading";
import { SecureVotingSystem } from "@/components/visualizations/secure-voting-system";
import { NFTUtilityLifecycle } from "@/components/visualizations/nft-utility-lifecycle";
import {
  Network,
  FileCode,
} from "lucide-react";

export default function BlockchainResearchPaper() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Executive Summary & Table of Contents */}
      <Section id="abstract" variant="alternate">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Abstract */}
          <div className="lg:col-span-3">
            <SectionHeader title="Abstract" />
            <div className="prose-academic">
              <p>
                Blockchain technology has emerged as a transformative distributed
                ledger system enabling trustless transactions and decentralized
                consensus across diverse domains. This paper presents a
                comprehensive analysis of blockchain&apos;s technical foundations,
                enterprise applications, and challenges.
              </p>
              <p>
                We examine core architectural components including consensus
                mechanisms (Proof of Work, Proof of Stake, Byzantine Fault
                Tolerance variants), cryptographic primitives (hash functions,
                Merkle trees, digital signatures), and smart contract execution
                environments. Through detailed case studies of real-world
                deployments in finance, supply chain, and healthcare, we evaluate
                performance metrics, security trade-offs, and scalability
                solutions including Layer 2 protocols and sharding.
              </p>
              <p>
                Our analysis reveals that blockchain systems face inherent
                trilemmas between decentralization, security, and scalability,
                while regulatory frameworks struggle to accommodate immutable
                distributed ledgers. We synthesize current research gaps in
                post-quantum cryptography migration, Web3 infrastructure maturity,
                and blockchain-AI integration.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "Blockchain",
                "Distributed Ledger Technology",
                "Consensus Mechanisms",
                "Smart Contracts",
                "Enterprise Transformation",
                "Cryptography",
                "Decentralization",
              ].map((keyword) => (
                <span
                  key={keyword}
                  className="px-3 py-1 text-sm bg-primary/10 border border-primary/20 font-mono text-primary"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Table of Contents */}
          <div className="lg:col-span-2">
            <TableOfContents />
          </div>
        </div>
      </Section>

      {/* Section 1: Introduction */}
      <Section id="introduction">
        <SectionHeader
          number="01"
          title="Introduction"
          subtitle="Motivation, research objectives, and paper organization"
        />

        <Subsection id="motivation" title="1.1 Motivation">
          <p>
            Blockchain represents a paradigm shift in distributed computing,
            enabling decentralized consensus without trusted intermediaries.
            Bitcoin&apos;s introduction in 2009 demonstrated cryptographic
            proof-based transactions, while Ethereum extended this to
            programmable smart contracts. Enterprise adoption has accelerated
            across finance, supply chain, and healthcare, yet fundamental
            challenges in scalability, security, and regulatory compliance
            persist.
          </p>
        </Subsection>

        <Subsection id="research-objectives" title="1.2 Research Objectives">
          <p>
            This paper systematically analyzes blockchain technology through four
            objectives:
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {[
              {
                num: "1",
                text: "Technical architecture and cryptographic foundations",
              },
              { num: "2", text: "Consensus mechanism trade-offs" },
              {
                num: "3",
                text: "Real-world enterprise applications with quantitative metrics",
              },
              {
                num: "4",
                text: "Security, privacy, and scalability challenges with proposed solutions",
              },
            ].map((obj) => (
              <div
                key={obj.num}
                className="flex items-start gap-3 p-4 bg-card brutalist-border"
              >
                <span className="w-8 h-8 flex items-center justify-center bg-primary text-white font-bold text-sm flex-shrink-0">
                  {obj.num}
                </span>
                <span className="text-sm">{obj.text}</span>
              </div>
            ))}
          </div>
        </Subsection>

        <Subsection id="paper-organization" title="1.3 Paper Organization">
          <p>
            Section 2 reviews distributed systems and Byzantine fault tolerance.
            Section 3 examines blockchain architecture. Sections 4-7 cover
            platforms, applications, case studies, and challenges. Sections 8-9
            address scalability and future directions.
          </p>
        </Subsection>
      </Section>

      {/* Section 2: Background */}
      <Section id="background" variant="alternate">
        <SectionHeader
          number="02"
          title="Background & Related Work"
          subtitle="Distributed systems, Byzantine fault tolerance, and database comparisons"
        />

        <Subsection id="distributed-systems" title="2.1 Distributed Systems">
          <p>
            Blockchain builds upon decades of distributed systems research. The
            CAP theorem establishes that distributed systems can guarantee at most
            two of three properties: Consistency, Availability, and Partition
            tolerance. Blockchain systems typically prioritize partition tolerance
            and eventual consistency.
          </p>
        </Subsection>

        <Subsection
          id="byzantine-fault-tolerance"
          title="2.2 Byzantine Fault Tolerance"
        >
          <p>
            Byzantine fault tolerance ensures consensus despite malicious nodes,
            requiring <strong>3f+1 nodes</strong> to tolerate f failures. The
            Byzantine Generals Problem, formalized by Lamport, Shostak, and Pease
            in 1982, describes the challenge of achieving agreement in the
            presence of traitors.
          </p>
          <MetricGrid columns={2} className="mt-6">
            <MetricCard
              metric="3f+1"
              description="Minimum nodes required to tolerate f Byzantine failures"
              icon={<Network className="w-5 h-5" />}
            />
            <MetricCard
              metric="1982"
              description="Year BFT problem was formally defined"
              icon={<FileCode className="w-5 h-5" />}
            />
          </MetricGrid>
        </Subsection>

        <Subsection
          id="comparison-databases"
          title="2.3 Comparison with Traditional Databases"
        >
          <p>
            Traditional databases provide ACID guarantees through centralized
            control, while blockchains achieve eventual consistency through
            probabilistic or deterministic finality mechanisms.
          </p>
        </Subsection>
      </Section>

      {/* Section 3: Architecture */}
      <Section id="architecture">
        <SectionHeader
          number="03"
          title="Blockchain Architecture & Technical Foundations"
          subtitle="Consensus mechanisms, cryptography, and smart contracts"
        />

        <Subsection id="consensus-mechanisms" title="3.1 Consensus Mechanisms">
          <p>
            Consensus protocols determine block validation and chain selection.
            <strong> Proof of Work (PoW)</strong> uses computational difficulty to
            prevent Sybil attacks. Bitcoin processes 5-10 TPS with 10-minute block
            times. <strong>Proof of Stake (PoS)</strong> replaces computation with
            staked collateral, achieving higher throughput and 99% energy
            reduction.
          </p>

          {/* Consensus Mechanisms Interactive Widget */}
          <ConsensusMechanismsWidget className="mt-8" />
        </Subsection>

        <Subsection id="cryptography" title="3.2 Cryptography">
          <p>
            Blockchain security relies on cryptographic hash functions (SHA-256,
            Keccak-256), Merkle trees for efficient verification, and digital
            signatures (ECDSA, EdDSA) for transaction authorization.
          </p>

          {/* Cryptography Primitives Interactive Widget */}
          <div className="mt-8">
            <CryptographyPrimitivesWidget />
          </div>
        </Subsection>

        <Subsection id="smart-contracts" title="3.3 Smart Contracts & Virtual Machines">
          <p>
            Smart contracts execute deterministic code on blockchain virtual
            machines. The Ethereum Virtual Machine (EVM) provides a
            Turing-complete execution environment with gas-metered computation.
          </p>
        </Subsection>
      </Section>

      {/* Section 4: Platforms */}
      <Section id="platforms" variant="alternate">
        <SectionHeader
          number="04"
          title="Blockchain Platforms & Frameworks"
          subtitle="Public vs private blockchains and enterprise DLTs"
        />

        <Subsection id="public-private" title="4.1 Public vs Private Blockchains">
          <p>
            Blockchain architectures exhibit fundamental trade-offs between
            openness and control. Public blockchains like Ethereum and Bitcoin
            operate as permissionless networks. Private blockchains, exemplified
            by Hyperledger Fabric, restrict participation to authorized entities.
          </p>

          {/* Interactive Platform Comparison Widget */}
          <PlatformComparisonWidget />
        </Subsection>

        <Subsection id="ethereum" title="4.2 Ethereum Architecture">
          <p>
            Ethereum pioneered smart contract functionality through the EVM. The
            transition to Ethereum 2.0 introduced proof-of-stake consensus and a
            roadmap for sharding. Danksharding represents the next evolution,
            partitioning the blockchain into multiple shards (initially 64) to
            process transactions in parallel.
          </p>

          {/* Ethereum Sharding Animation */}
          <div className="mt-8">
            <EthereumShardingAnimation />
          </div>

          <div className="mt-6 prose-academic">
            <p>
              The animation above demonstrates how the <strong>Beacon Chain</strong> coordinates
              multiple shard chains, enabling parallel transaction processing. Cross-shard
              transactions (shown as moving particles between shards) are validated through
              receipt proofs. <strong>Data Availability Sampling (DAS)</strong> allows validators
              to verify data availability without downloading entire blocks, enabling the
              network to achieve <strong>100,000+ TPS</strong> at scale.
            </p>
          </div>
        </Subsection>

        <Subsection id="hyperledger" title="4.3 Hyperledger Frameworks">
          <p>
            Hyperledger Fabric employs a modular architecture with pluggable
            consensus mechanisms (Raft, Kafka) and supports multiple programming
            languages for chaincode development. Hyperledger Besu, an
            Ethereum-compatible client, supports both public and private
            deployments.
          </p>
        </Subsection>
      </Section>

      {/* Section 5: Applications */}
      <Section id="applications">
        <SectionHeader
          number="05"
          title="Applications of Blockchain"
          subtitle="Financial services, supply chain, healthcare, identity, and IoT"
        />

        <Subsection id="financial-services" title="5.1 Financial Services">
          <p>
            Decentralized Finance (DeFi) protocols achieved 21.3% of total value
            locked (TVL) share by 2025, representing $24 billion in on-chain
            assets. Central Bank Digital Currencies (CBDCs) are being piloted
            globally, leveraging blockchain&apos;s settlement finality and transparency.
          </p>

          <p>
            Major protocols like AAVE and Uniswap demonstrate the capacity to disintermediate
            traditional finance, operating 24/7 with sub-second finality.
          </p>

          {/* DeFi & CBDC Visualization */}
          <DeFiGrowthAndCBDCMapWidget className="mt-8" />

          {/* New DeFi Table from comp1 */}
          <div className="mt-8">
            <DefiProtocolTable />
          </div>

          <MetricGrid columns={3} className="mt-8">
            <MetricCard
              metric="$24B"
              description="DeFi Total Value Locked (2025)"
              sentiment="positive"
            />
            <MetricCard
              metric="21.3%"
              description="DeFi TVL share"
              sentiment="neutral"
            />
            <MetricCard
              metric="3+"
              description="Retail CBDCs launched globally"
              sentiment="positive"
            />
          </MetricGrid>

          {/* New CBDC Map from comp1 */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-4">Global CBDC Adoption</h4>
            <CBDCAdoptionMap />
          </div>
        </Subsection>

        <Subsection id="supply-chain" title="5.2 Supply Chain Management">
          <p>
            Blockchain enables end-to-end traceability in supply chains.
            Walmart&apos;s implementation reduced food traceability time from 7
            days to 2.2 seconds using Hyperledger Fabric.
          </p>

          {/* New Supply Chain Simulation from comp1 */}
          <div className="my-8">
            <SupplyChainSimulation />
          </div>

          <p>
            Despite successes, ecosystem collaboration challenges persist, as evidenced
            by TradeLens&apos;s discontinuation. However, textile and clothing industries
            continue to adopt distributed ledgers for immutable provenance.
          </p>
        </Subsection>

        <Subsection id="healthcare" title="5.3 Healthcare Systems">
          <p>
            Blockchain-based Electronic Health Record (EHR) systems use
            permissioned architectures to ensure HIPAA compliance while enabling
            secure data sharing. Drug traceability applications combat
            counterfeiting through immutable provenance records.
          </p>

          <p className="mt-4">
            Patients gain granular control over their medical history through
            private key cryptography, allowing them to grant time-bound access
            to specific providers or researchers.
          </p>

          {/* Healthcare Data Sharing Visualization */}
          <HealthcareDataSharing />
        </Subsection>

        <Subsection id="identity" title="5.4 Identity Management">
          <p>
            Self-Sovereign Identity (SSI) leverages Decentralized Identifiers
            (DIDs) and Verifiable Credentials (VCs) per W3C standards, enabling
            users to control their digital identities without centralized
            intermediaries.
          </p>
          <p>
            SSI addresses accessibility challenges for 1.1 billion people worldwide
            lacking proof of identity while reducing data breach risks.
          </p>

          {/* DID Identity Wallet Visualization */}
          <DIDIdentityWallet />
        </Subsection>

        <Subsection id="iot-energy" title="5.5 IoT and Energy Systems">
          <p>
            Blockchain enables peer-to-peer energy trading with IOTA&apos;s Tangle
            supporting feeless microtransactions for high-throughput scenarios.
            Platforms enable prosumers to trade excess renewable energy directly
            with neighbors.
          </p>

          {/* Smart Grid Trading Visualization */}
          <SmartGridTrading />
        </Subsection>

        {/* New Subsections Appended from comp1 */}

        <Subsection id="government" title="5.6 Government Services">
          <p>
            Blockchain transforms land registry systems, providing tamper-proof
            property records with instant ownership verification. Solutions
            eliminate fraud through decentralized record-keeping and encrypted
            storage, reducing transaction time and costs.
          </p>

          {/* Secure Voting System Visualization */}
          <SecureVotingSystem />
        </Subsection>

        <Subsection id="nfts" title="5.7 NFTs: Utility Beyond Art">
          <p>
            Non-fungible tokens extend far beyond collectibles. In ticketing, NFTs provide
            verifiable proof of attendance while eliminating fraud. For intellectual property,
            they establish immutable creation timestamps.
          </p>
          <p>
            Educational institutions issue verifiable credentials as NFTs, allowing
            graduates to control how their qualifications are shared while enabling
            instant verification by employers.
          </p>

          {/* NFT Utility Lifecycle Visualization */}
          <NFTUtilityLifecycle />
        </Subsection>

        <Subsection id="metaverse" title="5.8 Gaming & Metaverse">
          <p>
            Play-to-earn models demonstrate how blockchain enables true digital ownership
            of in-game assets. Virtual real estate platforms allow users to purchase,
            develop, and monetize parcels as NFTs.
          </p>

          {/* Metaverse Architecture Visualization from comp1 */}
          <div className="my-8">
            <h4 className="text-lg font-semibold mb-4 text-center">Metaverse Architecture</h4>
            <MetaverseArchitecture3D />
          </div>

          <p>
            This layered architecture ensures that users maintain true ownership
            of their digital assets, while enabling seamless interoperability
            across different metaverse platforms.
          </p>
        </Subsection>
      </Section>

      {/* Section 6: Case Studies */}
      <Section id="case-studies" variant="alternate">
        <SectionHeader
          number="06"
          title="Case Studies"
          subtitle="Real-world enterprise blockchain deployments with metrics"
        />

        {/* Enterprise Case Studies Dashboard */}
        <EnterpriseCaseStudiesWidget />

        <div className="mt-12 space-y-8">
          <Subsection id="walmart" title="6.1 Walmart Food Traceability">
            <p>
              Walmart&apos;s blockchain initiative achieved traceability time
              reduction from <strong>7 days to 2.2 seconds</strong>, 25% waste
              reduction, and 40% shipping delay reduction. The system demonstrates
              permissioned blockchain efficacy in enterprise supply chains.
            </p>
          </Subsection>

          <Subsection id="maersk" title="6.2 Maersk TradeLens">
            <p>
              TradeLens, launched in 2018, was discontinued in 2022 due to
              insufficient industry collaboration. This case highlights governance
              challenges in multi-stakeholder blockchain consortia.
            </p>
          </Subsection>

          <Subsection id="jpmorgan" title="6.3 JPMorgan Kinexys">
            <p>
              JPMorgan&apos;s Kinexys Digital Payments processes over{" "}
              <strong>$1 billion in daily transactions</strong> with cross-border
              settlement in seconds. The platform demonstrates enterprise-grade
              blockchain deployment with regulatory compliance.
            </p>
          </Subsection>
        </div>
      </Section>

      {/* Section 7: Security */}
      <Section id="security">
        <SectionHeader
          number="07"
          title="Security, Privacy & Regulatory Challenges"
          subtitle="Attacks, vulnerabilities, privacy techniques, and compliance"
        />

        <Subsection id="attacks" title="7.1 Common Attacks and Vulnerabilities">
          <p>
            Blockchain systems face multi-layered security threats. <strong>51%
              attacks</strong> occur when an entity controls majority computational
            power or stake. Smart contract vulnerabilities have caused
            catastrophic losses: the 2016 DAO hack exploited reentrancy
            vulnerabilities to drain $60 million.
          </p>

          {/* Security Vulnerability Taxonomy Widget */}
          <div className="mt-8">
            <SecurityVulnerabilityTaxonomyWidget />
          </div>
        </Subsection>

        <Subsection id="privacy-techniques" title="7.2 Privacy Techniques">
          <p>
            <strong>Zero-knowledge proofs (ZKPs)</strong> enable privacy-preserving
            verification. ZK-SNARKs generate ~200-byte proofs with constant O(1)
            verification time but require trusted setup. ZK-STARKs eliminate
            trusted setup and provide quantum resistance but produce larger proofs
            (~45 kB).
          </p>

          {/* ZKP Comparison Widget */}
          <ZKPComparisonWidget className="mt-8" />
        </Subsection>

        <Subsection id="legal-compliance" title="7.3 Legal and Compliance Issues">
          <p>
            Securities regulation centers on the Howey test. AML/KYC compliance
            faces the &quot;Sunrise Issue&quot; from uneven FATF Travel Rule
            adoption. GDPR conflicts arise from the right to erasure versus
            immutability.
          </p>
        </Subsection>
      </Section>

      {/* Section 8: Scalability */}
      <Section id="scalability" variant="alternate">
        <SectionHeader
          number="08"
          title="Scalability & Performance Optimization"
          subtitle="Layer 2 solutions, sharding, and interoperability"
        />

        <Subsection id="layer-2" title="8.1 Layer 2 Solutions">
          <p>
            <strong>State channels</strong> enable off-chain transactions with
            on-chain settlement. <strong>Optimistic Rollups</strong> assume
            transaction validity with 7-day fraud-proof challenge periods.{" "}
            <strong>ZK-Rollups</strong> provide cryptographic validity proofs
            enabling fast finality.
          </p>

          {/* Layer 2 Solutions Interactive Widget */}
          <div className="mt-8">
            <Layer2SolutionsWidget />
          </div>
        </Subsection>

        <Subsection id="sharding" title="8.2 Sharding Approaches">
          <p>
            Ethereum&apos;s Danksharding roadmap pivots from execution sharding to
            data sharding. Proto-Danksharding (EIP-4844) introduced blob
            transactions in 2024, while full Danksharding targets 100,000+ TPS
            ecosystem capacity.
          </p>
        </Subsection>

        <Subsection id="interoperability" title="8.3 Interoperability Protocols">
          <p>
            <strong>Polkadot</strong> employs a relay chain coordinating
            heterogeneous parachains. <strong>Cosmos</strong> uses the
            Inter-Blockchain Communication (IBC) protocol. Cross-chain bridges
            remain high-value attack targets.
          </p>
        </Subsection>
      </Section>

      {/* Section 9: Future */}
      <Section id="future">
        <SectionHeader
          number="09"
          title="Future Research Directions"
          subtitle="Web3, post-quantum cryptography, and decentralized AI"
        />

        {/* Interactive Research Directions Mind Map */}
        <FutureResearchWidget className="min-h-[600px]" />

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Subsection id="web3" title="9.1 Web3 Infrastructure">
            <p>
              Cross-chain interoperability faces fundamental challenges beyond
              token bridging. Liquidity fragmentation across L2s demands unified
              solutions without reintroducing centralization risks.
            </p>
          </Subsection>

          <Subsection id="post-quantum" title="9.2 Post-Quantum Cryptography">
            <p>
              Quantum computing threatens current cryptographic standards. Research
              must design graceful migration strategies to post-quantum algorithms
              without performance degradation.
            </p>
          </Subsection>

          <Subsection id="blockchain-ai" title="9.3 Blockchain-AI Integration">
            <p>
              Verifiable and decentralized AI execution requires Zero-Knowledge
              Machine Learning (ZKML) for on-chain verification of computationally
              intensive models.
            </p>
          </Subsection>

          <Subsection id="regulatory" title="9.4 Regulatory Evolution">
            <p>
              Fundamental conflicts persist between blockchain immutability and
              regulatory requirements like GDPR&apos;s right to erasure and AML/KYC
              mandates.
            </p>
          </Subsection>
        </div>
      </Section>

      {/* Section 10: Conclusion */}
      <Section
        id="conclusion"
        variant="accent"
        className="
          bg-slate-300 text-slate-900
          dark:bg-slate-800 dark:text-white
        "
      >
        <SectionHeader
          number="10"
          title="Conclusion"
          className="
            text-slate-900
            dark:text-white
          "
        />
        <div className="prose-academic max-w-3xl dark:prose-invert">
          <p>
            This comprehensive survey examined blockchain technology across
            technical foundations, enterprise applications, and transformative
            potential. From consensus mechanisms and cryptographic primitives to
            real-world deployments demonstrating quantifiable benefits in supply
            chain, healthcare, and finance, blockchain exhibits maturation toward
            mainstream adoption.
          </p>
          <p>
            Critical challenges remain: the scalability trilemma requires continued
            innovation in Layer 2 solutions and sharding, privacy-transparency
            trade-offs demand advanced cryptographic techniques, and regulatory
            frameworks must evolve to accommodate decentralized architectures.
          </p>
          <p>
            As blockchain converges with AI and addresses interoperability
            challenges, its role in enterprise transformation will expand
            significantly, contingent on resolving security, compliance, and
            scalability barriers.
          </p>
        </div>
      </Section>

      {/* Section 11: References */}
      <Section id="references" variant="alternate">
        <SectionHeader
          number="11"
          title="References"
          subtitle="IEEE citation format with 40+ sources"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { num: 1, title: "Blockchain Technical Foundations" },
            { num: 2, title: "Layer 2 Scaling Solutions" },
            { num: 3, title: "Privacy Technologies" },
            { num: 4, title: "Regulatory Challenges" },
            { num: 5, title: "GDPR Compliance" },
            { num: 6, title: "GDPR Blockchain Review" },
            { num: 7, title: "Blockchain Security" },
            { num: 8, title: "ZKP MOOC" },
            { num: 9, title: "On-Chain Privacy" },
            { num: 10, title: "Blockchain-AI Integration" },
            { num: 11, title: "Post-Quantum Signatures" },
            { num: 12, title: "Post-Quantum Blockchain" },
          ].map((ref) => (
            <div
              key={ref.num}
              className="p-4 bg-card border-2 border-charcoal/20 hover:border-primary transition-colors group cursor-pointer"
            >
              <span className="font-mono text-xs text-primary">[{ref.num}]</span>
              <p className="text-sm mt-1 group-hover:text-primary transition-colors">
                {ref.title}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground text-center">
          Full reference list includes 40+ sources in IEEE format
        </p>
      </Section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
