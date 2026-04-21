import React from "react";
import { CodeBlock } from "@/components/ui/code-block";
import { ArrowLeftRight, Lock, Layers, AlertTriangle } from "lucide-react";

export default function Bridge() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Cross-Chain Bridge</h1>
        <p className="text-lg text-muted-foreground">
          Enable asset transfers between Ethereum/BSC and the Zebvix (ZBX) chain using a lock-and-mint bridge architecture.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: ArrowLeftRight, label: "Lock & Mint", desc: "ETH/BSC → ZBX" },
          { icon: Lock, label: "Burn & Release", desc: "ZBX → ETH/BSC" },
          { icon: Layers, label: "Multi-chain", desc: "ETH, BSC, Polygon" },
          { icon: AlertTriangle, label: "Relayer", desc: "Off-chain watcher" },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="p-4 rounded-lg bg-card border border-border text-center">
            <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-sm font-semibold">{label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/5 text-sm">
        <span className="font-semibold text-yellow-400">⚠ Complex Component: </span>
        <span className="text-muted-foreground">
          Bridge requires a Solidity smart contract on Ethereum + a Move module on Zebvix + a relayer service. Plan for 2-4 weeks of development.
        </span>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Architecture Overview</h2>
          <div className="grid grid-cols-3 gap-2 text-sm text-center">
            {[
              { label: "Ethereum Side", items: ["Bridge.sol contract", "Lock USDT/ETH", "Emit event"] },
              { label: "Relayer (Off-chain)", items: ["Watch ETH events", "Sign proof", "Submit to Zebvix"] },
              { label: "Zebvix Side", items: ["bridge.move module", "Verify proof", "Mint wrapped token"] },
            ].map(({ label, items }) => (
              <div key={label} className="rounded-lg bg-card border border-border p-3">
                <div className="font-semibold text-primary mb-2">{label}</div>
                {items.map(item => (
                  <div key={item} className="text-xs text-muted-foreground py-0.5">{item}</div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Step 1 — Ethereum Bridge Contract (Solidity)</h2>
          <CodeBlock language="solidity" code={`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ZebvixBridge is Ownable {
    address public relayer;
    
    event TokensLocked(
        address indexed sender,
        address indexed token,
        uint256 amount,
        string zebvixRecipient,
        uint256 nonce
    );
    
    event TokensReleased(address indexed recipient, address indexed token, uint256 amount);
    
    mapping(bytes32 => bool) public processedTxs;
    uint256 public nonce;
    
    constructor(address _relayer) {
        relayer = _relayer;
    }
    
    // User calls this to send ETH/ERC20 to Zebvix
    function lockTokens(
        address token,
        uint256 amount,
        string calldata zebvixAddress
    ) external {
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        emit TokensLocked(msg.sender, token, amount, zebvixAddress, nonce++);
    }
    
    // Relayer calls this to release tokens back from Zebvix
    function releaseTokens(
        address recipient,
        address token,
        uint256 amount,
        bytes32 zebvixTxHash
    ) external {
        require(msg.sender == relayer, "Only relayer");
        require(!processedTxs[zebvixTxHash], "Already processed");
        processedTxs[zebvixTxHash] = true;
        IERC20(token).transfer(recipient, amount);
        emit TokensReleased(recipient, token, amount);
    }
}`} />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Step 2 — Deploy Solidity Contract</h2>
          <CodeBlock language="bash" code={`npm install -g hardhat
mkdir zebvix-bridge-eth && cd zebvix-bridge-eth
npx hardhat init

# Install dependencies
npm install @openzeppelin/contracts dotenv

# Deploy to Ethereum mainnet
npx hardhat run scripts/deploy.js --network mainnet`} />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Step 3 — Zebvix Move Module</h2>
          <CodeBlock language="move" code={`// sources/bridge.move — Zebvix side bridge module
module zebvix_bridge::bridge {
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;
    use sui::coin::{Self, Coin};
    use sui::transfer;
    use sui::event;

    struct BridgeAdmin has key { id: UID }
    
    struct TokensBridged has copy, drop {
        recipient: address,
        amount: u64,
        eth_tx_hash: vector<u8>,
    }

    // Admin (relayer) mints wrapped tokens on Zebvix
    public entry fun mint_bridged_token(
        _admin: &BridgeAdmin,
        recipient: address,
        amount: u64,
        eth_tx_hash: vector<u8>,
        ctx: &mut TxContext
    ) {
        // Mint logic here (integrate with your token module)
        event::emit(TokensBridged { recipient, amount, eth_tx_hash });
    }
}`} />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Step 4 — Relayer Service (Node.js)</h2>
          <CodeBlock language="javascript" code={`// relayer.js — watches Ethereum events and relays to Zebvix
import { ethers } from 'ethers';
import { SuiClient } from '@mysten/sui.js/client';

const ethProvider = new ethers.JsonRpcProvider(process.env.ETH_RPC);
const zebvixClient = new SuiClient({ url: 'https://rpc.zebvix.io' });

const bridge = new ethers.Contract(
  process.env.BRIDGE_CONTRACT_ADDRESS,
  ['event TokensLocked(address sender, address token, uint256 amount, string zebvixRecipient, uint256 nonce)'],
  ethProvider
);

// Watch for lock events on Ethereum
bridge.on('TokensLocked', async (sender, token, amount, zebvixRecipient, nonce) => {
  console.log(\`Bridging \${amount} from \${sender} to \${zebvixRecipient}\`);
  
  // Submit mint transaction to Zebvix
  // (sign with relayer keypair and call bridge::mint_bridged_token)
  await mintOnZebvix(zebvixRecipient, amount.toString());
});

console.log('Zebvix Bridge Relayer running...');`} />
        </div>

        <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/5 text-sm space-y-1">
          <div className="font-semibold text-green-400">Bridge Infrastructure</div>
          <div className="text-muted-foreground font-mono text-xs space-y-0.5">
            <div>ETH Contract: &nbsp;<span className="text-foreground">0x... (deploy on Ethereum)</span></div>
            <div>Zebvix Module: <span className="text-foreground">zebvix_bridge::bridge</span></div>
            <div>Bridge UI: &nbsp;&nbsp;&nbsp;<span className="text-foreground">https://bridge.zebvix.io</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
