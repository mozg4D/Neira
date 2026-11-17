# Form study, 2026-11-17

Exploratory candidate: `scenes/neira-form-study.hash`. Canonical `scenes/neira.hash` is untouched. This is a silhouette experiment, not a newly qualified assembly. Embedded Doc prepends the study boundary to the unchanged canonical documentation.

The first long torso intersected the mast and looked like a skirt. The second shortens it to world Y900..1255, aligns maximum width with the shoulder datums and leaves the dark structural spine legible. Existing Chest/Front/Back remain hidden for reversible comparison. Head, shoulders, arms, wrists, animation and base are unchanged. Wheels remain provisional workshop mobility; outdoor exploration may require another architecture.

Native Spline Patch, 24 controls / 44 segments / 22 resolved cells, generated display 674 vertices / 1344 triangles. Resolver caps the ends; this is not a hollow manufactured shell. No authored polygons or plugins. Rows `[Y,halfWidth,halfDepth,foreOffset]` mm:

`[[900,125,100,0],[970,140,96,3],[1050,195,104,6],[1135,185,100,8],[1200,145,76,4],[1255,60,48,0]]`

Frame API 1.3.0, live Pages on HOME NVIDIA Turing. Export downloaded to the host, SHA256 checked and copied into the project. Same-session readback reported 92 owners (later found not to prove reload),, the native cage, patch and complete study Doc; import diagnostic listed no unavailable plugins/tags. A small Doc wording correction was exported afterward. Geometry unchanged by that correction. Candidate SHA256: `e31ec5bb6e0064d39883500226ad5007854a95db16fb1eea538b85bee1101a1e`.

Six sampled candidate frames at 1363x920: GPU 0.328..0.393 ms; CPU 1.8..2.1 ms. Earlier same-session canonical samples were GPU3.80..3.93/CPU1.5..2.6ms. Not a controlled performance comparison, so no speedup claim. Reopen patch build77.9ms; combinatorial manifold result is not geometric self-intersection, tolerance or collision validation. SourceAccuracy's conservative ~903mm surface error is unusable as a manufacturing tolerance.

## Head refinement

The separate candidate now also replaces the box-shaped head skin with an oval native patch, retaining the original hidden. Camera and visor datums are unchanged. The editable head cage uses 16 controls / 28 segments / 14 resolved cells, display312 vertices /620 triangles, observed build59.8ms. Pose90 was visually inspected and produced no scene build errors; this is not a collision certificate. Recipe exported from `tools/form-study-cage.mjs`. Current candidate SHA256: `971c4e9053162bf71e8fe9456c277dce5ee7b3d12138cad36bfd84f4c3702902`. Screenshot: `artifacts/form-study.jpg`. Same-session readback reported 94 owners (not an independently proven reload),, zero build errors, both native cages and the 30233-character Doc recovered. The earlier torso-only hash above describes the prior checkpoint.

Next: compare front/profile and arm poses/clearances, then shell split lines, wall thickness, fastening and service access. The current scene contains no new strength, stability, sealed-volume or manufacturing qualification.

## First workstation and pose

The candidate adds a compact wrist-assembly station, not decorative room furniture: top760x300x24mm at X+/-380,Z450..750,Y876..900. Four40x40 support envelopes at X+/-340,Z490/710, rear brace640x40 atY200..240. The front is open. Two100x100x10 setup pads atX+/-200,Z500,Y900..910 mark future fixtures. Legs and the second pad are native Instances. Recipe and pose calculation: `tools/workstation-cage.mjs`. Supports are solid layout envelopes, not specified hollow extrusions or qualified joinery. Base-front gap112.5mm; an800mm departure corridor behind the robot is a provisional space reservation only.

Initial wrist targetY920 was too low. Y950 gave small clearance. Final pose330 targets wrist centersX+/-200,Y975,Z470 with yaw+/-7.2750049579deg, pitch-59.2083491240deg, elbow44.5608743161deg and wrist-roll0. Native readback agrees within1e-9mm (arithmetic precision only). At330, guide/fasteners return to assembled offsets. Original0..300 keyframes remain, timeline extended to330.

