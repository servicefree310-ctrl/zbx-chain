import { useState, useEffect } from "react";

export type ChecklistItem = {
  id: string;
  category: string;
  text: string;
  completed: boolean;
};

const defaultItems: ChecklistItem[] = [
  { id: "env-rust", category: "Pre-launch", text: "Install Rust toolchain (v1.75+)", completed: false },
  { id: "env-deps", category: "Pre-launch", text: "Install system dependencies", completed: false },
  { id: "env-clone", category: "Pre-launch", text: "Clone Sui repository and build", completed: false },
  { id: "gen-blob", category: "Pre-launch", text: "Configure genesis.blob", completed: false },
  { id: "gen-keys", category: "Pre-launch", text: "Generate validator keypairs", completed: false },
  
  { id: "net-seed", category: "Network", text: "Configure seed nodes in fullnode.yaml", completed: false },
  { id: "net-fw", category: "Network", text: "Open firewall ports (8080, 9000, 9184)", completed: false },
  { id: "net-rpc", category: "Network", text: "Verify RPC accessibility", completed: false },
  
  { id: "test-local", category: "Testing", text: "Run local testnet cluster", completed: false },
  { id: "test-tx", category: "Testing", text: "Send test transactions", completed: false },
  { id: "test-exp", category: "Testing", text: "Connect local explorer", completed: false },
  
  { id: "main-multi", category: "Mainnet", text: "Deploy multi-validator setup", completed: false },
  { id: "main-mon", category: "Mainnet", text: "Setup Prometheus/Grafana monitoring", completed: false },
  { id: "main-bkp", category: "Mainnet", text: "Secure backup keys offline", completed: false },
];

export function useChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    try {
      const stored = localStorage.getItem("sui-fork-checklist");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load checklist from local storage", e);
    }
    return defaultItems;
  });

  useEffect(() => {
    try {
      localStorage.setItem("sui-fork-checklist", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save checklist to local storage", e);
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
