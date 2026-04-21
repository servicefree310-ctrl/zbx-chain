import React from "react";
import { CodeBlock } from "@/components/ui/code-block";

export default function Genesis() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
          Genesis Configuration
        </h1>
        <p className="text-lg text-muted-foreground">
          Define the initial state, parameters, and validator set of your custom chain.
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <h3 className="font-semibold text-primary mb-2">The genesis.blob File</h3>
          <p className="text-sm text-foreground/80 leading-relaxed">
            The <code className="font-mono text-xs bg-black/30 px-1 rounded">genesis.blob</code> is a binary snapshot of the network's state at epoch 0. It is generated from a <code className="font-mono text-xs bg-black/30 px-1 rounded">genesis.yaml</code> configuration file and contains the Move framework, initial object allocations, and the founding validator committee.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Key Configuration Fields</h2>
          
          <div className="grid gap-4 mt-4">
            <div className="border border-border p-4 rounded-md bg-card/50">
              <h4 className="font-mono text-sm text-primary mb-1">chain_id</h4>
              <p className="text-sm text-muted-foreground">A unique string identifying your network (e.g., <code className="text-foreground">"my-sui-chain-1"</code>). Prevents replay attacks across different environments.</p>
            </div>
            <div className="border border-border p-4 rounded-md bg-card/50">
              <h4 className="font-mono text-sm text-primary mb-1">epoch_duration_ms</h4>
              <p className="text-sm text-muted-foreground">Length of an epoch in milliseconds. Default is <code className="text-foreground">86400000</code> (24 hours). At the end of each epoch, rewards are distributed and the committee may change.</p>
            </div>
            <div className="border border-border p-4 rounded-md bg-card/50">
              <h4 className="font-mono text-sm text-primary mb-1">gas_price</h4>
              <p className="text-sm text-muted-foreground">The starting reference gas price for the network before the first validator voting cycle.</p>
            </div>
            <div className="border border-border p-4 rounded-md bg-card/50">
              <h4 className="font-mono text-sm text-primary mb-1">validator_set</h4>
              <p className="text-sm text-muted-foreground">The list of initial validators, their public keys (network, worker, protocol), and their initial stake.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Example genesis.yaml</h2>
          <CodeBlock 
            language="yaml"
            code={`---
chain_id: "custom-sui-mainnet-1"
epoch_duration_ms: 86400000
protocol_version: 1
reference_gas_price: 1000
initial_stake_subsidy_amount: 1000000000000000
min_validator_count: 4
max_validator_count: 100
validators:
  - name: "Founding Node A"
    account_address: "0x123...abc"
    network_pubkey: "..."
    worker_pubkey: "..."
    protocol_pubkey: "..."
    stake_amount: 1000000000000000
  - name: "Founding Node B"
    account_address: "0x456...def"
    # ... more validators`}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Building the Blob</h2>
          <p className="text-sm text-muted-foreground">Once configured, generate the blob using the Sui CLI tool.</p>
          <CodeBlock 
            language="bash"
            code={`sui genesis --from-yaml genesis.yaml --working-dir /var/sui/genesis`}
          />
        </div>
      </div>
    </div>
  );
}
