import React from "react";
import { CodeBlock } from "@/components/ui/code-block";
import { Droplets, Clock, Shield, Terminal } from "lucide-react";

export default function Faucet() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Testnet Faucet</h1>
        <p className="text-lg text-muted-foreground">
          Deploy a ZBX faucet so developers can get free testnet tokens to test their dApps on the Zebvix network.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Droplets, label: "Free ZBX", desc: "Testnet tokens only" },
          { icon: Clock, label: "Rate Limiting", desc: "1 request / 24 hrs" },
          { icon: Shield, label: "Anti-abuse", desc: "IP + address limit" },
          { icon: Terminal, label: "REST API", desc: "POST /gas endpoint" },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="p-4 rounded-lg bg-card border border-border text-center">
            <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-sm font-semibold">{label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/5 text-sm">
        <span className="font-semibold text-yellow-400">Testnet Only: </span>
        <span className="text-muted-foreground">
          Faucet sirf testnet ke liye hota hai. Mainnet par faucet mat chalao — real ZBX tokens distribute ho jayenge.
        </span>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Option A — Use Sui's Built-in Faucet</h2>
          <p className="text-sm text-muted-foreground">Zebvix (Sui fork) has a built-in faucet binary. Enable it in your testnet node config.</p>
          <CodeBlock language="yaml" code={`# In your testnet validator.yaml — add:
enable-event-processing: true

# Start faucet separately:
zebvix-node faucet \\
  --config /var/zebvix/validator.yaml \\
  --port 9123 \\
  --faucet-wallet-key "<YOUR_FAUCET_WALLET_PRIVATE_KEY>"`} />
          <CodeBlock language="bash" code={`# Test the faucet
curl -X POST https://faucet.zebvix.io/gas \\
  -H "Content-Type: application/json" \\
  -d '{"FixedAmountRequest": {"recipient": "0xYOUR_ADDRESS"}}'`} />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Option B — Custom Node.js Faucet Server</h2>
          <p className="text-sm text-muted-foreground">Build your own faucet with rate limiting, CAPTCHA, and a UI.</p>
          <CodeBlock language="bash" code={`mkdir zebvix-faucet && cd zebvix-faucet
npm init -y
npm install express @mysten/sui.js rate-limiter-flexible cors dotenv`} />
          <CodeBlock language="javascript" code={`// server.js — Zebvix Faucet Backend
import express from 'express';
import { SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const app = express();
app.use(express.json());

const client = new SuiClient({ url: 'https://testnet-rpc.zebvix.io' });

// Faucet wallet — fund this with testnet ZBX
const keypair = Ed25519Keypair.fromSecretKey(Buffer.from(process.env.FAUCET_KEY, 'hex'));

// Rate limiter: 1 request per IP per 24 hours
const rateLimiter = new RateLimiterMemory({ points: 1, duration: 86400 });

app.post('/gas', async (req, res) => {
  const { recipient } = req.body?.FixedAmountRequest || {};
  if (!recipient) return res.status(400).json({ error: 'recipient required' });

  try {
    await rateLimiter.consume(req.ip);
  } catch {
    return res.status(429).json({ error: 'Rate limit: 1 request per 24 hours' });
  }

  try {
    const tx = new TransactionBlock();
    const [coin] = tx.splitCoins(tx.gas, [tx.pure(1_000_000_000)]); // 1 ZBX
    tx.transferObjects([coin], tx.pure(recipient));

    const result = await client.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      signer: keypair,
    });

    res.json({ transferredGasObjects: [{ id: result.digest, amount: '1000000000' }] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (_, res) => res.json({ status: 'ok', network: 'zebvix-testnet-1' }));

app.listen(9123, () => console.log('Zebvix Faucet running on port 9123'));`} />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Faucet Environment Variables</h2>
          <CodeBlock language="bash" code={`# .env file
FAUCET_KEY=your_faucet_wallet_private_key_hex
RPC_URL=https://testnet-rpc.zebvix.io
FAUCET_AMOUNT=1000000000  # 1 ZBX in MIST (9 decimals)
RATE_LIMIT_HOURS=24`} />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Systemd Service for Faucet</h2>
          <CodeBlock language="ini" code={`[Unit]
Description=Zebvix Testnet Faucet
After=network.target

[Service]
Type=simple
User=zebvix
WorkingDirectory=/opt/zebvix-faucet
EnvironmentFile=/opt/zebvix-faucet/.env
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target`} />
          <CodeBlock language="bash" code={`systemctl enable --now zebvix-faucet
# Faucet available at: https://faucet.zebvix.io/gas`} />
        </div>
      </div>
    </div>
  );
}
