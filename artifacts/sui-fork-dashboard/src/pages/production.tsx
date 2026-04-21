import React from "react";
import { CodeBlock } from "@/components/ui/code-block";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Production() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono font-semibold mb-4 tracking-widest uppercase">
          Production Grade
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
          Zebvix Production Chain Launch
        </h1>
        <p className="text-lg text-muted-foreground">
          Everything required to launch Zebvix (ZBX) as a public, production-grade blockchain — from binary renaming to mainnet security hardening.
        </p>
      </div>

      {/* Binary & Cargo Rename */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-primary border-b border-border pb-2">1. Rename Binary & Cargo Packages</h2>
        <p className="text-sm text-muted-foreground">
          For a production chain, your binary must be called <code className="bg-muted px-1 rounded font-mono">zebvix-node</code> — not <code className="bg-muted px-1 rounded font-mono">sui-node</code>. Update <code className="bg-muted px-1 rounded font-mono">Cargo.toml</code> files.
        </p>
        <CodeBlock
          language="toml"
          code={`# File: crates/sui-node/Cargo.toml
[package]
name = "zebvix-node"       # was: sui-node
version = "1.0.0"
edition = "2021"

[[bin]]
name = "zebvix-node"       # was: sui-node
path = "src/main.rs"

# File: crates/sui-tool/Cargo.toml
[package]
name = "zebvix"            # was: sui
# This gives you the "zebvix" CLI tool`}
        />
        <p className="text-sm text-muted-foreground mt-2">
          After editing, rebuild: <code className="bg-muted px-1 rounded font-mono">cargo build --release -p zebvix-node</code>. The binary will be at <code className="bg-muted px-1 rounded font-mono">target/release/zebvix-node</code>.
        </p>
      </div>

      {/* Full Source Renaming */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-primary border-b border-border pb-2">2. Full Source Code Branding (Production Must-Do)</h2>
        <p className="text-sm text-muted-foreground">
          These changes prevent your chain from accidentally peering with the official Sui mainnet and give it a proper Zebvix identity.
        </p>
        <div className="border border-border rounded-md overflow-hidden bg-card/50">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead className="text-foreground">File</TableHead>
                <TableHead className="text-foreground">Change</TableHead>
                <TableHead className="text-foreground">Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-b border-border hover:bg-muted/30">
                <TableCell className="font-mono text-xs text-primary">crates/sui-config/src/lib.rs</TableCell>
                <TableCell className="text-sm"><code className="font-mono text-xs">.sui</code> → <code className="font-mono text-xs">.zebvix</code> (config dir)</TableCell>
                <TableCell><span className="text-red-400 font-semibold text-xs">Required</span></TableCell>
              </TableRow>
              <TableRow className="border-b border-border hover:bg-muted/30">
                <TableCell className="font-mono text-xs text-primary">crates/sui-types/src/gas_coin.rs</TableCell>
                <TableCell className="text-sm">Token symbol SUI → ZBX, name → Zebvix</TableCell>
                <TableCell><span className="text-red-400 font-semibold text-xs">Required</span></TableCell>
              </TableRow>
              <TableRow className="border-b border-border hover:bg-muted/30">
                <TableCell className="font-mono text-xs text-primary">crates/sui-node/Cargo.toml</TableCell>
                <TableCell className="text-sm">Package name sui-node → zebvix-node</TableCell>
                <TableCell><span className="text-red-400 font-semibold text-xs">Required</span></TableCell>
              </TableRow>
              <TableRow className="border-b border-border hover:bg-muted/30">
                <TableCell className="font-mono text-xs text-primary">crates/sui-tool/Cargo.toml</TableCell>
                <TableCell className="text-sm">CLI tool name sui → zebvix</TableCell>
                <TableCell><span className="text-red-400 font-semibold text-xs">Required</span></TableCell>
              </TableRow>
              <TableRow className="border-b border-border hover:bg-muted/30">
                <TableCell className="font-mono text-xs text-primary">genesis.yaml</TableCell>
                <TableCell className="text-sm">chain_id: "zebvix-mainnet-1"</TableCell>
                <TableCell><span className="text-red-400 font-semibold text-xs">Required</span></TableCell>
              </TableRow>
              <TableRow className="border-b border-border hover:bg-muted/30">
                <TableCell className="font-mono text-xs text-primary">crates/sui-framework/packages/</TableCell>
                <TableCell className="text-sm">Move package names in Move.toml files</TableCell>
                <TableCell><span className="text-yellow-400 font-semibold text-xs">Recommended</span></TableCell>
              </TableRow>
              <TableRow className="hover:bg-muted/30">
                <TableCell className="font-mono text-xs text-primary">README, docs/</TableCell>
                <TableCell className="text-sm">Documentation branding</TableCell>
                <TableCell><span className="text-muted-foreground font-semibold text-xs">Optional</span></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Bulk rename script */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-primary border-b border-border pb-2">3. Bulk Rename Script</h2>
        <p className="text-sm text-muted-foreground">
          Run this script from the root of your forked repository to replace the most common string occurrences. Review changes with <code className="bg-muted px-1 rounded font-mono">git diff</code> before committing.
        </p>
        <CodeBlock
          language="bash"
          code={`#!/bin/bash
# Run from root of your zebvix repo
# WARNING: Review all changes with git diff before committing

# Replace in Cargo.toml files
find . -name "Cargo.toml" \\
  -not -path "*/target/*" \\
  -exec sed -i 's/name = "sui-node"/name = "zebvix-node"/g' {} +

# Replace token symbol in source files
find ./crates/sui-types -name "*.rs" \\
  -exec sed -i 's/SUI_SYMBOL = "SUI"/SUI_SYMBOL = "ZBX"/g' {} +

# Replace config directory
find ./crates/sui-config -name "*.rs" \\
  -exec sed -i 's/".sui"/.zebvix"/g' {} +

echo "Done. Run: git diff --stat to review changes."`}
        />
      </div>

      {/* Security hardening */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-primary border-b border-border pb-2">4. Production Security Hardening</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 border border-border rounded-lg bg-card/60">
            <h4 className="font-semibold text-foreground mb-2">Key Management</h4>
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-4">
              <li>Store validator private keys in HSM (Hardware Security Module)</li>
              <li>Never store keys in plaintext on disk</li>
              <li>Generate keys on air-gapped machines</li>
              <li>Keep cold backup of all keypairs offline</li>
            </ul>
          </div>
          <div className="p-4 border border-border rounded-lg bg-card/60">
            <h4 className="font-semibold text-foreground mb-2">Network Security</h4>
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-4">
              <li>Validator nodes: no public RPC exposure</li>
              <li>Use VPN / private subnet for validator P2P</li>
              <li>DDoS protection on public full-nodes</li>
              <li>Rate limit JSON-RPC endpoints</li>
            </ul>
          </div>
          <div className="p-4 border border-border rounded-lg bg-card/60">
            <h4 className="font-semibold text-foreground mb-2">Infrastructure</h4>
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-4">
              <li>Minimum 4 geographically distributed validators</li>
              <li>Dedicated servers — no shared hosting</li>
              <li>NVMe SSD with RAID for DB storage</li>
              <li>UPS / redundant power supply</li>
            </ul>
          </div>
          <div className="p-4 border border-border rounded-lg bg-card/60">
            <h4 className="font-semibold text-foreground mb-2">Monitoring</h4>
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-4">
              <li>Prometheus + Grafana for all nodes</li>
              <li>Alert on consensus lag, missed votes</li>
              <li>Monitor disk usage (chain grows fast)</li>
              <li>On-call rotation for critical alerts</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Testnet first */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-primary border-b border-border pb-2">5. Testnet Before Mainnet</h2>
        <p className="text-sm text-muted-foreground">
          Always run a full testnet with at least 4 validators before mainnet launch. Use a different chain_id for testnet.
        </p>
        <CodeBlock
          language="yaml"
          code={`# testnet genesis.yaml
chain_id: "zebvix-testnet-1"    # Different from mainnet!
epoch_duration_ms: 3600000      # 1 hour epochs on testnet
reference_gas_price: 1000
min_validator_count: 4

# mainnet genesis.yaml
chain_id: "zebvix-mainnet-1"    # Final, never change after launch
epoch_duration_ms: 86400000     # 24 hour epochs on mainnet
reference_gas_price: 1000
min_validator_count: 4`}
        />
      </div>

      {/* Deployment infra */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-primary border-b border-border pb-2">6. Recommended Server Specs</h2>
        <div className="border border-border rounded-md overflow-hidden bg-card/50">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead className="text-foreground">Component</TableHead>
                <TableHead className="text-foreground">Validator Node</TableHead>
                <TableHead className="text-foreground">Full Node (RPC)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-b border-border hover:bg-muted/30">
                <TableCell className="font-medium">CPU</TableCell>
                <TableCell>32+ cores (AMD EPYC / Intel Xeon)</TableCell>
                <TableCell>16+ cores</TableCell>
              </TableRow>
              <TableRow className="border-b border-border hover:bg-muted/30">
                <TableCell className="font-medium">RAM</TableCell>
                <TableCell>128 GB DDR5 ECC</TableCell>
                <TableCell>64 GB</TableCell>
              </TableRow>
              <TableRow className="border-b border-border hover:bg-muted/30">
                <TableCell className="font-medium">Storage</TableCell>
                <TableCell>4 TB NVMe SSD (RAID 1)</TableCell>
                <TableCell>2 TB NVMe SSD</TableCell>
              </TableRow>
              <TableRow className="border-b border-border hover:bg-muted/30">
                <TableCell className="font-medium">Network</TableCell>
                <TableCell>1 Gbps dedicated</TableCell>
                <TableCell>1 Gbps dedicated</TableCell>
              </TableRow>
              <TableRow className="hover:bg-muted/30">
                <TableCell className="font-medium">OS</TableCell>
                <TableCell>Ubuntu 22.04 LTS</TableCell>
                <TableCell>Ubuntu 22.04 LTS</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Systemd service */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-primary border-b border-border pb-2">7. Systemd Service (Auto-restart)</h2>
        <p className="text-sm text-muted-foreground">Run Zebvix node as a managed system service so it auto-restarts on crash or reboot.</p>
        <CodeBlock
          language="bash"
          code={`# /etc/systemd/system/zebvix-node.service
[Unit]
Description=Zebvix Node
After=network.target
Wants=network.target

[Service]
Type=simple
User=zebvix
ExecStart=/usr/local/bin/zebvix-node --config-path /var/zebvix/validator.yaml
Restart=always
RestartSec=10
LimitNOFILE=1000000
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target

# Enable and start:
# sudo systemctl daemon-reload
# sudo systemctl enable zebvix-node
# sudo systemctl start zebvix-node
# sudo journalctl -u zebvix-node -f`}
        />
      </div>
    </div>
  );
}
