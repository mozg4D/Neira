# Neira design basis

Updated: 2026-11-17. Stage: initial packaging and kinematic study.

## Intent

Design a mobile two-arm robot as a prospective physical embodiment for AI-directed work. Develop the workshop around the parts, tools and assembly operations that robot needs. Later machines should expand the workshop's manufacturing capability. Maintain a comprehensible, editable body of engineering work that another person or a later AI model can continue.

The first body serves a flat-floor workshop. Exploration outside the workshop is a long-term requirement to investigate, with terrain, environmental protection, energy and recovery requirements still undefined. Human-like appearance and two-legged locomotion are not predetermined requirements. Beauty is deliberate: proportions, silhouette, joint layout, visible connections and movement should form a coherent whole.

## First demonstrator

The current source constructs a full robot packaging and commanded-motion model, including a provisional manual tool interface. It shows body proportions, wheel placement, shoulder and arm frames, reach and tool positioning. Geometry remains native and editable. Scene Control provides joint and timeline controls; the scene's Doc embeds this design text.

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

## Manual tool interface, revision 0

The source contains a provisional manual bolt-on interface: a wrist plate and mating plate on each arm, for four plate occurrences sharing one native Spline Patch source. It models clearance bores for a future pilot/fastener/pin arrangement. The physical male pilot, fasteners and antirotation pin are not present. No automatic locking or autonomous tool-changing mechanism is claimed.

| Feature | Nominal geometry | Status |
| --- | --- | --- |
| Wrist plate and mating plate | Each Ø60 × 6 mm | Four occurrences across two arms |
| Bolt circle | Ø40 mm | Packaging assumption |
| Clearance holes | 3 × Ø4.5 mm at 0°, 120°, 240° | Geometry only; fastener selection pending |
| Central bore | Ø20 mm through both plates | Male pilot, fit and engagement unresolved |
| Antirotation pin bore | Ø3 mm at radius 15, angle 60° | Plate-local X = 7.5, Y = 12.990381; physical pin and fit unresolved |
| Mating-plate placement | Wrist-local Z = 6…12 mm | Wrist plate occupies Z = 0…6 mm |
| Test-tool ring | Ø26 OD, Ø20 ID, length 24 mm | Wrist-local Z = 12…36 mm; attachment unresolved |
| Nominal plate/ring stack | 36 mm | 6 + 6 + 24, excluding unresolved mounting/retention |

The nominal plate/ring stack is closed arithmetically; generated geometry still requires inspection. Material, fastener choice and access, pilot fit, pin fit, torque transfer, retention, wiring and connector routing remain unresolved. Nominal bore clearance alone does not define an assembly tolerance. A displayed mating face or ring is not evidence of a physically attached tool.

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
| Joint / Mount / Wrist | Locate nominal arm axes and transmission volumes | Bought drives/bearings with designed housings, shafts and mounts | Torque/speed, reductions, bearing spans, retention, limits and wiring |
| Upper / Fore | Hollow arm-link envelopes between joint regions | Suitable hollow stock after size selection, or machined/formed construction | End joints, actual section, torsional/bending loads, assembly and cable access |
| Plate / Mate | Manual wrist/tool mating faces | Machine or cut blanks, then finish interface bores/faces as required | Material, fits, fasteners, physical pilot/pin, attachment and torque transfer |
| Tool | Test-tool ring and tool-space placeholder | Cut and machine tube, or machine a blank | Actual tool function, mounting, retention, services and required accuracy |

Metal additive manufacturing is one candidate process for appropriate parts. Its route must account for supports, separation, finishing, inspection and any required heat treatment or precision machining; the printed shape alone is not a finished-part qualification. Process choice follows the part's geometry, material, loads, accuracy and available equipment. [EOS's metal AM workflow](https://www.eos.info/metal-solutions/metal-ecosystem) is a process reference; it does not validate Neira's parts.

Workshop self-production is a development direction with explicit external dependencies. This iteration does not claim a closed manufacturing loop or a self-replicating robot.

## Modeling and control

Use Frame's native editable Spline Patches, splines, profiles and generators. Repeated physical parts share source geometry through Instances. Preserve only controls and subdivisions required for the intended shape and inspection. Avoid decorative fasteners and hidden detail that do not establish a real interface or design decision.

The model has eight commanded joint frames: shoulder yaw, shoulder pitch, elbow and wrist roll on each arm. Native affine keyframes are authored at frames 0, 90 and 180, with the editable reach pose at frame 90 and Scene Control's seek range 0…180. Scene Control exposes Play, Pause, Home, Reach pose, timeline seek, tool/body views and individual frame-90 joint sliders. The ±60° sliders are study controls, not established mechanical limits or a demonstrated reachable workspace.

The model uses the core native SDK to set exact assembly origins and affine frames. Core engine methods named `pluginSetPivot`/`pluginSetLocal` are historical API names; this model does not load a Frame plugin module. Joint motion changes affine frames rather than rebuilding spline cages.

The control program requires Frame core support for declared object-reference bindings in Scene Programs. This project depends on that core extension; an earlier checkout without object bindings is not qualified to run it. Record the required Frame commit in `STATE.md` when published and preserve exact core source hashes with build/verification reports.

Saved program source and bindings must reproduce the control panel after reopening the HASH. Restoring a file does not imply restoring a running program's transient state. Home returns to native animation frame 0; individual sliders edit the frame-90 pose rather than setting unrecorded joint state.

`docs/Design.md` is the canonical design text for the scene's Doc. Update it when dimensions, architecture, assumptions or verification status change. `STATE.md` records the current delivered artifacts and the exact point from which work resumes.

## Verification ledger

| Claim | Required evidence | Current state |
| --- | --- | --- |
| Source remains editable | Inspect native authoring types after HASH reopen | Native HASH round-trip preserves exact editable cages; see artifacts/verification.json |
| Nominal link lengths sum to 600 mm | 270 + 250 + 80 | Arithmetic only |
| Plate/ring nominal depth is 36 mm | 6 + 6 + 24; measure generated stack | Arithmetic and source placement only |
| Tool interface has correct evaluated geometry | Inspect bores, feature separation, topology and bounds | Nominal 60 × 60 × 6 mm, five through-holes, one closed orientable surface verified; fits and loads remain open |
| Joint controls act on intended frames | Exercise home, individual controls, stop/reset and reopen | Eight controls, native playback, Home/Pause, saved pose and popup/HASH reload verified |
| Motion is physically feasible | Joint/actuator selection, loads, collision and stability analysis | Open engineering work |
| Frame performance improves | Repeated comparable measurements on recorded revisions | Initial scene baseline recorded; indexed API reference lookup verified separately; no whole-application speedup claimed |

No surface-geometry physics simulation has been performed. Native rendered surfaces and commanded motion are model representations, not simulated contact, deformation, fatigue or manufacturing-process behavior.

## Decisions

- 2026-11-17: Begin with a wheeled, two-arm workshop robot. Determine additional mobility from concrete outdoor requirements.
- 2026-11-17: Build the workshop around the robot's actual part and assembly requirements.
- 2026-11-17: Keep first-model dimensions provisional; begin with the envelope and link lengths above.
- 2026-11-17: Use a manual tool faceplate for the first interface. Automatic locking needs a separate mechanism and verification.
- 2026-11-17: Begin base packaging with two rear drive-wheel envelopes and two front passive swivel-caster envelopes. Drives, mounting and stability remain open.
- 2026-11-17: Use native parametric/spline modeling and no Frame plugins. Prioritize core `index.html` reliability and measured performance.
