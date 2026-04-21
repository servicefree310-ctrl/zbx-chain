import React from "react";
import { CodeBlock } from "@/components/ui/code-block";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Customization() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
          Zebvix Fork Customization Guide
        </h1>
        <p className="text-lg text-muted-foreground">
          Locations and instructions for modifying the Sui codebase to brand it as the Zebvix (ZBX) chain.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">Modifying the Chain Name & ID to Zebvix</h2>
          <p className="text-sm text-muted-foreground">
            Update these constants to ensure your Zebvix nodes don't accidentally connect to the official Sui network.
          </p>
          <CodeBlock 
            language="rust"
            code={`// File: crates/sui-config/src/lib.rs

pub const SUI_DIR: &str = ".zebvix"; // Changed from ".sui"
pub const SUI_CONFIG_DIR: &str = "zebvix_config";

// File: crates/sui-types/src/messages.rs
// Update chain identifier string to "zebvix-mainnet-1"
pub const CHAIN_IDENTIFIER: &str = "zebvix-mainnet-1";`}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">Rename the Token from SUI to ZBX</h2>
          <p className="text-sm text-muted-foreground">
            Update the native token name and symbol throughout the Move framework.
          </p>
          <CodeBlock 
            language="rust"
            code={`// File: crates/sui-types/src/gas_coin.rs

pub const ZBX_SYMBOL: &str = "ZBX";
pub const ZBX_NAME: &str = "Zebvix";
pub const ZBX_DESCRIPTION: &str = "The native token of the Zebvix blockchain";

// Also update MAX_SUPPLY for ZBX total supply:
pub const MAX_SUPPLY: u64 = 10_000_000_000_000_000_000; // 10 billion ZBX`}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">Key Files to Modify for Zebvix</h2>
          <div className="border border-border rounded-md overflow-hidden bg-card/50">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="text-foreground w-1/3">Filename</TableHead>
                  <TableHead className="text-foreground">What to Change for Zebvix</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b border-border hover:bg-muted/30">
                  <TableCell className="font-mono text-xs text-primary break-all">crates/sui-types/src/gas_coin.rs</TableCell>
                  <TableCell className="text-sm">Rename SUI → ZBX, modify max token supply, decimals, and initial token distribution logic.</TableCell>
                </TableRow>
                <TableRow className="border-b border-border hover:bg-muted/30">
                  <TableCell className="font-mono text-xs text-primary break-all">crates/sui-config/src/lib.rs</TableCell>
                  <TableCell className="text-sm">Change .sui directory to .zebvix, update config folder names to zebvix_config.</TableCell>
                </TableRow>
                <TableRow className="border-b border-border hover:bg-muted/30">
                  <TableCell className="font-mono text-xs text-primary break-all">crates/sui-framework/packages/sui-framework/</TableCell>
                  <TableCell className="text-sm">The core Move framework. Modify system modules, ZBX staking logic, and base object definitions.</TableCell>
                </TableRow>
                <TableRow className="border-b border-border hover:bg-muted/30">
                  <TableCell className="font-mono text-xs text-primary break-all">crates/sui-json-rpc/src/api/</TableCell>
                  <TableCell className="text-sm">Define custom Zebvix RPC endpoints. Add new queries specific to ZBX functionality.</TableCell>
                </TableRow>
                <TableRow className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs text-primary break-all">crates/sui-core/src/consensus_adapter.rs</TableCell>
                  <TableCell className="text-sm">Tune Zebvix consensus parameters, block batching sizes, and submission logic to Mysticeti.</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">Adding Custom Native Functions to Zebvix</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Native functions allow Zebvix Move smart contracts to call out to Rust code for performance-critical or cryptographic operations that are too expensive to run inside the VM.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            1. Define the Rust implementation in <code className="font-mono bg-muted px-1 rounded text-xs">crates/sui-framework/src/natives/</code><br/>
            2. Register the mapping in the native function registry.<br/>
            3. Expose the native signature in the Zebvix Move framework (<code className="font-mono bg-muted px-1 rounded text-xs">native public fun my_function();</code>).
          </p>
        </div>
      </div>
    </div>
  );
}
