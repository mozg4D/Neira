# Rigid finger v38-T1-C2 — bounded engineering checkpoint

This is an editable rigid-finger study, not a finished hand or a production-qualified mechanism. The public scene is `scenes/rigid-finger-v38-T1-C2.hash`. This document is reproduced exactly in that scene's embedded Doc. It is a separate checkpoint: the canonical `neira.hash`, canonical design/tool-interface documentation and model source are not replaced. Previous checkpoints remain preserved.

## Geometry and purpose

The finger uses rigid phalange bodies, a two-axis MCP base, articulated PIP/DIP joints and a mounted functional nail. Native editable spline cages and supported generators remain the source; inspection meshes are evidence, not replacement authored geometry. Dimensions below are nominal millimetres in the PIP-local frame, with X along the axle.

T1 increases the PIP axial envelope to14.3. Right cheek X3.2..7.2; right custom thrust washer X2.6..3.2, thickness0.6, ID4.05/OD6. Left washer remains thickness0.5. Hub end faces remain X±2.5, giving nominal axial endplay0.2 between seated washer inner faces X±2.6. The custom shoulder shaft ends atX3.2; the M2 major-thread envelope extendsX3.2..7.0. Fixed stop X2.72..3.6 and moving lip outerX2.97 retain nominal axial overlap0.25. The right pilot X2.7..3.3 projects0.5 ahead of the cheek, whereas the left projection remains0.4. Nominal bearing/shaft dimensions are not supplier-fit or manufactured-clearance guarantees.

C2 adds one16-control rigid dorsal hood to fixed A. Its nominal radial limits are4.9..5.5, not a qualified0.6-mm manufacturing wall. The hood modestly covers the dorsal PIP gap; the side cheeks and palmar opening remain exposed. DIP/MCP remain uncovered. Angular ends, potential pinch regions and a visibly mechanical silhouette remain design work, not a completed humanlike finger.

## Verification identity and documentation-only copy

The original v38 checkpoint was built and independently reopened on unchanged native Frame commit `2375c4ae3d66ecd6b7154419767d85f7af8d4d10`. Its source HASH SHA256 is `f3e373be15fb92278db16f680e7be5c8cd0d27070705f8ece05ad8811e8aa418`. The delivered documentation-only copy changes Doc text, not modeled geometry. Its separate receipt verifies all200 source geometry hashes, world matrices at native frames0/45/90/120/150, export/reopen and exact UTF-8 document text. The final HASH identity belongs in that receipt, not recursively inside its own Doc.

Archive recovery is documented separately with the tested archive identity; it is not inferred from byte checks alone.

## Completed bounded geometric evidence

The v37-T1 baseline was independently guarded by IDs, geometry hashes and native matrices. Its12,648 listed finite motion/assembly pair-poses include cache reuse for identical relative configurations, not12,648 independent triangle scans. This covers the declared81-pose main grid, a denser PIP/DIP grid, PIP/D7 insertion, shoulder/head axle insertion and service-cover/screw removal. Dense coverage was completed by a separately recorded continuation; the original240-second partial run remains preserved. Raw seated timeouts were resolved only by explicit same-mesh, matching-relative-pose follow-ups, not silently called clear.

v38 changes only final A. The other20 final-body geometry hashes match v37, with guarded relative transforms over81 reconstructed poses. Fresh changed-A checks comprise1,620 pair-poses against all20 other bodies and690 additional downstream checks with PIP every5 degrees but DIP only0/40/80. These are sampled grids, not continuous motion or a fully dense multidimensional grid.

Fresh changed-A assembly/access evidence includes70 sampled downstream PIP insertion checks plus8 swept-AABB-separated paths;6 swept-AABB-separated D7 insertion pairs;31 shoulder/head axle positions; and30 service-removal samples. Remaining named seat contacts were explicitly resolved. No unexplained robust crossing witness remains within the declared scope. Previous v37 results are baseline evidence reused only through geometry/pose identity, not counted as newly rerun v38 tests.

Standalone T1+C2 representative coupled-play, shifted-washer and end-stop checks are separate evidence. They do not qualify every loose whole-chain configuration. Nominal commanded PIP0..110 degrees is not a guaranteed range under all play: first contact shifts with tilt, and some extreme configurations contact before a nominal endpoint.

## Thread exclusions and assembly limits

An initial v38 all-body check found the known service-screw major-thread envelope inside its intended minor bore. That raw witness remains recorded on an exactly unchanged A face. The revised scope excludes only those intended shaft faces below screw-localZ4.8 and retains screw-head checks. PIP axle checks omit only the intended major-thread region beyondX3.2. For DIP seat follow-ups, cheek/axle excludes the intended thread region beyondX2.9; middle/axle uses full meshes. These are explicit interface exclusions, not repaired collisions or a blanket clearance claim.

No real thread helix, screw-in sequence, torque, release, locking or tool access is qualified. Washers are held/seated for the stated assembly paths; preliminary axle steps may require temporary holding. Nail retention/forming and manufacturing access remain subject to their separate limitations.

## Known defects and unresolved qualification

Boolean micro-overlaps and tiny/near-flat surface features remain. Selected A defects persist by exact triangle-coordinate identity; B is geometrically unchanged and its previously demonstrated triangle overlaps remain. The cover did not repair them. Valid topology counters, a connected surface and successful HASH export do not establish a clean engineering solid.

The v37 pre-cut cavity tessellation separation bound is not a final opened-body wall guarantee and is not transferred to new C2 geometry as a global wall result. Pocket directional sections and nominal cover thickness are likewise not global closest-surface minima or manufacturing specifications.

All collision statements concern bounded inspection of Float32 triangle meshes. Surface nonintersection can miss contained-volume overlap; a numerical crossing witness is not a penetration-depth measurement. Exact spline surfaces, continuous movement/assembly, arbitrary tolerances or washer escape, load capacity, material/contact pressure, deformation, wear, temperature and manufacturing process are unqualified. Physical palm and neighbouring-finger interaction are not established. This checkpoint was not verified in the home browser or on physical hardware.
