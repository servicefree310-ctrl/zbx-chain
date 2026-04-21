import React from "react";

export default function Tokenomics() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
          Zebvix (ZBX) Tokenomics & Parameters
        </h1>
        <p className="text-lg text-muted-foreground">
          Understanding the ZBX native token mechanics and economic parameters of the Zebvix network.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-5 border border-border rounded-lg bg-card/80 flex flex-col justify-center text-center">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">ZBX Max Supply</span>
          <span className="text-3xl font-bold text-primary font-mono">10,000,000,000</span>
          <span className="text-xs text-muted-foreground mt-1">ZBX tokens</span>
        </div>
        <div className="p-5 border border-border rounded-lg bg-card/80 flex flex-col justify-center text-center">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">ZBX Decimals</span>
          <span className="text-3xl font-bold text-primary font-mono">9</span>
          <span className="text-xs text-muted-foreground mt-1">1 ZBX = 10^9 mist</span>
        </div>
        <div className="p-5 border border-border rounded-lg bg-card/80 flex flex-col justify-center text-center">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Epoch Length</span>
          <span className="text-3xl font-bold text-primary font-mono">24h</span>
          <span className="text-xs text-muted-foreground mt-1">ZBX rewards per epoch</span>
        </div>
      </div>

      <div className="space-y-6 mt-8">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold border-b border-border pb-2 text-primary">ZBX Staking Rewards Mechanism</h2>
          <p className="text-sm text-muted-foreground leading-relaxed pt-2">
            At the end of each epoch, the Zebvix system calculates the total gas fees collected in ZBX. A portion of these fees is diverted to the <strong>Storage Fund</strong>, and the remainder is distributed to validators and delegators based on their ZBX stake weight and performance during the epoch.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold border-b border-border pb-2 text-primary">Gas Price Mechanism</h2>
          <p className="text-sm text-muted-foreground leading-relaxed pt-2">
            The Zebvix network employs a <strong>Reference Gas Price (RGP)</strong> mechanism. At the start of an epoch, validators submit quotes for the minimum ZBX gas price they are willing to accept. The RGP is set at the 2/3 percentile of stake-weighted quotes, ensuring predictable fees for ZBX users while preventing a race to the bottom among validators.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold border-b border-border pb-2 text-primary">The ZBX Storage Fund</h2>
          <p className="text-sm text-muted-foreground leading-relaxed pt-2">
            Users pay a storage fee alongside execution gas for transactions that allocate new data on the Zebvix chain. This fee is placed into the Storage Fund. The fund's staking rewards are distributed to current Zebvix validators to compensate them for the ongoing cost of storing historical data. When a user deletes an object, they receive a ZBX storage rebate.
          </p>
        </div>

        <div className="bg-muted/30 border border-border p-6 rounded-lg mt-6">
          <h3 className="font-semibold text-lg mb-3">Customizing ZBX Total Supply</h3>
          <p className="text-sm text-muted-foreground mb-4">
            To change the maximum ZBX token supply in your Zebvix fork, you must modify the source code before compilation. Look for the <code className="bg-black/30 px-1 rounded font-mono">MAX_SUPPLY</code> constant in:
          </p>
          <div className="bg-background border border-border rounded p-3 font-mono text-sm text-primary">
            crates/sui-types/src/gas_coin.rs
          </div>
        </div>
      </div>
    </div>
  );
}
