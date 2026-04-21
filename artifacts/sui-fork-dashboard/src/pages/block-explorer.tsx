import React from "react";
import { CodeBlock } from "@/components/ui/code-block";
import { Search, Globe, Database, Eye } from "lucide-react";

export default function BlockExplorer() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Block Explorer</h1>
        <p className="text-lg text-muted-foreground">
          Deploy a public block explorer for the Zebvix (ZBX) chain — lets users search transactions, blocks, addresses, and smart contracts.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Search, label: "Tx Search", desc: "Find any transaction" },
          { icon: Database, label: "Block Data", desc: "Full block history" },
          { icon: Globe, label: "Address Info", desc: "Balance & history" },
          { icon: Eye, label: "Contract View", desc: "Read Move modules" },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="p-4 rounded-lg bg-card border border-border text-center">
            <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-sm font-semibold">{label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 text-sm">
        <span className="font-semibold text-primary">Recommended: </span>
        <span className="text-muted-foreground">
          Use <strong className="text-foreground">Sui Explorer (open-source)</strong> — fork it and point to your Zebvix RPC endpoint. It's React-based and easy to customize.
        </span>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Step 1 — Clone Sui Explorer</h2>
          <CodeBlock language="bash" code={`# On a separate server (2 CPU, 4 GB RAM is enough)
git clone https://github.com/MystenLabs/sui-explorer.git zebvix-explorer
cd zebvix-explorer
npm install`} />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Step 2 — Configure Zebvix RPC Endpoint</h2>
          <p className="text-sm text-muted-foreground">Edit the network config to point to your Zebvix node's RPC.</p>
          <CodeBlock language="bash" code={`# File: apps/explorer/src/utils/api/DefaultRpcClient.ts
# Or look for network config — change to your RPC URL`} />
          <CodeBlock language="typescript" code={`// Replace the default Sui mainnet endpoint with yours:
export const ZEBVIX_NETWORK = {
  name: "Zebvix Mainnet",
  id: "zebvix-mainnet-1",
  url: "https://rpc.zebvix.io",      // your node RPC
  faucet: "https://faucet.zebvix.io" // optional
};`} />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Step 3 — Rebrand to Zebvix</h2>
          <CodeBlock language="bash" code={`# Bulk rename in the explorer codebase
grep -rl "Sui Explorer" . --include="*.tsx" --include="*.ts" --include="*.json" \\
  | xargs sed -i 's/Sui Explorer/Zebvix Explorer/g'

grep -rl '"Sui"' . --include="*.tsx" \\
  | xargs sed -i 's/"Sui"/"Zebvix"/g'

# Update title in index.html
sed -i 's/<title>.*<\\/title>/<title>Zebvix Explorer<\\/title>/' apps/explorer/index.html`} />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Step 4 — Build &amp; Deploy</h2>
          <CodeBlock language="bash" code={`# Build the explorer
npm run build

# Serve with nginx or deploy to Vercel/Netlify
# Option A — nginx (recommended for production)
npm install -g serve
serve -s apps/explorer/dist -p 3000

# Option B — nginx config
# point root to apps/explorer/dist/`} />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Nginx Config for Explorer</h2>
          <CodeBlock language="nginx" code={`server {
    listen 80;
    server_name explorer.zebvix.io;

    root /opt/zebvix-explorer/apps/explorer/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy RPC calls to your node
    location /rpc {
        proxy_pass http://127.0.0.1:9000;
        proxy_set_header Host $host;
    }
}`} />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Your Zebvix Node — Enable RPC</h2>
          <p className="text-sm text-muted-foreground">Make sure your validator.yaml has JSON-RPC enabled:</p>
          <CodeBlock language="yaml" code={`# In /var/zebvix/validator.yaml — add:
json-rpc-address: "0.0.0.0:9000"

# Firewall: open port 9000
ufw allow 9000/tcp comment "Zebvix JSON-RPC"`} />
        </div>

        <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/5 text-sm space-y-1">
          <div className="font-semibold text-green-400">Final URLs</div>
          <div className="text-muted-foreground font-mono text-xs space-y-0.5">
            <div>Explorer: &nbsp;&nbsp;<span className="text-foreground">https://explorer.zebvix.io</span></div>
            <div>RPC: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-foreground">https://rpc.zebvix.io</span> (port 9000)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
