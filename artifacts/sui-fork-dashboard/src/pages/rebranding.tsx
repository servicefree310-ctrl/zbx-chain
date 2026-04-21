import React, { useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronRight } from "lucide-react";
import { CodeBlock } from "@/components/ui/code-block";

const CATEGORIES = [
  {
    label: "✅ KARO — Safe to Rebrand",
    description: "Yeh sab user-facing hain — Zebvix brand yahaan zaroori hai",
    color: "text-green-400",
    border: "border-green-500/30",
    bg: "bg-green-500/5",
    icon: <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />,
    items: [
      {
        title: "Binary / Executable name",
        where: "Cargo.toml [[bin]] section",
        status: "✅ Already done",
        from: "sui-node",
        to: "zebvix-node",
        note: "Users is binary ko run karte hain — Zebvix naam zaroor aana chahiye",
        code: `# Cargo.toml mein (already done):
[[bin]]
name = "zebvix-node"   ← YEH
path = "src/main.rs"`,
      },
      {
        title: "Config directory",
        where: "~/.sui/ → ~/.zebvix/",
        status: "✅ Already done",
        from: ".sui",
        to: ".zebvix",
        note: "Jab user apne machine pe node chalayega, config folder Zebvix ka dikhega",
        code: `# Already renamed in code:
SUI_CONFIG_DIR → ZEBVIX_CONFIG_DIR
~/.sui/         → ~/.zebvix/
keystore file   → zebvix.keystore`,
      },
      {
        title: "Token symbol (user-visible)",
        where: "gas_coin.rs constants",
        status: "✅ Already done",
        from: "SUI",
        to: "ZBX",
        note: "Wallet mein, explorer mein — sab jagah ZBX dikhega",
        code: `// gas_coin.rs (already done):
pub const MIST_PER_ZBX: u64 = 1_000_000_000;
pub const TOTAL_SUPPLY_ZBX: u64 = 150_000_000;`,
      },
      {
        title: "Chain ID / Network identifier",
        where: "genesis.yaml → chain_id",
        status: "🔧 Do in Phase 1",
        from: "sui-mainnet",
        to: "zebvix-mainnet-1",
        note: "RPC se jab bhi chain query hogi — yeh name return hoga",
        code: `# genesis.yaml mein:
chain_id: "zebvix-mainnet-1"

# Test:
curl localhost:9000 -d '{"method":"sui_getChainIdentifier"}'
# Returns: "zebvix-mainnet-1" ✅`,
      },
      {
        title: "Node info / version string",
        where: "crates/sui-node/src/main.rs",
        status: "🔧 Optional but good",
        from: "Sui Node v1.69.2",
        to: "Zebvix Node v1.0.0",
        note: "Node start hone pe terminal mein version dikhta hai",
        code: `# main.rs mein find karo:
grep -n "Sui Node\|sui-node" crates/sui-node/src/main.rs

# Replace:
sed -i 's/Sui Node/Zebvix Node/g' crates/sui-node/src/main.rs`,
      },
      {
        title: "Systemd service name",
        where: "/etc/systemd/system/",
        status: "🔧 Do in Phase 4",
        from: "sui-node.service",
        to: "zebvix-node.service",
        note: "Server pe service ka naam — Zebvix ka brand",
        code: `# Service file:
/etc/systemd/system/zebvix-node.service
Description=Zebvix Node — Zebvix Technologies Pvt Ltd`,
      },
      {
        title: "Log file names",
        where: "Wherever logs are written",
        status: "🔧 Already in our setup",
        from: "sui-node.log",
        to: "zebvix-node.log",
        note: "~/zebvix-data/logs/ mein sab Zebvix naam se",
        code: `~/zebvix-data/logs/build.log
~/zebvix-data/logs/zebvix-node.log
~/zebvix-data/logs/consensus.log`,
      },
    ],
  },
  {
    label: "⚠️ SOCH KE KARO — Optional / Careful",
    description: "Technically possible hai lekin consequences hain — carefully decide karo",
    color: "text-yellow-400",
    border: "border-yellow-500/30",
    bg: "bg-yellow-500/5",
    icon: <AlertCircle className="h-5 w-5 text-yellow-400 shrink-0" />,
    items: [
      {
        title: "JSON-RPC method names (sui_* → zebvix_*)",
        where: "crates/sui-json-rpc/",
        status: "⚠️ Break wallet compatibility",
        from: "sui_getBalance, sui_transfer...",
        to: "zebvix_getBalance, zebvix_transfer...",
        note: "Agar rename karoge toh standard Sui wallets (Suiet, Martian) kaam nahi karenge. Custom wallet banani padegi. Recommend: mat karo pehle phase mein.",
        code: `# Agar karna hai future mein:
grep -rl '"sui_' crates/sui-json-rpc/src/ | head -10
# ~50+ methods hain — bada kaam hai
# Custom wallet banane ke baad hi karo`,
      },
      {
        title: "Move module paths (0x2::sui::*)",
        where: "sui-framework packages",
        status: "⚠️ On-chain contracts break",
        from: "use sui::coin::Coin",
        to: "use zebvix::coin::Coin",
        note: "Sare deployed Move contracts break ho jayenge. Recommend: ecosystem ready hone ke baad karna.",
        code: `# crates/sui-framework/packages/ mein:
sui-framework/     ← 0x2
sui-system/        ← 0x3  
move-stdlib/       ← 0x1

# Rename bahut complex hai — baad mein karna`,
      },
      {
        title: "Internal Rust constant names (MIST_PER_SUI etc.)",
        where: "crates/sui-types/src/*.rs",
        status: "⚠️ Already done, careful with grep",
        from: "MIST_PER_SUI, TOTAL_SUPPLY_SUI",
        to: "MIST_PER_ZBX, TOTAL_SUPPLY_ZBX",
        note: "Humne yeh pehle se kar diya — but agar aur files miss rahi hain toh build fail hoga",
        code: `# Check karo koi SUI constants miss toh nahi:
grep -rn "MIST_PER_SUI\|TOTAL_SUPPLY_SUI" crates/ --include="*.rs"
# Koi result nahi aana chahiye ✅`,
      },
    ],
  },
  {
    label: "❌ MAT KARO — Will Break Build/Network",
    description: "Yeh internal implementation details hain — rename karne se build fail ya network broken ho jayega",
    color: "text-red-400",
    border: "border-red-500/30",
    bg: "bg-red-500/5",
    icon: <XCircle className="h-5 w-5 text-red-400 shrink-0" />,
    items: [
      {
        title: "Cargo package names (sui-node, sui-types etc.)",
        where: "Every crate's Cargo.toml [package].name",
        status: "❌ Build completely breaks",
        from: 'name = "sui-types"',
        to: 'name = "zebvix-types" — MAT KARO',
        note: "800+ crates ek doosre ko package name se reference karte hain. Rename karo toh sab dependency links toot jayenge.",
        code: `# YEH MAT KARO:
# crates/sui-types/Cargo.toml
name = "sui-types"  ← ISKO CHHODDO

# Sirf binary name change karo (Cargo.toml [[bin]])
# Package name alag cheez hai`,
      },
      {
        title: "Rust module/crate names in code (use sui_types::*)",
        where: "Thousands of files across codebase",
        status: "❌ Thousands of compile errors",
        from: "use sui_types::base_types::*",
        to: "use zebvix_types::*— MAT KARO",
        note: "50,000+ lines of code mein ye pattern hai. Yeh internal implementation — users nahi dekhte.",
        code: `# Count karo kitni jagah hai:
grep -r "use sui_types\|use sui_core\|use sui_node" crates/ | wc -l
# ~5000+ lines — karna impossible hai cleanly`,
      },
      {
        title: "P2P protocol identifiers / libp2p keys",
        where: "crates/anemo/ or network config",
        status: "❌ Nodes connect nahi kar paayenge",
        from: "sui/1.0.0 protocol",
        to: "zebvix/1.0.0 — network breaks",
        note: "Agar protocol ID change kiya toh 2 nodes ek doosre ko recognize nahi karenge. Multi-node testnet fail ho jayega.",
        code: `# Network protocol — CHHODO:
grep -r "sui/1\." crates/anemo/ --include="*.rs" | head -5
# Isko rename mat karna`,
      },
      {
        title: "RocksDB column family names",
        where: "crates/typed-store/ storage layer",
        status: "❌ Existing database unreadable",
        from: '"sui_object_store"',
        to: '"zebvix_object_store" — MAT KARO',
        note: "Database ek baar bana aur agar column names change kiye toh purana data read nahi hoga. Fresh start bhi permanent damage.",
        code: `# Database schema — CHHODO:
grep -r "column_family\|cf_name" crates/typed-store/ | head -5`,
      },
    ],
  },
];

