#!/usr/bin/env bash
# Step 3: Tokenomics constants + burn cap in gas_coin.rs
# Uses Node.js for file edits (python3 NOT available on VPS)

set -euo pipefail

GAS_COIN="crates/sui-types/src/gas_coin.rs"
[ -f "$GAS_COIN" ] || { echo "  SKIP: $GAS_COIN not found"; exit 0; }

echo "  [3.1] Injecting ZBX tokenomics constants into gas_coin.rs"

# Check if already patched
if grep -q "MAX_TOTAL_SUPPLY_ZBX" "$GAS_COIN"; then
    echo "  Already patched, skipping."
    exit 0
fi

# Use Node.js to insert constants (python3 not available on VPS)
node << 'JSEOF'
const fs = require('fs');
const file = "crates/sui-types/src/gas_coin.rs";
let content = fs.readFileSync(file, 'utf8');

const ZEBVIX_CONSTANTS = `
// ================================================================
// ZEBVIX TOKENOMICS CONSTANTS
// ================================================================

/// ZBX base unit
pub const MIST_PER_ZBX: u64 = 1_000_000_000;

/// Maximum total supply: 150 million ZBX (hard cap — never exceeded)
pub const MAX_TOTAL_SUPPLY_ZBX: u64 = 150_000_000;
pub const MAX_TOTAL_SUPPLY_MIST: u64 = MAX_TOTAL_SUPPLY_ZBX * MIST_PER_ZBX;

/// Genesis supply: 2 million ZBX minted at chain start
pub const GENESIS_SUPPLY_ZBX: u64 = 2_000_000;
pub const GENESIS_SUPPLY_MIST: u64 = GENESIS_SUPPLY_ZBX * MIST_PER_ZBX;

/// Halving thresholds (by total minted ZBX)
pub const FIRST_HALVING_ZBX: u64  =  50_000_000;
pub const SECOND_HALVING_ZBX: u64 = 100_000_000;

/// Block rewards
pub const INITIAL_BLOCK_REWARD_MIST: u64 = 100_000_000; // 0.1 ZBX per block

/// Gas fee distribution (basis points, must sum to 10000)
pub const GAS_NODE_BPS:       u64 = 2200; // 22% → node runners (jo node chalate hain)
pub const GAS_VALIDATOR_BPS:  u64 = 3000; // 30% → validators (staking reward)
pub const GAS_DELEGATOR_BPS:  u64 = 2000; // 20% → delegators
pub const GAS_TREASURY_BPS:   u64 = 1800; // 18% → founder treasury
pub const GAS_BURN_BPS:       u64 = 1000; // 10% → burn (until cap)
// Sanity: 2200 + 3000 + 2000 + 1800 + 1000 = 10000 ✓

/// Burn cap: 50% of max supply = 75 million ZBX
pub const MAX_BURN_SUPPLY_ZBX:  u64 = 75_000_000;
pub const MAX_BURN_SUPPLY_MIST: u64 = MAX_BURN_SUPPLY_ZBX * MIST_PER_ZBX;

/// Validator system
pub const MAX_VALIDATORS:             u64 = 41;
pub const MIN_VALIDATOR_STAKE_ZBX:    u64 = 10_000;
pub const MIN_VALIDATOR_STAKE_MIST:   u64 = MIN_VALIDATOR_STAKE_ZBX * MIST_PER_ZBX;
pub const MAX_VALIDATOR_STAKE_ZBX:    u64 = 250_000;  // validator's OWN stake cap
pub const NODE_BOND_ZBX:              u64 = 100;       // mandatory node collateral
pub const NODE_BOND_MIST:             u64 = NODE_BOND_ZBX * MIST_PER_ZBX; // 100 ZBX — locked for node eligibility
pub const MAX_VALIDATOR_STAKE_MIST:   u64 = MAX_VALIDATOR_STAKE_ZBX * MIST_PER_ZBX;
pub const GLOBAL_STAKE_CAP_ZBX:       u64 = 5_000_000; // ALL validators + ALL delegators combined
pub const GLOBAL_STAKE_CAP_MIST:      u64 = GLOBAL_STAKE_CAP_ZBX * MIST_PER_ZBX;
pub const VALIDATOR_STAKING_APR:      u64 = 120;       // % APR on self-stake
pub const DELEGATOR_APR:              u64 = 80;        // % APR for delegators
pub const VALIDATOR_DELEGATION_BONUS_APR: u64 = 40;   // % bonus on delegated amount
pub const NODE_DAILY_REWARD_MIST:     u64 = 5 * MIST_PER_ZBX; // 5 ZBX/day per node

/// Chain info
pub const CHAIN_ID: &str     = "zebvix-mainnet-1";
pub const TOKEN_SYMBOL: &str = "ZBX";
pub const TOKEN_DECIMALS: u8 = 9;

// ================================================================
// ZEBVIX HELPER FUNCTIONS
// ================================================================

/// Returns true if burning is still allowed (below burn cap)
pub fn is_burn_allowed(total_burned_mist: u64) -> bool {
    total_burned_mist < MAX_BURN_SUPPLY_MIST
}

/// Returns halving divisor based on total minted
/// Phase 1 (0–50M):    divisor=1 → full reward
/// Phase 2 (50M–100M): divisor=2 → half reward
/// Phase 3 (100M+):    divisor=4 → quarter reward
pub fn get_halving_multiplier(total_minted_zbx: u64) -> u64 {
    if total_minted_zbx < FIRST_HALVING_ZBX {
        1
    } else if total_minted_zbx < SECOND_HALVING_ZBX {
        2
    } else {
        4
    }
}

/// Adjusted block reward based on total minted supply
pub fn adjusted_block_reward(total_minted_zbx: u64) -> u64 {
    INITIAL_BLOCK_REWARD_MIST / get_halving_multiplier(total_minted_zbx)
}

/// Gas fee split for a given fee amount
/// Returns (node_share, validator_share, delegator_share, treasury_share, burn_share)
pub fn split_gas_fee(fee_mist: u64, total_burned_mist: u64) -> (u64, u64, u64, u64, u64) {
    let node_share      = fee_mist * GAS_NODE_BPS      / 10_000;
    let validator_share = fee_mist * GAS_VALIDATOR_BPS / 10_000;
    let delegator_share = fee_mist * GAS_DELEGATOR_BPS / 10_000;
    let treasury_share  = fee_mist * GAS_TREASURY_BPS  / 10_000;
    let burn_raw        = fee_mist * GAS_BURN_BPS       / 10_000;

    // If burn cap reached, redirect burn share to validators
    let (burn_share, validator_final) = if is_burn_allowed(total_burned_mist) {
        (burn_raw, validator_share)
    } else {
        (0, validator_share + burn_raw) // burn cap hit → burn share added to validators
    };

    (node_share, validator_final, delegator_share, treasury_share, burn_share)
}

/// Check if validator slot limit is reached
pub fn is_validator_cap_reached(active_validators: u64) -> bool {
    active_validators >= MAX_VALIDATORS
}

/// Check if a validator's own stake is at the maximum
/// Note: uses MAX_VALIDATOR_STAKE_MIST (validator's OWN stake cap, not delegated)
pub fn is_validator_stake_maxed(validator_own_stake_mist: u64) -> bool {
    validator_own_stake_mist >= MAX_VALIDATOR_STAKE_MIST
}
`;

// Remove old SUI constants if present
content = content.replace(/pub const MIST_PER_SUI.*?;\n/g, '');
content = content.replace(/pub const TOTAL_SUPPLY_SUI.*?;\n/g, '');

// Insert after first `use serde::{Deserialize, Serialize};` line
const insertAfter = 'use serde::{Deserialize, Serialize};';
if (content.includes(insertAfter)) {
    content = content.replace(insertAfter, insertAfter + '\n' + ZEBVIX_CONSTANTS);
} else {
    // Fallback: prepend to file
    content = ZEBVIX_CONSTANTS + '\n' + content;
}

fs.writeFileSync(file, content);
console.log('  ZBX constants written to gas_coin.rs ✓');
JSEOF

echo "  Step 3 done."
