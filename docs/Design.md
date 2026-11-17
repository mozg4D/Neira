# Neira design basis

Updated: 2026-11-17. Stage: packaging, commanded motion and manual tool-interface study, revision 1.

## Intent

Design a mobile two-arm robot as a prospective physical embodiment for AI-directed work. Develop the workshop around the parts, tools and assembly operations that robot needs. Later machines should expand the workshop's manufacturing capability. Maintain a comprehensible, editable body of engineering work that another person or a later AI model can continue.

The first body serves a flat-floor workshop. Exploration outside the workshop is a long-term requirement to investigate, with terrain, environmental protection, energy and recovery requirements still undefined. Human-like appearance and two-legged locomotion are not predetermined requirements. Beauty is deliberate: proportions, silhouette, joint layout, visible connections and movement should form a coherent whole.

## First demonstrator

The current source constructs a full robot packaging and commanded-motion model, including a manual flanged-hub/cable-guide interface. It shows body proportions, wheel placement, shoulder and arm frames, reach, tool positioning and an exploded interface view. Geometry remains native and editable. Scene Control provides joint and timeline controls. The scene's Doc combines this design text with the detailed [tool-interface study](Tool-interface.md).

This iteration establishes geometry and programmatic control. It does not establish rated payload, actuator capability, structural strength, balance, grasp reliability, physical collision freedom or readiness to manufacture.

## Provisional dimensions

All values below are nominal source dimensions or packaging targets in millimetres, accepted for the first model. They are not anthropometric requirements, measured hardware dimensions or validated performance ratings. Source coordinates are right-handed, Y up and +Z forward; X spans the body width. Left and right names follow negative and positive X respectively.

| Item | Value | Meaning |
| --- | ---: | --- |
| Reference body envelope | 650 × 750 × 1450 | Initial width × depth × height target; arm swept envelope remains to be measured |
| Drive-wheel outer width | 650 | Source spans X = −325 to +325 |
| Base height | 250 | Source lid upper face |
| Deck/cowl/lid plan | 500 × 670 | Nominal platform width × depth |
| Rear drive-wheel envelopes | 2 × Ø200 × 60 | Differential-drive concept; centres Y = 100, Z = −240 |
| Front passive swivel-caster envelopes | 2 × Ø120 × 40 | Wheel centres Y = 60, X = ±210, Z = 260 |
| Shoulder centres | X = ±260, Y = 1050, Z = 0 | Source joint origins |
| Upper arm | 270 | Nominal joint-to-joint length |
| Forearm | 250 | Nominal joint-to-joint length |
| Wrist/tool allowance | 80 | Remaining straight-line allowance |
| Per-arm reach target | 600 | 270 + 250 + 80; straightened ideal chain, not a validated workspace |

The drive components, caster pivots and joints are envelopes, with no selected motor, bearing, brake or load rating. Contact between envelopes and the modeled mount/shaft shapes establish nominal placement only; attachment structures, bearings, retention and assembly details remain unresolved. The 80 mm wrist/tool allowance is a reach budget, not a dimension certified by the currently modeled end-tool stack. Actual source dimensions govern the saved model; resolve changes in both source and this document. A full swept envelope requires actual joint ranges, tool geometry and interference checks.

## Manual tool interface, revision 1

Each wrist now has one native Spline Patch flanged hub with an integral locating register and a mating cable-guide body, also one native Spline Patch. Both sides share their respective source geometry through Instances. The assembly contains six M4 × 16 screws, six washers and two locating pins across the robot. The nominal hardware forms are represented; their grade, fits, tightening and physical qualification remain open. There is no automatic lock or autonomous tool-changing mechanism.