function CategorySection({ cat }: { cat: typeof CATEGORIES[0] }) {
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className={`rounded-lg border ${cat.border} ${cat.bg}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex-1">
          <div className={`font-bold text-base ${cat.color}`}>{cat.label}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{cat.description}</div>
        </div>
        {open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-2">
          {cat.items.map((item, i) => (
            <div key={i} className="bg-background/60 rounded-lg border border-border/50 overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-muted/20 transition-colors"
              >
                {cat.icon}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">{item.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-mono">{item.status}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 font-mono truncate">{item.where}</div>
                  <div className="flex items-center gap-2 mt-1 text-xs flex-wrap">
                    <span className="line-through text-muted-foreground font-mono">{item.from}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className={`font-mono font-semibold ${cat.color}`}>{item.to}</span>
                  </div>
                </div>
                {expanded === i ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />}
              </button>
              {expanded === i && (
                <div className="px-4 pb-4 space-y-3 border-t border-border/30 pt-3">
                  <p className="text-xs text-muted-foreground">{item.note}</p>
                  <CodeBlock language="bash" code={item.code} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Rebranding() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Rebranding Guide</h1>
        <p className="text-lg text-muted-foreground">
          Kahan Zebvix brand lagao, kahan nahi — clear breakdown with exact files aur commands.
        </p>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4 text-center">
          <div className="text-2xl font-bold text-green-400">7</div>
          <div className="text-xs text-muted-foreground mt-1">Safe to Rebrand</div>
          <div className="text-xs text-green-400 mt-1">✅ User-facing</div>
        </div>
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">3</div>
          <div className="text-xs text-muted-foreground mt-1">Optional / Careful</div>
          <div className="text-xs text-yellow-400 mt-1">⚠️ Consequences hain</div>
        </div>
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-center">
          <div className="text-2xl font-bold text-red-400">4</div>
          <div className="text-xs text-muted-foreground mt-1">Do Not Rename</div>
          <div className="text-xs text-red-400 mt-1">❌ Internal only</div>
        </div>
      </div>

      {/* Golden rule */}
      <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
        <div className="font-semibold text-primary text-sm mb-1">The Golden Rule</div>
        <div className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">User jo dekhta hai → Zebvix brand lagao.</strong>{" "}
          <strong className="text-foreground">Compiler/runtime jo use karta hai → mat chhuo.</strong>{" "}
          Binary name, token symbol, chain ID, config folder — yeh sab Zebvix hoga. 
          Cargo package names, Rust modules, database schema — yeh internal hain, users nahi dekhte.
        </div>
      </div>

      <div className="space-y-4">
        {CATEGORIES.map((cat, i) => (
          <CategorySection key={i} cat={cat} />
        ))}
      </div>

      {/* Quick status */}
      <div className="p-4 rounded-lg border border-border bg-muted/10">
        <div className="font-semibold text-foreground text-sm mb-3">Abhi tak kya kiya ja chuka hai</div>
        <div className="space-y-2 text-xs">
          {[
            { done: true, text: "Binary: zebvix-node (Cargo.toml [[bin]] section)" },
            { done: true, text: "Config dir: .sui → .zebvix" },
            { done: true, text: "Token: SUI → ZBX (MIST_PER_ZBX, TOTAL_SUPPLY_ZBX)" },
            { done: false, text: "Chain ID: genesis.yaml mein zebvix-mainnet-1 (Phase 1 mein)" },
            { done: false, text: "Node version string: main.rs mein Zebvix Node" },
            { done: false, text: "Systemd service: zebvix-node.service (Phase 4 mein)" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              {item.done
                ? <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0" />
                : <AlertCircle className="h-3.5 w-3.5 text-yellow-400 shrink-0" />
              }
              <span className={item.done ? "text-foreground" : "text-muted-foreground"}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
