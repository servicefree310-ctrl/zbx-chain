import React from "react";
import { CodeBlock } from "@/components/ui/code-block";

export default function Setup() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
          Environment Setup
        </h1>
        <p className="text-lg text-muted-foreground">
          Prepare your system to build and run a custom Sui-based node.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">1. Install Rust Toolchain</h2>
          <p className="text-muted-foreground text-sm">
            Sui requires a specific Rust version. Use rustup to install and configure it.
          </p>
          <CodeBlock 
            language="bash"
            code={`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.js | sh
source "$HOME/.cargo/env"
rustup update stable
rustup default 1.75.0`}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">2. Install System Dependencies</h2>
          <p className="text-muted-foreground text-sm">
            Essential build tools, SSL headers, and compilers required for compiling the Sui codebase.
          </p>
          <CodeBlock 
            language="bash"
            code={`# Ubuntu / Debian
sudo apt-get update
sudo apt-get install -y build-essential libssl-dev pkg-config clang cmake curl git`}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">3. Clone the Repository</h2>
          <p className="text-muted-foreground text-sm">
            Clone the official MystenLabs repository. You will eventually fork this to your own organization.
          </p>
          <CodeBlock 
            language="bash"
            code={`git clone https://github.com/MystenLabs/sui.git
cd sui
# Checkout a stable branch/tag for your fork base
git checkout mainnet-v1.20.0`}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">4. Build from Source</h2>
          <p className="text-muted-foreground text-sm">
            Compile the primary node binary. This process may take 15-30 minutes depending on your hardware.
          </p>
          <CodeBlock 
            language="bash"
            code={`cargo build --release -p sui-node`}
          />
          <p className="text-sm text-muted-foreground mt-2">
            The compiled binary will be located at <code className="bg-muted px-1 rounded">target/release/sui-node</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
