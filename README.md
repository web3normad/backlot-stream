# BacklotFlix

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

BacklotFlix is a blockchain-powered movie streaming platform that combines traditional streaming with decentralized funding and revenue sharing for film projects.

## 🎬 Overview

BacklotFlix revolutionizes how films are funded and monetized by connecting creators directly with investors through blockchain technology. Users can:

- Browse and watch movies through a modern streaming interface
- Fund film projects through tiered investments (Bronze, Silver, Gold, Platinum)
- Earn revenue shares from successful projects they've invested in
- Create and manage film projects as creators

## ✨ Features

- **Movie Streaming:** Enjoy a catalog of films with modern streaming capabilities
- **Investment Portal:** Browse and invest in upcoming film projects with tiered investment options (Bronze, Silver, Gold, Platinum)
- **Creator Dashboard:** Manage film projects and view performance statistics
- **Investor Dashboard:** Track investments, revenue, and portfolio performance
- **Blockchain Integration:** Secure transactions and ownership through smart contracts
- **NFT Representations:** Investments represented as digital assets on the blockchain
- **Revenue Distribution:** Automatic distribution of streaming revenue to project creators and investors
- **Project Lifecycle Management:** Track projects from funding through production to streaming

## 🛠️ Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Blockchain Integration:** wagmi, viem, Rainbow Kit
- **RPC Provider:** Alchemy
- **Smart Contract:** ERC721-based BacklotFlix contract

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- MetaMask or another Ethereum wallet browser extension
- OpenZeppelin contracts library (for smart contract development)

## 🚀 Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/backlotflix.git
   cd backlotflix
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables by creating a `.env.local` file:
   ```
   NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
   NEXT_PUBLIC_CHAIN_ID=1 # Use appropriate chain ID (1 for Ethereum mainnet)
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
📂 app
 ┣ 📂 (auth)
 ┃ ┣ 📂 login
 ┃ ┗ 📂 register
 ┣ 📂 (dashboard)
 ┃ ┣ 📂 dashboard
 ┃ ┃ ┣ 📂 creator
 ┃ ┃ ┗ 📂 investor
 ┃ ┗ 📂 profile
 ┣ 📂 (main)
 ┃ ┣ 📂 browse
 ┃ ┣ 📂 movie/[id]
 ┃ ┗ 📂 watch/[id]
 ┣ 📂 invest
 ┃ ┗ 📂 [id]
 ┣ 📂 create-project
 ┗ 📜 page.js

📂 components
 ┣ 📂 ui
 ┣ 📂 layout
 ┣ 📂 movies
 ┣ 📂 blockchain
 ┗ 📂 providers

📂 hooks
📂 lib
📂 public
📂 types
```

## 🔒 Smart Contract Integration

BacklotFlix uses a single smart contract architecture that handles all platform functionality:

1. **BacklotFlix Contract** - An ERC721-based contract that:
   - Manages film project creation and funding
   - Mints NFTs representing investment shares
   - Tracks project statuses (Funding, Production, Streaming, Completed, Cancelled)
   - Distributes streaming revenue to investors based on shares
   - Handles investment refunds if projects are cancelled

## 🧪 Testing

Run tests with:

```bash
npm test
# or
yarn test
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgments

- Next.js for the amazing React framework
- The Ethereum community for blockchain infrastructure
- All contributors and supporters of the project
