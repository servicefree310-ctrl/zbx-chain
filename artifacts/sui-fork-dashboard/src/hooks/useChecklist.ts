import { useState, useEffect } from "react";

export type ChecklistItem = {
  id: string;
  category: string;
  text: string;
  completed: boolean;
};

const defaultItems: ChecklistItem[] = [
  // Pre-launch
  { id: "env-rust", category: "Pre-launch", text: "Install Rust toolchain (v1.75+)", completed: false },
  { id: "env-deps", category: "Pre-launch", text: "Install system dependencies (clang, cmake, libssl-dev)", completed: false },
  { id: "env-clone", category: "Pre-launch", text: "Fork Sui repository and rename to zebvix", completed: false },
  { id: "env-cargo", category: "Pre-launch", text: "Update Cargo.toml — rename sui-node → zebvix-node", completed: false },
  { id: "env-symbol", category: "Pre-launch", text: "Rename token symbol SUI → ZBX in gas_coin.rs", completed: false },
  { id: "env-config", category: "Pre-launch", text: "Update config dir .sui → .zebvix in sui-config/src/lib.rs", completed: false },
  { id: "env-build", category: "Pre-launch", text: "Build zebvix-node binary successfully", completed: false },

  // Genesis
  { id: "gen-chainid", category: "Genesis", text: "Set chain_id: zebvix-mainnet-1 in genesis.yaml", completed: false },
  { id: "gen-supply", category: "Genesis", text: "Configure ZBX max supply and token distribution", completed: false },
  { id: "gen-keys", category: "Genesis", text: "Generate validator keypairs on air-gapped machine", completed: false },
  { id: "gen-blob", category: "Genesis", text: "Build genesis.blob from genesis.yaml", completed: false },
  { id: "gen-distribute", category: "Genesis", text: "Distribute genesis.blob to all founding validators", completed: false },

  // Network
  { id: "net-servers", category: "Network", text: "Provision production servers (32+ cores, 128GB RAM, 4TB NVMe)", completed: false },
  { id: "net-4val", category: "Network", text: "Deploy minimum 4 geographically distributed validators", completed: false },
  { id: "net-seed", category: "Network", text: "Configure seed nodes in all fullnode.yaml files", completed: false },
  { id: "net-fw", category: "Network", text: "Open firewall ports (8080 P2P, 9000 RPC, 9184 Metrics)", completed: false },
  { id: "net-rpc", category: "Network", text: "Verify public RPC endpoint responds", completed: false },
  { id: "net-systemd", category: "Network", text: "Configure zebvix-node as systemd service (auto-restart)", completed: false },

  // Security
  { id: "sec-keys", category: "Security", text: "Store validator keys in HSM or encrypted vault", completed: false },
  { id: "sec-backup", category: "Security", text: "Backup all keypairs offline (cold storage)", completed: false },
  { id: "sec-vpn", category: "Security", text: "Validator P2P behind VPN / private subnet", completed: false },
  { id: "sec-ddos", category: "Security", text: "DDoS protection on public full-nodes", completed: false },
  { id: "sec-ratelimit", category: "Security", text: "Rate limiting on JSON-RPC endpoint", completed: false },

  // Testing
  { id: "test-testnet", category: "Testing", text: "Run Zebvix testnet (chain_id: zebvix-testnet-1) successfully", completed: false },
  { id: "test-tx", category: "Testing", text: "Send test ZBX transactions on testnet", completed: false },
  { id: "test-epoch", category: "Testing", text: "Complete at least 3 epoch transitions on testnet", completed: false },
  { id: "test-exp", category: "Testing", text: "Connect block explorer to testnet RPC", completed: false },
  { id: "test-failover", category: "Testing", text: "Test validator failover (take one validator offline, verify consensus continues)", completed: false },

  // Mainnet Launch
  { id: "main-mon", category: "Mainnet Launch", text: "Setup Prometheus + Grafana monitoring dashboards", completed: false },
  { id: "main-alerts", category: "Mainnet Launch", text: "Configure alerts for consensus lag and missed votes", completed: false },
  { id: "main-oncall", category: "Mainnet Launch", text: "On-call rotation assigned for critical alerts", completed: false },
  { id: "main-explorer", category: "Mainnet Launch", text: "Block explorer deployed and connected to mainnet RPC", completed: false },
  { id: "main-announce", category: "Mainnet Launch", text: "Public announcement with RPC endpoint and chain ID", completed: false },
];

export function useChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    try {
      const stored = localStorage.getItem("zebvix-fork-checklist");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge stored completed states with latest default items
        const completedMap: Record<string, boolean> = {};
        parsed.forEach((i: ChecklistItem) => { completedMap[i.id] = i.completed; });
        return defaultItems.map(item => ({
          ...item,
          completed: completedMap[item.id] ?? false,
        }));
      }
    } catch (e) {
      // ignore
    }
    return defaultItems;
  });

  useEffect(() => {
    try {
      localStorage.setItem("zebvix-fork-checklist", JSON.stringify(items));
    } catch (e) {
      // ignore
    }
  }, [items]);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const progress = items.length === 0 ? 0 : Math.round((items.filter(i => i.completed).length / items.length) * 100);

  return { items, toggleItem, progress };
}
