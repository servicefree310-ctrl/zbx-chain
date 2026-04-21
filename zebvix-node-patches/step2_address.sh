#!/usr/bin/env bash
# Step 2: EVM-compatible 20-byte address
# Modifies: crates/sui-types/src/base_types.rs
# Uses Node.js for file edits (python3 NOT available on VPS)

set -euo pipefail

BASE_TYPES="crates/sui-types/src/base_types.rs"
[ -f "$BASE_TYPES" ] || { echo "  SKIP: $BASE_TYPES not found"; exit 0; }

echo "  [2.1] SUI_ADDRESS_LENGTH: 32 → 20"
sed -i 's/pub const SUI_ADDRESS_LENGTH: usize = 32;/pub const SUI_ADDRESS_LENGTH: usize = 20; \/\/ ZBX: EVM-compatible 20-byte address/' "$BASE_TYPES"

echo "  [2.2] SuiPublicKey::try_from — last 20 bytes of Blake2b256"
node << 'JSEOF'
const fs = require('fs');
const file = "crates/sui-types/src/base_types.rs";
let content = fs.readFileSync(file, 'utf8');

// Patch 1: Array literal buffer size
content = content.replace(
    "let mut result = [0u8; SUI_ADDRESS_LENGTH];",
    "let mut result = [0u8; SUI_ADDRESS_LENGTH]; // 20 bytes"
);

// Patch 2: Blake2b256 hash (32 bytes) → address (20 bytes): take last 20
// Pattern: SuiAddress(&hash[..SUI_ADDRESS_LENGTH]) → SuiAddress(&hash[12..])
content = content.replace(
    /SuiAddress\((&hash(?:\.as_ref\(\))?)\[\.\.SUI_ADDRESS_LENGTH\]\)/g,
    'SuiAddress($1[12..])  // ZBX: last 20 bytes of 32-byte hash'
);

// Patch 3: Numeric slice fallbacks
content = content.replace(
    /SuiAddress\((&hash)\[(\d+)\.\.(\d+)\]\)/g,
    'SuiAddress($1[12..])  // ZBX: last 20 bytes'
);

fs.writeFileSync(file, content);
console.log('  Address slice patch applied to base_types.rs ✓');
JSEOF

echo "  [2.3] AccountAddress ↔ SuiAddress conversions"
node << 'JSEOF'
const fs = require('fs');
const file = "crates/sui-types/src/base_types.rs";
let content = fs.readFileSync(file, 'utf8');

// SuiAddress → AccountAddress: pad 20 → 32 bytes
content = content.replace(
    /AccountAddress::new\(self\.0\)/g,
    'AccountAddress::new({ let mut b = [0u8; 32]; b[12..].copy_from_slice(&self.0); b })'
);

fs.writeFileSync(file, content);
console.log('  AccountAddress padding patch applied ✓');
JSEOF

echo "  [2.4] sui_sdk_types_conversions.rs — address fix"
SDK_CONV="crates/sui-sdk-types/src/types/address.rs"
if [ ! -f "$SDK_CONV" ]; then
    SDK_CONV=$(find . -name "*.rs" -not -path "*/target/*" | xargs grep -rl 'SuiAddress.*AccountAddress' 2>/dev/null | head -1)
fi
if [ -n "$SDK_CONV" ] && [ -f "$SDK_CONV" ]; then
    sed -i 's/\.as_ref()\[\.\.32\]/\.as_ref()[12..]/g' "$SDK_CONV" 2>/dev/null || true
fi

echo "  Step 2 done."
