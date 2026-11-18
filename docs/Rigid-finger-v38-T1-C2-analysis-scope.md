# v38-T1-C2 analysis-scope correction

## Confirmed assembly obstruction (2026-11-18)

**The saved v38 is not ready for assembly:** its palm yaw-stop post intersects the separate MCP spindle flange. Independently checked original native frame0 triangles (palm face41, spindle face943) cross transversely. The post spans approximately Z9.2..18.5 mm and the flange Z16..18 mm. Their common intersection-line interval is approximately0.0757493 mm; the earlier SAT axis gap is -0.02207757 mm. Neither number is a penetration-depth measurement. These are distinct assembly bodies; being fixed relative to one another does not make the overlap permissible.

This pair belongs to the original tracked21 set, not the255 additional MCP pairs. The additional20655 pair-pose results and270 named assembly-path records retain their stated scope; they did not test assembly of the MCP parts themselves. Earlier12648/1620/690 counts remain historical results for their enumerated pairs, not an exhaustive validation of the21-part set or the whole assembly. No claim that all earlier checks are false is made. This newly confirmed obstruction supersedes any interpretation of those counts as whole-assembly clearance.

The published HASH, exact embedded Doc,200-geometry roundtrip and recovery byte-identity evidence are unchanged. This is a documented geometric defect, not a repair or a Frame-core diagnosis. A revised design and fresh checks are required.


## Completed bounded supplement

A fresh native extraction guards all31 visible mesh identities and transforms. The incremental grid covers every one of255 pairs touching at least one of the ten formerly untracked parts, at81 finite poses: MCP{0,45,90}, PIP{0,55,110}, DIP{0,40,80}, splay{−20,0,20}. Exact requested tuple coverage is20655, with no duplicates and3431 unique relative-configuration scans. This is NOT a fresh465-pair all-assembly test and does not rerun every prior21-part pair.

Raw results:18468 AABB-separated,1053 without detected surface intersections,162 near-contact and972 timeout-derived pair-pose records representing12 cached configurations. Fresh same-mesh followups completed all12: nine named-plane cases retaining possible intended contacts, plus three cylindrical-fit cases with no masks. Resolved totals are **19521 clear/AABB-separated +1134 nominal-seat/near-contact**. Raw timeouts remain retained, not relabelled as if their initial scans completed. Relative-pose reuse is guarded, not20655 independent triangle scans.

The cylindrical cases include nanometre-scale transverse triangle crossings at nominal coincident fits, maximum reported SAT axis-gap magnitude1.1747625947577944e−6mm. A signed SAT axis gap is not penetration depth. These are not exact non-overlapping surfaces, achieved manufacturing fits, validated contact areas or load ratings.

### Additional assembly-path coverage

Using the freshly extracted meshes, the previously specified PIP radial downstream insertion, PIP axle insertion, D7 distal-unit/keyed-cheek insertion, preliminaryDIPaxle, partial-axle rotation and service-cover/screw withdrawal were checked against the ten additional MCP targets.220 translation pair-path records are separated by whole-translation swept AABBs;50 distal-unit rotation records are separated by conservative full360-degree cylindrical bounds enclosing the requested0..40degree rotation. Minimum separating-coordinate gap is7mm, not a nearest-surface distance. No triangle masks or thread exclusions were needed against these additional targets.

The270 records include10 identical cheek-path geometries repeated in two assembly-sequence contexts. They are not270 distinct geometric paths or new manufacturing proofs. The rotation bound uses actual native axis/pivot and checked transforms; it is a numerical frozen-mesh bound, not a formal exact-spline/interval certificate. Existing checks against the original21parts remain separate evidence.

### Remaining limits

Assembly/forming and retention of the MCP rivets/crosspins themselves remain unqualified. So do actual threads, fixtures/tools, locking, wear, loads, manufacturing tolerances, global finished-wall thickness and continuous-motion collision freedom. Surface-intersection tests can miss entirely contained-volume overlap. Known A/B micro-overlaps and sharp transitions are not repaired by this coverage supplement. No geometry or checkpoint bytes changed.

## Original correction, retained for history

The earlier 21-part motion/assembly analysis set was mistakenly described as all final bodies. The saved native scene contains **31 objects whose evaluated mesh has `visible === true`**, counted at frame0. The tracked set contains21 of them, including both DIP bushes;10 MCP-related visible parts were omitted.

This is a scope/reporting error in the analysis, not a Frame geometry change. At the time of this correction a fresh expanded audit was pending; its bounded completion is now recorded above. No new collision, and no absence of collisions involving the omitted parts, is asserted by this correction.

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

Extract and guard the omitted MCP meshes, calibrate their actual transforms, and explicitly report the fresh pairs/poses, intended contacts, witnesses and unresolved cases. Do not classify omitted-part contacts by assumption. The bounded supplement above completes this additional scope; successful native export/topology counters alone could not substitute for it.

