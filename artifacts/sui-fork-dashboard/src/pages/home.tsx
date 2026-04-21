import React from "react";
import { CodeBlock } from "@/components/ui/code-block";

export default function Home() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
          Sui Fork Dashboard
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          A precision reference manual for engineering teams building custom L1 blockchains on top of the Sui codebase.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 rounded-lg bg-card border border-border">
          <h3 className="text-lg font-semibold mb-2 text-primary">Move VM</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Object-centric smart contract execution environment. Secure, fast, and designed for parallel execution of independent transactions.
          </p>
        </div>
        <div className="p-6 rounded-lg bg-card border border-border">
          <h3 className="text-lg font-semibold mb-2 text-primary">Mysticeti Consensus</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sui's cutting-edge BFT consensus engine. Achieves sub-second latency and high throughput for shared-object transactions.
          </p>
        </div>
        <div className="p-6 rounded-lg bg-card border border-border">
          <h3 className="text-lg font-semibold mb-2 text-primary">Object Model</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Everything is an object. Owned objects bypass consensus entirely (Fast Path), enabling massive linear scalability.
          </p>
        </div>
        <div className="p-6 rounded-lg bg-card border border-border">
          <h3 className="text-lg font-semibold mb-2 text-primary">Validators</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Permissionless delegated Proof-of-Stake (dPoS) network. Validators process transactions and participate in consensus.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold border-b border-border pb-2">Prerequisites</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li><strong className="text-foreground font-medium">OS:</strong> Linux (Ubuntu 20.04/22.04 recommended) or macOS</li>
          <li><strong className="text-foreground font-medium">Rust:</strong> v1.75.0 or higher</li>
          <li><strong className="text-foreground font-medium">Git:</strong> Latest version</li>
          <li><strong className="text-foreground font-medium">Hardware (Validator):</strong> 24+ cores, 128GB RAM, 2TB+ NVMe SSD</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold border-b border-border pb-2">Quick Start</h2>
        <p className="text-muted-foreground">Clone the repository and build the node binary to get started immediately.</p>
        <CodeBlock 
          language="bash"
          code={`git clone https://github.com/MystenLabs/sui.git
cd sui
cargo build --release -p sui-node`}
        />
      </div>
    </div>
  );
}
