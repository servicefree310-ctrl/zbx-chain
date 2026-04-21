import React from "react";
import { CodeBlock } from "@/components/ui/code-block";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Customization() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
          Fork Customization Guide
        </h1>
        <p className="text-lg text-muted-foreground">
          Locations and instructions for modifying core consensus logic, naming, and framework capabilities.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">Modifying the Chain Name & ID</h2>
          <p className="text-sm text-muted-foreground">
            Update these constants to ensure your nodes don't accidentally connect to the official network.
          </p>
          <CodeBlock 
            language="rust"
            code={`// File: crates/sui-config/src/lib.rs

pub const SUI_DIR: &str = ".my-chain"; // Changed from ".sui"
pub const SUI_CONFIG_DIR: &str = "my-chain_config";

// File: crates/sui-types/src/messages.rs
pub const SUI_SYSTEM_STATE_OBJECT_ID: ObjectID = ObjectID::from_single_byte(5);`}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">Key Files to Modify</h2>
          <div className="border border-border rounded-md overflow-hidden bg-card/50">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="text-foreground w-1/3">Filename</TableHead>
                  <TableHead className="text-foreground">Purpose</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b border-border hover:bg-muted/30">
                  <TableCell className="font-mono text-xs text-primary break-all">crates/sui-types/src/gas_coin.rs</TableCell>
                  <TableCell className="text-sm">Modify max token supply, decimals, and initial token distribution logic.</TableCell>
                </TableRow>
                <TableRow className="border-b border-border hover:bg-muted/30">
                  <TableCell className="font-mono text-xs text-primary break-all">crates/sui-framework/packages/sui-framework/</TableCell>
                  <TableCell className="text-sm">The core Move framework. Modify system modules, staking logic, and base object definitions.</TableCell>
                </TableRow>
                <TableRow className="border-b border-border hover:bg-muted/30">
                  <TableCell className="font-mono text-xs text-primary break-all">crates/sui-json-rpc/src/api/</TableCell>
                  <TableCell className="text-sm">Define custom RPC endpoints for your chain. Add new queries specific to your functionality.</TableCell>
                </TableRow>
                <TableRow className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs text-primary break-all">crates/sui-core/src/consensus_adapter.rs</TableCell>
                  <TableCell className="text-sm">Tune consensus parameters, block batching sizes, and submission logic to Mysticeti.</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">Adding Custom Native Functions</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Native functions allow Move smart contracts to call out to Rust code for performance-critical or cryptographic operations that are too expensive to run inside the VM.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            1. Define the Rust implementation in <code className="font-mono bg-muted px-1 rounded text-xs">crates/sui-framework/src/natives/</code><br/>
            2. Register the mapping in the native function registry.<br/>
            3. Expose the native signature in the Move framework (<code className="font-mono bg-muted px-1 rounded text-xs">native public fun my_function();</code>).
          </p>
        </div>
      </div>
    </div>
  );
}