| Feature | Nominal geometry | Status |
| --- | --- | --- |
| One-piece wrist hub | Body Ø58 at Z = −34…0; flange Ø60 at 0…6 | Rear actuator attachment unresolved |
| Integral register | Ø20 at Z = 6…9 | 3 mm nominal engagement; H7/g6 is a candidate fit, not achieved manufacturing accuracy |
| Service passage | Nominal Ø12 minimum | Continues through hub/register and guide; no installed cable |
| Bolt circle | Ø40; angles 0°, 120°, 240° | M4 blind tapped-hole intent in hub; Ø4.5 clearance in mate |
| Hub thread representation | Ø4 envelope at Z = −8…6 | Helix suppressed; intended full-thread depth 12 and tool-clearance allowance require process detail |
| Mating tool | Ø60 × 6 plate at Z = 6…12, Ø20 bore, integral tapering guide to Z = 36 | Real passive-guide function proposed; material and cable-contact finish unresolved |
| Guide section | Outer/inner radius 13/10 at Z = 12, tapering to 9/6 at 35.5 | Mouth chamfers end at radii 8.5/6.5 and Z = 36 |
| Locating pin | Ø3 × 10 at radius 17, angle 60°; Z = −1…9 | 7 mm nominal embedment, 3 mm projection; fixed-seat retention unresolved |
| Mate clocking slot | Radial, width 3.2, overall length 5, centred on pin position | X = 8.5, Y = 14.722432; nominal free clocking approximately ±0.337° |
| Per-wrist screws/washers | 3 × DIN 912 M4 × 16; 3 × DIN 125 M4, ID 4.3/OD 9/nominal thickness 0.8 | 3 mm hex access from tool side; real washer thickness and all other tolerances require stacking |

The verified nominal screw entry past the hub face is 16 − 6 − 0.8 = 9.2 mm; the screw's full-major cylindrical envelope overlaps by 8.885 mm after its tip detail. This is geometric overlap, not effective thread engagement or joint strength. The detailed [tool-interface study](Tool-interface.md) records primary dimensional references, measured access, manufacturing candidates, assumed future load cases and unresolved pin retention. Revision-1 native geometry, persistence and commanded assembly motion have their own checks; the old plate's results are historical.

## Manufacturing and dependencies

Each designed part should gain a route as its geometry matures: made in the workshop, bought, or unresolved. Initial candidates for workshop production include frame members, brackets, housings, covers, tool plates and fixtures. Candidate bought components include bearings, motors, drives, sensors, compute hardware, electrical protection and energy storage. No specific product is selected yet.

The table covers the current model's part families. Routes are candidates to investigate, not released manufacturing instructions; visual material names do not select engineering materials.

| Part family | Function | Candidate route | Missing design input |
| --- | --- | --- | --- |
| Deck / Lid | Base platform and removable top cover | Cut or machine plate | Loads, material, thickness justification, attachments and access |
| Cowl | Base enclosure around the platform | Formed/joined sheet or printed prototype | Seams, fastening, internal equipment, ventilation and clearance |
| Foot / Mast | Locate the body above the base | Machined mounting plate plus hollow section; revise profile to available stock if suitable | Load path, attachment patterns, section choice, stiffness and cable route |
| Chest / Front / Back | Body enclosure and removable access faces | Formed/joined sheet or printed shell and panels | Internal packaging, service access, seams, fastening and shoulder support |
| Head / Visor / Camera / Neck | Sensor/head packaging and appearance | Printed or formed housing; bought sensor/optics with a designed mount | Head is currently a solid envelope; cavity, optics, cooling, neck attachment and actual sensor selection |
| Drive Tire / Hub / Axle | Rear traction-wheel and drive packaging | Select bought wheel/drive/bearing assemblies; design any hub or shaft adapters | Payload, traction, speed, shaft support, braking and selected hardware |
| Caster Roller / Hub / Fork / Swivel | Front passive support and steering envelope | Select bought caster assemblies or design fork around bought wheel/bearings | Swivel bearings, wheel axle/retention, trail, loads and mounting pattern |
| Joint / Mount | Locate nominal arm axes and transmission volumes | Bought drives/bearings with designed housings, shafts and mounts | Torque/speed, reductions, bearing spans, retention, limits and wiring |
| Upper / Fore | Hollow arm-link envelopes between joint regions | Suitable hollow stock after size selection, or machined/formed construction | End joints, actual section, torsional/bending loads, assembly and cable access |
| Wrist Hub | Integral wrist body, flange, register and service passage | Turn one blank, then drill/tap and finish the pin seat | Material, fits, pin retention, rear actuator attachment and joint qualification |
| Guide | Mating face and integral passive cable guide | Turn one blank, then drill clearance bores and mill radial slot | Material, cable-contact edges, actual cable and demonstrated service life |
| M4 × 16 / Washer / Pin | Clamp and clock the mating tool | Bought standard-form hardware represented from catalogue dimensions | Final grade/finish, actual tolerances, torque/locking and fixed-pin fit |