Generated display triangles were transformed by each owner world matrix, clipped to the rectangular table/pad footprints, and minimumY compared to their tops. At this single pose, Hub-to-pad gap29.756mm, Guide-to-pad37.492mm; no Fore display triangles entered those footprints. This is not source-surface tolerance, a swept collision check, or whole-robot clearance certification. Six sampled frames at an earlierY950 pose: GPU1.507..2.425ms, CPU1.3..2.1ms,1363x920,NVIDIA Turing. Not a controlled speed comparison.

Important design finding: the current wrist only rolls. At the final pose its axis is about14.65deg above horizontal and cannot independently turn down toward the table. Before claiming an assembly operation, select either an angled fixture or additional wrist articulation. No actuator/joint-limit/stability/load qualification yet.

Current candidate exportSHA256 `c9d26fa6f77acedf509fe9e1b4414fd21fd2f1b610305ed39c5ed04b0c5a0364`,107 owners. Live Frame application version `2026 17 nov 18:54`,API1.3.0. Earlier hashes above document prior checkpoints; canonical remains untouched.


Earlier same-session readback, not a proven reload:107 owners, zero build errors, preserved pose330 wrist centers and embedded Doc; no unavailable plugins/tags. Canonical SHA256 rechecked unchanged.

## Passive cable targets

Instead of adding arbitrary wrist DOFs, the first specific station task is a manual, stationary check: insert/remove a free de-energized nominal8mm cable through the service passage/Guide and a loose16mm-bore target ring. No autonomous feeding or rotation is implied. The rings are not gauges, docking locks or wrist supports.

RingOD36/ID16/length6mm, Q=P+70a from the actual pose330 wrist transforms. RightQ=[191.4238556845,992.7009775192,537.1797971383]mm, left mirrorsX. Axis readback agrees within2e-15 (arithmetic precision). Native annular cells retain two planar holes/genus1; measure.gap along the wrist axis reports30.9999999mm from Guide to ring. This is directional separation, not a cable/manufacturing proof. Note that a separate API pad-to-Hub +Y projection measurement gave28.34485mm at330; the earlier29.756mm result clips to the footprint and therefore answers a different question.

Base plates60x70x6mm atY910..916, X+/-191.4238556845,Z510. Posts12x12mm atY916..980,Z539. Ring/base/post repeat through Instances. These are unfastened layout envelopes; joining, base retention, access and actual cable bending/insertion remain unverified. Recipe:`tools/cable-target-cage.mjs`. Candidate exportSHA256 `bc938e049034e6e4c68b2d0ef4a881280e73527a8c6f946fb10266e9590fa52c`,116owners. The current todo lists Frame/AI-API recommendations; model next steps stay here/STATE, so the user's short feedback file does not become a design backlog.


Earlier same-session readback, not a proven reload:116owners, zero build errors, both target centers/axes and fixture Doc preserved.


## Corrected persistence verification

Browser filechooser setFiles completed without error but did not replace the scene. A deliberate changed-node test exposed this; earlier same-session readbacks are not round-trip evidence. Attribution to Frame versus browser transport is unresolved. No extension/system permissions were changed.

A genuinely new blank Frame tab then fetched the published e1efe25 HASH bytes. SHA256 was checked against the local export before calling documented scene.open(base64). It imported116 owners, zero Boolean nodes, zero build errors, all three stable torso/head/ring cage hashes, exact pose330 wrist/target transforms and complete Doc (33470 characters; SHA256646578ffb1713fba7111c827a044a44e05dfc8bb3824d2e2a977a9a7e408e21f). The imported ring was16/24, distinguishable from the unsaved32/64 experiment. This is the first independent serialized round-trip proof for the study.

Two temporary native Boolean QA unions were removed and never exported or published. Their spline inputs were preserved. Continue with directly spline-managed surfaces only.


## Direct spline R1 update

Current ring uses roundedTubeCage():32 controls,64 segments,32 native cells; nominal R1 inner/outer entries preserve minimum16mm bore,36mm OD and6mm axial length. Resolver reports genus1/one component/no boundary, no build error; generated display1152 vertices/2304 triangles. No Boolean nodes or mesh conversion retained. Ring/post/base remain separate unfastened layout parts, not a claimed printable one-piece jig. Latest candidateSHA256:3a430e364ac0925d4116fa55ad00ceff2e5390886a1ba1b768e4f7f03f88a3bf.

