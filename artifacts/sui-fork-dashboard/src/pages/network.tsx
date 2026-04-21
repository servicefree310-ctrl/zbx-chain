import React from "react";
import { CodeBlock } from "@/components/ui/code-block";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Network() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
          Network Configuration
        </h1>
        <p className="text-lg text-muted-foreground">
          Topology, port requirements, and full-node setup for Zebvix external access.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-border p-5 rounded-lg bg-card">
          <h3 className="font-semibold text-lg text-primary mb-2">Zebvix Validator Node</h3>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
            <li>Participates in Zebvix consensus</li>
            <li>Executes all ZBX transactions</li>
            <li>Requires high hardware specs</li>
            <li>Should <strong className="text-foreground">not</strong> expose RPC publicly</li>
          </ul>
        </div>
        <div className="border border-border p-5 rounded-lg bg-card">
          <h3 className="font-semibold text-lg text-primary mb-2">Zebvix Full Node</h3>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
            <li>Follows Zebvix network state</li>
            <li>Serves read requests (RPC/Websocket)</li>
            <li>Lower hardware requirements</li>
            <li>Exposed to the public internet</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">Firewall Rules</h2>
        <div className="border border-border rounded-md overflow-hidden bg-card/50">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead className="text-foreground">Port</TableHead>
                <TableHead className="text-foreground">Protocol</TableHead>
                <TableHead className="text-foreground">Service</TableHead>
                <TableHead className="text-foreground">Exposure</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-b border-border hover:bg-muted/30">
                <TableCell className="font-mono">8080</TableCell>
                <TableCell>TCP / UDP</TableCell>
                <TableCell>Zebvix P2P Networking</TableCell>
                <TableCell className="text-green-400">Public (All Nodes)</TableCell>
              </TableRow>
              <TableRow className="border-b border-border hover:bg-muted/30">
                <TableCell className="font-mono">9000</TableCell>
                <TableCell>TCP</TableCell>
                <TableCell>Zebvix JSON-RPC</TableCell>
                <TableCell className="text-yellow-400">Public (Full Nodes Only)</TableCell>
              </TableRow>
              <TableRow className="border-b border-border hover:bg-muted/30">
                <TableCell className="font-mono">9001</TableCell>
                <TableCell>TCP</TableCell>
                <TableCell>Zebvix WebSocket</TableCell>
                <TableCell className="text-yellow-400">Public (Full Nodes Only)</TableCell>
              </TableRow>
              <TableRow className="hover:bg-muted/30">
                <TableCell className="font-mono">9184</TableCell>
                <TableCell>TCP</TableCell>
                <TableCell>Prometheus Metrics</TableCell>
                <TableCell className="text-red-400">Internal (Monitoring Subnet)</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">Full Node Configuration</h2>
        <p className="text-sm text-muted-foreground">
          A standard configuration for a public-facing Zebvix RPC node (fullnode.yaml).
        </p>
        <CodeBlock 
          language="yaml"
          code={`---
db-path: "/var/zebvix/db"
network-address: "/ip4/0.0.0.0/tcp/8080/http"
json-rpc-address: "0.0.0.0:9000"
websocket-address: "0.0.0.0:9001"
metrics-address: "0.0.0.0:9184"

genesis:
  genesis-file-location: "/var/zebvix/genesis.blob"

p2p-config:
  seed-peers:
    - address: "/ip4/<ZEBVIX_VALIDATOR_IP>/tcp/8080/http"
      peer-id: "<ZEBVIX_VALIDATOR_PEER_ID>"
`}
        />
      </div>
    </div>
  );
}
