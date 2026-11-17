# Form study, 2026-11-17

Exploratory candidate: `scenes/neira-form-study.hash`. Canonical `scenes/neira.hash` is untouched. This is a silhouette experiment, not a newly qualified assembly. Embedded Doc prepends the study boundary to the unchanged canonical documentation.

The first long torso intersected the mast and looked like a skirt. The second shortens it to world Y900..1255, aligns maximum width with the shoulder datums and leaves the dark structural spine legible. Existing Chest/Front/Back remain hidden for reversible comparison. Head, shoulders, arms, wrists, animation and base are unchanged. Wheels remain provisional workshop mobility; outdoor exploration may require another architecture.

Native Spline Patch, 24 controls / 44 segments / 22 resolved cells, generated display 674 vertices / 1344 triangles. Resolver caps the ends; this is not a hollow manufactured shell. No authored polygons or plugins. Rows `[Y,halfWidth,halfDepth,foreOffset]` mm:

`[[900,125,100,0],[970,140,96,3],[1050,195,104,6],[1135,185,100,8],[1200,145,76,4],[1255,60,48,0]]`

Frame API 1.3.0, live Pages on HOME NVIDIA Turing. Export downloaded to the host, SHA256 checked and copied into the project. Reopening recovered 92 owners, the native cage, patch and complete study Doc; import diagnostic listed no unavailable plugins/tags. A small Doc wording correction was exported afterward. Geometry unchanged by that correction. Candidate SHA256: `e31ec5bb6e0064d39883500226ad5007854a95db16fb1eea538b85bee1101a1e`.

Six sampled candidate frames at 1363x920: GPU 0.328..0.393 ms; CPU 1.8..2.1 ms. Earlier same-session canonical samples were GPU3.80..3.93/CPU1.5..2.6ms. Not a controlled performance comparison, so no speedup claim. Reopen patch build77.9ms; combinatorial manifold result is not geometric self-intersection, tolerance or collision validation. SourceAccuracy's conservative ~903mm surface error is unusable as a manufacturing tolerance.

## Head refinement

The separate candidate now also replaces the box-shaped head skin with an oval native patch, retaining the original hidden. Camera and visor datums are unchanged. The editable head cage uses 16 controls / 28 segments / 14 resolved cells, display312 vertices /620 triangles, observed build59.8ms. Pose90 was visually inspected and produced no scene build errors; this is not a collision certificate. Recipe exported from `tools/form-study-cage.mjs`. Current candidate SHA256: `971c4e9053162bf71e8fe9456c277dce5ee7b3d12138cad36bfd84f4c3702902`. Screenshot: `artifacts/form-study.jpg`. This updated candidate was reopened: 94 owners, zero build errors, both native cages and the 30233-character Doc recovered. The earlier torso-only hash above describes the prior checkpoint.

Next: compare front/profile and arm poses/clearances, then shell split lines, wall thickness, fastening and service access. The current scene contains no new strength, stability, sealed-volume or manufacturing qualification.

## First workstation and pose

The candidate adds a compact wrist-assembly station, not decorative room furniture: top760x300x24mm at X+/-380,Z450..750,Y876..900. Four40x40 support envelopes at X+/-340,Z490/710, rear brace640x40 atY200..240. The front is open. Two100x100x10 setup pads atX+/-200,Z500,Y900..910 mark future fixtures. Legs and the second pad are native Instances. Recipe and pose calculation: `tools/workstation-cage.mjs`. Supports are solid layout envelopes, not specified hollow extrusions or qualified joinery. Base-front gap112.5mm; an800mm departure corridor behind the robot is a provisional space reservation only.

Initial wrist targetY920 was too low. Y950 gave small clearance. Final pose330 targets wrist centersX+/-200,Y975,Z470 with yaw+/-7.2750049579deg, pitch-59.2083491240deg, elbow44.5608743161deg and wrist-roll0. Native readback agrees within1e-9mm (arithmetic precision only). At330, guide/fasteners return to assembled offsets. Original0..300 keyframes remain, timeline extended to330.

Generated display triangles were transformed by each owner world matrix, clipped to the rectangular table/pad footprints, and minimumY compared to their tops. At this single pose, Hub-to-pad gap29.756mm, Guide-to-pad37.492mm; no Fore display triangles entered those footprints. This is not source-surface tolerance, a swept collision check, or whole-robot clearance certification. Six sampled frames at an earlierY950 pose: GPU1.507..2.425ms, CPU1.3..2.1ms,1363x920,NVIDIA Turing. Not a controlled speed comparison.

Important design finding: the current wrist only rolls. At the final pose its axis is about14.65deg above horizontal and cannot independently turn down toward the table. Before claiming an assembly operation, select either an angled fixture or additional wrist articulation. No actuator/joint-limit/stability/load qualification yet.

Current candidate exportSHA256 `c9d26fa6f77acedf509fe9e1b4414fd21fd2f1b610305ed39c5ed04b0c5a0364`,107 owners. Live Frame application version `2026 17 nov 18:54`,API1.3.0. Earlier hashes above document prior checkpoints; canonical remains untouched.


Final saved workstation round-trip passed:107 owners, zero build errors, preserved pose330 wrist centers and embedded Doc; no unavailable plugins/tags. Canonical SHA256 rechecked unchanged.

## Passive cable targets

Instead of adding arbitrary wrist DOFs, the first specific station task is a manual, stationary check: insert/remove a free de-energized nominal8mm cable through the service passage/Guide and a loose16mm-bore target ring. No autonomous feeding or rotation is implied. The rings are not gauges, docking locks or wrist supports.

RingOD36/ID16/length6mm, Q=P+70a from the actual pose330 wrist transforms. RightQ=[191.4238556845,992.7009775192,537.1797971383]mm, left mirrorsX. Axis readback agrees within2e-15 (arithmetic precision). Native annular cells retain two planar holes/genus1; measure.gap along the wrist axis reports30.9999999mm from Guide to ring. This is directional separation, not a cable/manufacturing proof. Note that a separate API pad-to-Hub +Y projection measurement gave28.34485mm at330; the earlier29.756mm result clips to the footprint and therefore answers a different question.

Base plates60x70x6mm atY910..916, X+/-191.4238556845,Z510. Posts12x12mm atY916..980,Z539. Ring/base/post repeat through Instances. These are unfastened layout envelopes; joining, base retention, access and actual cable bending/insertion remain unverified. Recipe:`tools/cable-target-cage.mjs`. Candidate exportSHA256 `bc938e049034e6e4c68b2d0ef4a881280e73527a8c6f946fb10266e9590fa52c`,116owners. The current todo lists Frame/AI-API recommendations; model next steps stay here/STATE, so the user's short feedback file does not become a design backlog.


Cable-target round-trip:116owners, zero build errors, both target centers/axes and fixture Doc preserved.