## Split target keepers, 2026-11-17
Native Frame checkpoint: 139 owners, zero Boolean objects and zero build errors. Four direct Spline Patches (two mirrored top/stem pairs), each 160 controls / 326 segments / 164 cells, with closed native display topology. Integrated stem foot moved to Z534 so its footprint remains on the base. Native M3x16 screws, washers and nuts model two stacks per target. Nominal ring seat R18.2 and 6.4 mm pocket are provisional allowances, not validated fits. Feet/baseplates/table are still unfastened; strength, material and swept clearance remain open. Source-only helper retains rejected experiments; only keeperWithM3LugsV2Cage is the accepted current cage. A crossing-diagonal source graph was corrected, not a Frame bug.

Frame export: 131512 bytes, SHA256 0834a472a980045fd66a61160ceeff7ee8a0440298057549c3a7631f042f18bd. Canonical scenes/neira.hash unchanged. Independent fresh-tab reopening pending for this checkpoint; earlier receipts only cover their recorded previous hashes.

Independent reopening completed: a new empty Frame tab fetched exact commit 855ec3a, matched the full HASH SHA256, imported via documented scene.open(base64), recovered 139 owners and the keeper Doc note. All four keeper display meshes had zero boundary, nonmanifold, orientation and degenerate defects. Receipt: artifacts/keeper-check.json. This is persistence and display-topology evidence, not manufacturing qualification.

Performance observation after fresh import of keeper checkpoint 855ec3a: NVIDIA Turing, viewport 1363x1199, six sampled CPU frames 3.10/2.70/2.20/2.20/2.30/1.80 ms; GPU 1.90/8.13/3.54/7.60/9.24/9.24 ms. No controlled before/after comparison and no general speedup claim. tools/target-frame-layout.mjs records the source-coordinate transforms and positive-handed fastener placements used in Frame; its CPU smoke check reports four 160/326 cages and 16 hardware placements, not a native-build test.

Further fresh-tab source comparison: all four keeper cages match the submitted source exactly at 160 controls and 326 segment endpoints/handles each (zero maximum coordinate or handle difference, zero connectivity mismatches). A narrower torso trial was rejected and restored: its lower edge conflicted visually with the old internal mast packaging; a future silhouette redesign must include the frame, not only the skin.

## Whole-body and service-bay concept checkpoint
The active form-study now has a continuous lower-body silhouette and narrower torso, replacing the visible rectangular mast. Original Body/Mast remains hidden and recoverable. New shell is only exterior packaging: it is not hollow, load-qualified or ready to fabricate; internal frame, access and joints require holistic redesign. Wheel architecture is provisional. A separate 920x260 three-level service rack establishes a maintenance/storage bay beside the table (four uprights, two Instances, shelves Y300/900/1500). Bracing, shelf joints, anchoring, stability and access are unresolved. The source-only M4 foot proposal is not integrated; micro-fixture work is deferred for overall design progress.
Frame export: 154 owners, zero build errors/Boolean, 140810 bytes, SHA256 b221ccf785c71394bbc46e6238ff14d0e0eb2568198ad9986d325d951ed353fb. Earlier keeper-check.json remains explicitly bound to 855ec3a, not this new whole scene. Native scene Doc includes this concept status. Independent new-file import pending. Canonical scenes/neira.hash unchanged.

## Service rack placement correction
2026-11-17: independent fresh-tab import of exact 82f70b1 bytes exposed misplaced front upright Instances. Corrected source-pivot offsets: front bounds X660..700 /1500..1540, Y0..1480, Z175..215 mm. Rear posts remain Z385..425; all four stand on Y0. Authoring placement correction, not a Frame bug. Bracing, joints, anchoring and stability remain unresolved. Native Doc updated. Export SHA256 336be25e3da783e559886f28f4e49358eb1da3ed69a99034dfea5d802a4bd2b6, 140966 bytes. Independent import of corrected bytes pending. Canonical neira.hash unchanged.
