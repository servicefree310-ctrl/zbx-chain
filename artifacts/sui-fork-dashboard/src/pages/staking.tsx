import React from "react";
import { CodeBlock } from "@/components/ui/code-block";
import { TrendingUp, Users, Award, RefreshCw } from "lucide-react";

export default function Staking() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Staking Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Let ZBX holders delegate their tokens to validators and earn staking rewards on the Zebvix Proof-of-Stake network.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: TrendingUp, label: "APY Rewards", desc: "Validator earnings" },
          { icon: Users, label: "Delegation", desc: "Stake to validators" },
          { icon: Award, label: "Epoch Rewards", desc: "Daily distribution" },
          { icon: RefreshCw, label: "Unstaking", desc: "Unbonding period" },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="p-4 rounded-lg bg-card border border-border text-center">
            <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-sm font-semibold">{label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">How Zebvix Staking Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            {[
              { step: "1", title: "Delegate ZBX", desc: "ZBX holder chooses a validator and delegates tokens. Tokens stay in their wallet — they are not transferred." },
              { step: "2", title: "Earn Rewards", desc: "Every epoch (24 hours), the network distributes rewards proportional to stake. Validator takes a commission." },
              { step: "3", title: "Unstake", desc: "Holder can unstake anytime. Tokens are returned after the unbonding period (typically 1 epoch)." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="p-4 rounded-lg bg-card border border-border">
                <div className="text-2xl font-bold font-mono text-primary mb-1">{step}</div>
                <div className="font-semibold mb-1">{title}</div>
                <div className="text-muted-foreground text-xs">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Step 1 — Stake ZBX via CLI</h2>
          <p className="text-sm text-muted-foreground">For advanced users — use the zebvix-node CLI to stake directly.</p>
          <CodeBlock language="bash" code={`# Stake ZBX to a validator
zebvix-node client call \\
  --package 0x3 \\
  --module sui_system \\
  --function request_add_stake \\
  --args \\
    0x5                        # SuiSystemState object \\
    "<COIN_OBJECT_ID>"         # your ZBX coin to stake \\
    "<VALIDATOR_ADDRESS>"      # validator to delegate to \\
  --gas-budget 10000000

# Check your stake position
zebvix-node client object <STAKE_OBJECT_ID>`} />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Step 2 — Query Validators &amp; APY</h2>
          <CodeBlock language="typescript" code={`import { SuiClient } from '@mysten/sui.js/client';

const client = new SuiClient({ url: 'https://rpc.zebvix.io' });

// Get all active validators
const validators = await client.getLatestSuiSystemState();

validators.activeValidators.forEach(v => {
  const commission = Number(v.commissionRate) / 100;
  const stakeShare = Number(v.stakingPoolSuiBalance);
  
  console.log({
    name: v.name,
    address: v.suiAddress,
    commission: \`\${commission}%\`,
    totalStake: \`\${stakeShare / 1e9} ZBX\`,
    apy: calculateAPY(v), // implement based on your epoch rewards
  });
});`} />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Step 3 — Build Staking UI (React)</h2>
          <CodeBlock language="bash" code={`git clone https://github.com/MystenLabs/sui.git
cd sui/apps/wallet  # Or build a standalone staking dApp

# Alternative: Fork Sui's staking component from sui-explorer
# It already has validator list, stake, unstake functionality`} />
          <CodeBlock language="typescript" code={`// ZBX Staking component (simplified)
import { useWallet } from '@mysten/wallet-kit';

export function StakeZBX({ validatorAddress }: { validatorAddress: string }) {
  const { signAndExecuteTransactionBlock } = useWallet();
  
  const handleStake = async (amountZBX: number) => {
    const tx = new TransactionBlock();
    const [stakeCoin] = tx.splitCoins(tx.gas, [tx.pure(amountZBX * 1e9)]);
    
    tx.moveCall({
      target: '0x3::sui_system::request_add_stake',
      arguments: [
        tx.object('0x5'),        // system state
        stakeCoin,
        tx.pure(validatorAddress),
      ],
    });
    
    await signAndExecuteTransactionBlock({ transactionBlock: tx });
  };
  
  return (
    <button onClick={() => handleStake(100)}>
      Stake 100 ZBX
    </button>
  );
}`} />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Step 4 — Unstake ZBX</h2>
          <CodeBlock language="bash" code={`# Request unstake — returns ZBX after epoch ends
zebvix-node client call \\
  --package 0x3 \\
  --module sui_system \\
  --function request_withdraw_stake \\
  --args \\
    0x5                      # SuiSystemState \\
    "<STAKED_SUI_OBJECT_ID>" # your stake object \\
  --gas-budget 10000000`} />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Validator Commission Config</h2>
          <p className="text-sm text-muted-foreground">Set your validator's commission rate in genesis or update it per epoch.</p>
          <CodeBlock language="yaml" code={`# In genesis.yaml — per validator:
validators:
  - name: "Zebvix Validator 1"
    commission_rate: 5     # 5% — validator keeps 5% of rewards
    gas_price: 1000
    # ... other fields`} />
        </div>

        <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/5 text-sm space-y-1">
          <div className="font-semibold text-green-400">Staking Parameters</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs font-mono text-muted-foreground mt-1">
            <div>Epoch duration: <span className="text-foreground">24 hours</span></div>
            <div>Min stake: <span className="text-foreground">1 ZBX</span></div>
            <div>Max validators: <span className="text-foreground">100</span></div>
            <div>Unbonding: <span className="text-foreground">1 epoch</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