Metal additive manufacturing is one candidate process for appropriate parts. Its route must account for supports, separation, finishing, inspection and any required heat treatment or precision machining; the printed shape alone is not a finished-part qualification. Process choice follows the part's geometry, material, loads, accuracy and available equipment. [EOS's metal AM workflow](https://www.eos.info/metal-solutions/metal-ecosystem) is a process reference; it does not validate Neira's parts.

Workshop self-production is a development direction with explicit external dependencies. This iteration does not claim a closed manufacturing loop or a self-replicating robot.

## Modeling and control

Use Frame's native editable Spline Patches, splines, profiles and generators. Repeated physical parts share source geometry through Instances. Preserve only controls and subdivisions required for the intended shape and inspection. Avoid decorative fasteners and hidden detail that do not establish a real interface or design decision.

Part agents own separate pure factories: `src/parts/wrist-hub.js` and `src/parts/cable-guide.js`. Each returns JSON-serializable native cage data, a short part name, millimetre units and a mating-face datum at local Z = 0 with normal +Z. The main assembler owns shared dimensions in `src/interface.js`, shared cage helpers in `src/cad.js`, and `src/parts/index.js`, whose `createPartSet()` gathers the agreed parts. Part factories make no Frame objects or API calls. `src/model.js` creates the actual scene objects and Instances and checks the assembly through the normal build/verification workflow.

Both part datums are placed at wrist-local Z = +6. The technical tables in this document and the detailed interface study remain in wrist assembly coordinates; body positions and nominal functional geometry are unchanged by this source separation. All source JavaScript files are included in the build/verification hash fence. Only the assembled, checked configuration is qualified by its reports; independently edited or hypothetical dimension variants need their own checks.

The model has eight commanded joint frames: shoulder yaw, shoulder pitch, elbow and wrist roll on each arm. Their native affine keyframes remain at frames 0, 90 and 180, with the editable reach pose at frame 90. Frames 180…300 add an exploded interface view: screws/washers withdraw first, then the mating guide separates from the hub/register/pin. The hub and pin remain on the wrist. These are commanded axial inspection translations; actual unscrewing, contact, gravity and handling are not simulated.

Scene Control exposes Play, Pause, Home, Reach pose, Exploded tool, timeline seek over 0…300, tool/body views and individual frame-90 joint sliders. The ±60° sliders are study controls, not established mechanical limits or a demonstrated reachable workspace.

Locating bores/registers use eight 45° cubic arcs. Independent source-bound checks enclose their radius-10 curves in [9.99999699046, 10.00004376280] mm, giving at most 0.043763 µm radial deviation within the 0.1 µm representation budget. Ordinary non-locating circular outlines use four quarter-circle cubic arcs. The current register and bore are congruent/coaxial nominal Ø20 source shapes with zero nominal diameter clearance; the candidate H7/g6 manufacturing offsets are not applied. Source curves and rendered tessellation have different representation errors. Their verified representation accuracy establishes no real fit, surface finish or manufacturing tolerance; those require a drawing, process and metrology.

The model uses the core native SDK to set exact assembly origins and affine frames. Core engine methods named `pluginSetPivot`/`pluginSetLocal` are historical API names; this model does not load a Frame plugin module. Joint motion changes affine frames rather than rebuilding spline cages.

The control program requires Frame core support for declared object-reference bindings in Scene Programs. This project depends on that core extension; an earlier checkout without object bindings is not qualified to run it. Record the required Frame commit in `STATE.md` when published and preserve exact core source hashes with build/verification reports.

Saved program source and bindings must reproduce the control panel after reopening the HASH. Restoring a file does not imply restoring a running program's transient state. Home returns to native animation frame 0; individual sliders edit the frame-90 pose rather than setting unrecorded joint state.

The canonical embedded Doc is the composition of `docs/Design.md` followed by `docs/Tool-interface.md`, in that order. Update the relevant source when dimensions, architecture, assumptions or verification status change, then rebuild the HASH and check the exact composite text after reopening. `STATE.md` records the current delivered artifacts and the exact point from which work resumes.

## Verification ledger

The separate part factories have passed native integration checks against the recorded Frame revision. Local-datum and wrist-coordinate inspections confirm that extracting the parts preserved their assembly geometry. The checked canonical file is published only after the current source, geometry, controls and persistence checks pass; exact evidence is in artifacts/verification.json.

| Claim | Required evidence | Current state |
| --- | --- | --- |
| Separate part factories assemble through shared datums | Build from `createPartSet()`, compare native geometry/placement, exercise persistence and controls | Factory datums, four physical placements, source geometry, controls and persistence verified |
| Revision-1 source remains editable | Inspect native authoring types and exact cages after HASH reopen | Native types, parameters, assembly frames and exact source cages preserved through HASH round-trip |
| Nominal link lengths sum to 600 mm | 270 + 250 + 80 | Arithmetic only |
| Revision-1 nominal interface dimensions | Measure hub, register, guide, bores, slot, pin and hardware | Six screw/washer stacks, register, passage, pin/slot and blind-envelope dimensions verified; thread and fit qualification false |
| Revision-1 hub/guide topology | Inspect closed orientable surfaces and feature walls/caps | Each evaluated Hub/Guide is one closed orientable surface; no boundary/nonmanifold edges, orientation defects, invalid vertex links or zero-area faces found |
| Locating source curves meet approximation target | Independently bound cubic radial error | Maximum radius-10 deviation bounded by 0.043763 µm, below 0.1 µm source budget; manufacturing fit unqualified |
| Front driver approach | Bound Ø10 round approaches against guide/source and other heads | All six paths have a conservative guide-clearance bound of approximately 1.99634856 mm; other-head gap exceeds 26 mm; whole-robot/driver/socket qualification excluded |
| Revision-1 controls and exploded order | Exercise eight controls, playback, Home/Pause, ordered separation and reopen | Eight sliders and playback/persistence verified; frame 240 keeps guides seated after screw withdrawal, frame 300 separates guides and retains hubs/pins |
| Composite embedded Doc matches source | Compare Design + Tool-interface after build and HASH reopen | Exact composite text and control source retained through HASH round-trip |
| Motion is physically feasible | Joint/actuator selection, loads, collision and stability analysis | Open engineering work |
| Frame performance improves | Repeated comparable measurements on recorded revisions | Initial scene baseline recorded; indexed API reference lookup verified separately; no whole-application speedup claimed |

The current part-factory checkpoint passed build and focused native checks at DPR 1 on hardware WebGPU with no Frame plugin runtime. Reports in `artifacts/` bind results to exact source hashes, including all part modules. Source or Doc changes require a fresh build/check before canonical publication. Historical revision 0 checked the earlier simple five-hole plate; its evidence does not substitute for revision-1 checks.

No surface-geometry physics simulation has been performed. Native rendered surfaces and commanded motion are model representations, not simulated contact, deformation, fatigue or manufacturing-process behavior.

## Decisions

- 2026-11-17: Begin with a wheeled, two-arm workshop robot. Determine additional mobility from concrete outdoor requirements.
- 2026-11-17: Build the workshop around the robot's actual part and assembly requirements.
- 2026-11-17: Keep first-model dimensions provisional; begin with the envelope and link lengths above.
- 2026-11-17: Use a manual tool faceplate for the first interface. Automatic locking needs a separate mechanism and verification.
- 2026-11-17: Revision 1 integrates the wrist hub/register and the mating cable guide, uses front-access M4 screws into the hub, and moves the pin/radial slot to radius 17 to preserve the guide-base ligament. Fits, pin retention and loads remain unqualified.
- 2026-11-17: Begin base packaging with two rear drive-wheel envelopes and two front passive swivel-caster envelopes. Drives, mounting and stability remain open.
- 2026-11-17: Use native parametric/spline modeling and no Frame plugins. Prioritize core `index.html` reliability and measured performance.
