import React from "react";
import { CodeBlock } from "@/components/ui/code-block";

export default function Validators() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
          Validator Setup
        </h1>
        <p className="text-lg text-muted-foreground">
          Configure and run the Zebvix nodes responsible for consensus and ZBX transaction execution.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">1. Generate Keypairs</h2>
          <p className="text-muted-foreground text-sm">
            Zebvix validators require multiple keypairs for different network functions: Protocol (Consensus), Network (P2P), and Worker (Narwhal/Mysticeti).
          </p>
          <CodeBlock 
            language="bash"
            code={`sui keytool generate ed25519
# Generates sui.keystore containing your Zebvix account address
sui keytool generate bls12381
# For protocol/consensus keys on the Zebvix network`}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">2. Configure validator.yaml</h2>
          <p className="text-muted-foreground text-sm">
            Create the primary configuration file for your Zebvix validator node.
          </p>
          <CodeBlock 
            language="yaml"
            code={`---
protocol-key-pair:
  value: "<BASE64_ENCODED_KEY>"
network-key-pair:
  value: "<BASE64_ENCODED_KEY>"
worker-key-pair:
  value: "<BASE64_ENCODED_KEY>"
account-key-pair:
  value: "<BASE64_ENCODED_KEY>"

network-address: "/ip4/0.0.0.0/tcp/8080/http"
metrics-address: "0.0.0.0:9184"
admin-interface-port: 1337

consensus-config:
  address: "/ip4/127.0.0.1/tcp/8083/http"
  db-path: "/var/zebvix/consensus_db"

genesis:
  genesis-file-location: "/var/zebvix/genesis.blob"`}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">3. Run the Zebvix Node</h2>
          <p className="text-muted-foreground text-sm">
            Start the node using the compiled binary and your Zebvix configuration file.
          </p>
          <CodeBlock 
            language="bash"
            code={`./target/release/sui-node --config-path /var/zebvix/validator.yaml`}
          />
        </div>

        <div className="p-4 rounded-lg bg-card border border-border mt-8">
          <h3 className="text-lg font-semibold mb-2">Joining the Zebvix Committee</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Starting a Zebvix validator node does not automatically add it to the active consensus committee. A prospective validator must accumulate enough delegated ZBX stake to surpass the minimum stake threshold. Once the threshold is met, the Zebvix network will automatically include the validator in the active set at the start of the next epoch boundary.
          </p>
        </div>
      </div>
    </div>
  );
}
