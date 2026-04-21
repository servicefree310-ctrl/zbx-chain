import React from "react";
import { CodeBlock } from "@/components/ui/code-block";
import { Wallet, Smartphone, Chrome, Key } from "lucide-react";

export default function WalletPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">ZBX Wallet</h1>
        <p className="text-lg text-muted-foreground">
          Deploy a custom Zebvix (ZBX) wallet — browser extension or web wallet. Users use it to store ZBX, sign transactions, and interact with Zebvix dApps.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Chrome, label: "Browser Extension", desc: "Chrome / Firefox" },
          { icon: Smartphone, label: "Mobile Wallet", desc: "React Native app" },
          { icon: Key, label: "Key Management", desc: "Ed25519 keypairs" },
          { icon: Wallet, label: "ZBX Transfers", desc: "Send & receive" },
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
          Fork <strong className="text-foreground">Sui Wallet</strong> (open-source Chrome extension) — already supports Ed25519, Move, and the Sui JSON-RPC which Zebvix also uses.
        </span>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Step 1 — Fork Sui Wallet (Chrome Extension)</h2>
          <CodeBlock language="bash" code={`git clone https://github.com/MystenLabs/sui.git
cd sui/apps/wallet
npm install`} />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Step 2 — Add Zebvix Network</h2>
          <p className="text-sm text-muted-foreground">Add your chain as a built-in network option in the wallet.</p>
          <CodeBlock language="typescript" code={`// File: src/background/NetworkEnv.ts (or similar network config file)
// Add Zebvix to the networks list:

export const ZEBVIX_NETWORK: Network = {
  name: "Zebvix Mainnet",
  id: "zebvix-mainnet-1",
  url: "https://rpc.zebvix.io",
  type: NetworkType.Custom,
};

export const ZEBVIX_TESTNET: Network = {
  name: "Zebvix Testnet",
  id: "zebvix-testnet-1",
  url: "https://testnet-rpc.zebvix.io",
  type: NetworkType.Custom,
};`} />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Step 3 — Rebrand UI to Zebvix</h2>
          <CodeBlock language="bash" code={`# Replace Sui branding across wallet UI
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/Sui Wallet/Zebvix Wallet/g'
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/ SUI / ZBX /g'

# Replace logo — put your logo SVG at:
# src/ui/app/components/logo/ZebvixLogo.svg

# Update manifest.json (extension name)
sed -i 's/"name": "Sui Wallet"/"name": "Zebvix Wallet"/' public/manifest.json`} />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Step 4 — Build Extension</h2>
          <CodeBlock language="bash" code={`npm run build

# Output will be in: dist/ folder
# Load in Chrome: chrome://extensions -> Load unpacked -> select dist/`} />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Step 5 — Publish to Chrome Web Store</h2>
          <CodeBlock language="bash" code={`# Package the extension
zip -r zebvix-wallet.zip dist/

# Submit to Chrome Web Store:
# https://chrome.google.com/webstore/devconsole
# Upload zebvix-wallet.zip
# Category: Productivity > Finance
# Pay $5 one-time developer registration fee`} />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Alternative — Web Wallet (No Extension)</h2>
          <p className="text-sm text-muted-foreground">Deploy a web-based wallet at wallet.zebvix.io using the Zebvix TypeScript SDK.</p>
          <CodeBlock language="bash" code={`# Install Sui SDK (works with Zebvix RPC)
npm install @mysten/sui.js

# Create a web wallet React app
npx create-react-app zebvix-web-wallet --template typescript
cd zebvix-web-wallet
npm install @mysten/sui.js`} />
          <CodeBlock language="typescript" code={`import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';

// Connect to Zebvix node
const client = new SuiClient({ url: 'https://rpc.zebvix.io' });

// Generate a new ZBX wallet
const keypair = new Ed25519Keypair();
const address = keypair.getPublicKey().toSuiAddress();
console.log('New ZBX Address:', address);

// Get ZBX balance
const balance = await client.getBalance({ owner: address, coinType: '0x2::zbx::ZBX' });
console.log('ZBX Balance:', balance.totalBalance);`} />
        </div>

        <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/5 text-sm space-y-1">
          <div className="font-semibold text-green-400">Wallet Endpoints</div>
          <div className="text-muted-foreground font-mono text-xs space-y-0.5">
            <div>Web Wallet: &nbsp;<span className="text-foreground">https://wallet.zebvix.io</span></div>
            <div>Extension:  &nbsp;<span className="text-foreground">Chrome Web Store → "Zebvix Wallet"</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
