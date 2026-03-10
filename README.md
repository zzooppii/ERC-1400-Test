# ERC-1400 Security Token Standard: Architecture Analysis & Demo

This repository is dedicated to exploring and demonstrating the core concepts of the **ERC-1400 (Security Token Standard)**, a comprehensive framework for issuing and managing security tokens and Real World Assets (RWAs) on EVM-compatible blockchains.

The primary objective of this project is to analyze the architectural differences between major STO standards and to showcase a practical understanding of ERC-1400's unique features, particularly its **Partition (Tranche)** system.

## Core Philosophical Difference: Partitions vs. Modules

While other standards like ERC-3643 focus heavily on decoupling compliance logic into separate, pluggable modules (Modular Compliance) and enforcing identity (ONCHAINID), ERC-1400 takes a fundamentally different approach: **Asset Classification within a Single Contract**.

In traditional finance, a single company might issue multiple classes of shares (e.g., Common Shares with voting rights, Preferred Shares with higher dividends, or Restricted/Locked Shares for founders). 

ERC-1400 elegantly solves this by introducing `bytes32 partition`. Instead of deploying a new smart contract for every share class, ERC-1400 allows a single token contract to maintain isolated balances (partitions) for each asset class.

## Key Concepts Explored

### 1. Tranche Management (Partitions)
A significant portion of the analysis focuses on how an investor's balance is managed across different tranches. 
- Example: An investor can hold a total balance of 1,500 tokens, which is internally divided into a `CLASS_A` partition (1,000 tokens) and a `LOCKED` partition (500 tokens). 
- Transfers are meticulously controlled by specifying the exact partition being moved (`transferByPartition`).

### 2. Lock-up and Vesting Mechanics
Using the partition system, it is possible to simulate regulatory lock-up periods. Tokens issued into a restricted partition cannot be transferred by the investor. Once the lock-up expires, the system operator/issuer can redeem the locked tokens and re-issue them into a tradable partition (e.g., Class A).

### 3. On-chain Document Management
RWA and STO regulations mandate strict tracking of legal documents (prospectuses, terms of service). ERC-1400 enforces this at the contract level by storing document URIs and cryptographic hashes (`documentHash`) to guarantee tamper-proof legal trails.

## Documentation & Demonstration

As part of the analysis, this repository includes custom documentation and a dedicated test suite to demonstrate the core partition mechanics.

### 1. Architecture Analysis (`docs/ERC1400_상세분석.md`)
A detailed Korean documentation file comparing the fundamental architectural differences between ERC-1400 (Partition-based) and ERC-3643 (Module-based) standards. This serves as a key reference for STO platform design choices.

### 2. Partition Demo Test (`test/interview_partition_demo.test.js`)
A conceptual test suite demonstrating how partitions work in a real-world Security Token Offering scenario (Common vs. Locked shares).

**Key Test Scenarios:**
- **Multi-Partition Issuance:** Issuing different classes of tokens (Common vs. Restricted) to a single investor wallet.
- **Partition-Restricted Transfers:** Ensuring users can only transfer assets from unrestricted partitions.
- **Lock-up Release Simulation:** Demonstrating an operator upgrading restricted tokens into common tokens upon maturity.

**How to Run the Demo Test:**
```bash
# Since this repository utilizes Truffle, run the specific test file using:
npx truffle test test/interview_partition_demo.test.js
```

## Conclusion

Understanding ERC-1400 provides critical insight into the complex requirements of enterprise-grade asset tokenization. By analyzing its partition-based architecture and comparing it with module-based standards, developers can make informed architectural decisions when designing institutional STO platforms.

---
*Disclaimer: This repository utilizes the foundational work from the ConsenSys ERC-1400 reference implementation for educational and structural analysis purposes.*
