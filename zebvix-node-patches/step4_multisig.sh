#!/usr/bin/env bash
# Step 4: MultiSig rules — thresholds + constants
# Uses Node.js for file edits (python3 NOT available on VPS)

set -euo pipefail

echo "  [4.1] MAX_SIGNER_IN_MULTISIG stays 10 (already default in Sui)"
MULTISIG_RS=$(find . -name "multisig.rs" -not -path "*/target/*" | head -1)

if [ -z "$MULTISIG_RS" ]; then
    echo "  SKIP: multisig.rs not found"
    exit 0
fi

echo "  Found: $MULTISIG_RS"

node << JSEOF
const fs = require('fs');
const file = "${MULTISIG_RS}";
let content = fs.readFileSync(file, 'utf8');

const MULTISIG_CONSTS = \`
// ================================================================
// ZEBVIX MULTISIG THRESHOLD RULES
// ================================================================
/// Maximum signers in any multisig wallet
pub const MAX_MULTISIG_SIGNERS: usize = 10;

/// Treasury multisig: 3 out of 5 signers required (60%)
pub const TREASURY_MULTISIG_M: u16 = 3;
pub const TREASURY_MULTISIG_N: u16 = 5;

/// Chain feature upgrade: 4 out of 6 required (67% supermajority)
pub const CHAIN_UPGRADE_M: u16 = 4;
pub const CHAIN_UPGRADE_N: u16 = 6;

/// Validator key rotation: 3 out of 5 required
pub const VALIDATOR_KEY_ROTATION_M: u16 = 3;
pub const VALIDATOR_KEY_ROTATION_N: u16 = 5;

/// Validate multisig threshold (weights must reach threshold)
pub fn validate_zbx_threshold(weights_sum: u16, threshold: u16) -> bool {
    threshold > 0 && threshold <= weights_sum
}
\`;

if (!content.includes('TREASURY_MULTISIG_M')) {
    const insertPos = content.indexOf('pub const MAX_SIGNER_IN_MULTISIG');
    if (insertPos >= 0) {
        const endOfLine = content.indexOf('\n', insertPos) + 1;
        content = content.slice(0, endOfLine) + MULTISIG_CONSTS + content.slice(endOfLine);
    } else {
        content += MULTISIG_CONSTS;
    }
    fs.writeFileSync(file, content);
    console.log('  MultiSig constants added ✓');
} else {
    console.log('  MultiSig already patched, skipping.');
}
JSEOF

echo "  Step 4 done."
