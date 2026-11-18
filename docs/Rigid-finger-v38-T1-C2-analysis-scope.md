# v38-T1-C2 analysis-scope correction

The earlier 21-part motion/assembly analysis set was mistakenly described as all final bodies. The saved native scene contains **31 objects whose evaluated mesh has `visible === true`**, counted at frame0. The tracked set contains21 of them, including both DIP bushes;10 MCP-related visible parts were omitted.

This is a scope/reporting error in the analysis, not a Frame geometry change. A fresh expanded native-mesh audit is pending. No new collision, and no absence of collisions involving the omitted parts, is asserted by this correction.

## Parts outside the earlier tracked set

- Captured palm rivet 6.5 2 (`88eb14edc8466a3cee6c417e1e5050c3`).
- Captured palm rivet -6.5 2 (`19fc94e9ccbbfc06716e44dcb38c0489`).
- Flex captured crosspin requires swaging 2 (`2c276f9299161c5f53a3e45bf7d15018`).
- Yaw captured crosspin requires swaging 2 (`b943a6386cd13ab0f3cf8a1d71234a4b`).
- Flex right plain liner; custom nominal (`7176b5cc2ca23ac94b09e09c84f51c6b`).
- Flex left plain liner; custom nominal (`ee58f8cdee2db3a609d27e152018b9ee`).
- Flex right spacing washer (`ae9ec0271311739b694d3716aa26480b`).
- Flex left spacing washer (`a910c3d5e23959fa669728017f9b6f14`).
- Flex retained washer (`80317f6553bbba495039cf494f2200d7`).
- Fixed yaw upper collar; captured by crosspin (`e7b86e3189cdff85ed10c03330ea9bdc`).

These are native geometry identifiers, not private account, Library or access identifiers.

## What remains valid

The previously reported12648 v37 motion/assembly pair-poses,1620 changed-A pair-poses and690 denser changed-A pair-poses retain their measured results **only for their explicitly listed pairs and poses**, including the stated contact exclusions, cache equivalence and timeout followups. The21 tracked parts are not an exhaustive all-part or all-pair set. Reuse of unchanged geometry does not fill the missing ten-part coverage.

The published native scene and exact checkpoint/embedded documentation are deliberately unchanged, preserving byte identity. The200-geometry native roundtrip and final archive recovery verified saved geometry/document identity, not exhaustive pairwise collision coverage; those identity checks are unaffected. The five-pose documentation-only checks likewise remain bounded identity evidence.

The exact embedded document remains the historical checkpoint text. This separately linked erratum takes precedence wherever that text or prior reports imply complete assembly coverage from the21-part set. The verification receipt now labels it `trackedAnalysisParts` and records31 visible mesh parts. There is no manufacturing, strength, continuous-motion or clean-solid approval.

## Next verification

Extract and guard the omitted MCP meshes, calibrate their actual transforms, and explicitly report the fresh pairs/poses, intended contacts, witnesses and unresolved cases. Do not classify omitted-part contacts by assumption. This audit is pending; successful native export/topology counters cannot substitute for it.
