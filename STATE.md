# Neira state and handoff

Updated: 2026-11-17. RESUMED by the user's later instruction to work on HOME and store the project in mozg4D/Neira. Earlier pause/release notes below are historical, not a current stop instruction.

## Current form-study checkpoint

Canonical scenes/neira.hash remains unchanged (SHA256 c8751a111944cb762cb4400a6ef56c0d712458731324e1f1d6a80811e60aa036). Separate candidate scenes/neira-form-study.hash now has native torso/head studies and the first assembly workstation. Frame330 adds an analytically placed work pose; old body/head envelopes are retained hidden. Read docs/Form-study.md for actual evidence, limits and next work. Recipe: tools/form-study-cage.mjs. No Frame code changed. No new canonical qualification is claimed. Modeling uses an isolated Chrome tab, not the user's existing scenes. Candidate round-trip recovered107 owners, zero build errors, both wrist centers at X+/-200,Y975,Z470, and the complete study Doc. Next: resolve roll-only wrist orientation (angled fixture versus new articulation), check swept clearances, then shell/bench construction. Artifacts/form-study.jpg shows the saved pose.

## Pause checkpoint and shared Frame release

The user paused Neira to let another chat edit Frame's `index.html`. They explicitly asked to let subagents finish their current tasks, then authorized publication of all existing local printer/render changes so the next chat starts from one shared version.

`C:\frame` is now committed and pushed at `0c82bbd104711dce4192b69632777ce42452d520` (HTML/SW version `2026 17 nov 17:24`). Local main and GitHub main match; the working tree was clean after publication. This includes the previously uncommitted printer/render changes and related test maintenance, plus a one-line actual-shader extraction-fixture repair. The earlier Neira core fixes are ancestors. Pages deployment 44103401795 succeeded; deployed index, service worker, printer runtime and manifest were fetched and matched the local release bytes exactly. Compact receipt: `artifacts/frame-release.json`. Native printer-only integration passed 128 checks at DPR1 on NVIDIA Turing, without browser/console/GPU validation errors, loss or replacement. CPU review passed shared bridge 11, replica visibility 6, camera depth 19 and shader assembly 5; syntax passed 2 executable and 6 lazy blocks. Source identity binding passed 153 checks; these are not behavioral qualification. No general/full suite, DPR2 or stress run was performed for this release. Reports are ignored files under `C:\frame\tests\results`: `printer-shared-release.json` and `printer-shared-core-review.json`.

The verified Neira HASH and embedded Doc were not replaced during this pause checkpoint. Their recorded core remains the separate clean `work/frame` checkout at b19eaee, not the newer shared Frame release. Do not update that checkout or reinterpret its old report as verification of a new Frame revision. On resume, inspect the user's current Frame changes, choose/freeze the intended core and rebuild/check one candidate before promoting a new canonical file.

Finished but not native-integrated follow-up work:

- `docs/Wrist-support.md`: sourced DRAFT for two 6804 bearings, front locating/rear outer-ring floating arrangement, rotor/caps/retention and a candidate Fore insert attachment. No proposed geometry was modeled or accepted as a qualified interface. Fits, endplay, cap fastening/tool access, Fore wall loads, materials, drive and life remain open. Importantly, the rear bearing cannot pass through the intermediate cartridge shoulder: the draft assembly sequence now installs the front and rear parts from their respective ends.
- `tools/load-study.mjs` and `tools/load-study-check.mjs`: explicit G/S bending and separate Tz pin screening, illustrative density and source-derived geometry. All 36 pure CPU arithmetic/unit/equilibrium/sign/scaling checks passed. Output is always `qualified:false`. The guarded CLI rejects the current geometry report before writing, because fresh source-fenced geometry evidence with volumes is required. `artifacts/load-study.json` does not exist; historical volume was not relabeled as current data.
- `tools/check.mjs`: minimal pending change retains already-read signed/absolute tessellated Hub/Guide volumes and checks finite positive values. No extra GPU read. This checker change has not received a new native run; the old canonical's 210-check result belongs to the earlier checker/source snapshot.

The build still embeds exactly Design + Tool-interface. Neither draft chapter has been added. Resume by reviewing the load worksheet/source composition and hash fences together, then running the relevant candidate build/check and only then the actual-data calculator. Supplementary local handoff is `work/load-study-handoff.md`; the essential boundary is recorded here for a fresh clone.

Two read-only core audits produced no application changes. `C:\frame\tests\results\spline-normalization-audit.json` measured normalization as too small to justify optimization on Neira. `ai-native-affine-audit.json` lists unmeasured bulk `setLocal` pose-sync and unindexed owner-lookup candidates; no speedup is claimed and immediate-read/ambiguity semantics must be preserved if investigated later. All subagents are stopped; do not start further work during the pause.

## User direction

Develop Neira as a prospective physical embodiment for AI-directed work, then develop the workshop around the actual parts and processes it needs. The user grants broad design freedom and wants to watch progress. They will open C:\Neira\scenes\neira.hash in their own Frame application. Keep that filename as the verified checkpoint and announce meaningful updates. They suggested subagents design independent parts while the main chat assembles; adopt this with declared datums/interfaces and separate file ownership.

Priorities: real engineering assumptions and evidence, native spline/Spline Patch/generator modeling, economical geometry/shared Instances/short names, core index.html performance, fix reproduced bugs, no Frame plugins (including Atomic), no authored polygons. Maintain source, embedded Doc and this handoff. Public repository https://github.com/mozg4D/Neira; later article is future work. No license has been selected.

## Verified revision 1

Canonical scene: scenes/neira.hash, 63,789 bytes; SHA256 c8751a111944cb762cb4400a6ef56c0d712458731324e1f1d6a80811e60aa036.

90 authored owners including groups/profiles;57 evaluated occurrences;24 replicas;33 independent position buffers;6,440 vertices/12,768 display triangles. Home envelope650x675x1450mm; base650x675x250mm. No authored mesh parts.

The two wrists now have a one-piece flanged Hub with integral20mm register and12mm service bore, integral mating cable Guide, a3x10 nominal pin and three nativeDIN912 M4x16 screws withDIN125 washers each. Pin is atR17/60deg; Mate has a5x3.2 radial slot. Both nativecages are ordinarily editable Spline Patches; standard hardware and repeated pieces share Instances. Locating boundaries use8arcs to keep source approximation below0.1micrometre; ordinary outlines use4arcs. ActualR10 bound9.99999699046..10.00004376280mm =>0.043763micrometre maximum radial error. This is source representation, not manufacturing qualification.

Native timeline0..180 moves8jointstudyframes;180..240 withdraws screws/washers,240..300 withdraws Guides. This is an exploded illustration, not a simulation of unscrewing or physical contact. Joint sliders editframe90. Four joints per arm do not establish a general6D tool workspace.

Build14checks and focused verification210checks passed on hardwareNVIDIA Turing/DPR1, no Frame plugin runtimes/browser/GPU errors/source drift. Checks cover full curve+axial walls, topology+nonzero triangles, source dimensions and8arc bound, actual hardware/bearing planes,6localØ10driver paths, pin/slot geometry, affine motion, UIcontrols/exploded ordering, exact immediatepreexport metadata/cages and compositeDoc/code persistence. Sourceboundary nominalclearance0 forregister/bore: H7/g6 offsets have not been applied to the nominal CAD shape; fit remains unqualified. Driver source-envelope separation>=1.99634856mm; otherheads>26mm. Shafttip axial overlap9.2mm, full-major envelopeoverlap8.885mm; these are not effective thread engagement. Modeled blindbottomgap4.8mm; proposed fullthreadendgap2.8mm.

No payload, strength, fatigue, whole-robot collision freedom, actuator/bearing sizing, fits, pin retention or physical manufacture is qualified. Hub rear attachment remains open. Most other body/joint components are packaging envelopes.

Baseline only:6fresh frames medianCPU1.40ms/GPU2.513ms at1280x900/DPR1. Build15.58s,coldopen691ms,reachseek92ms,export227ms,roundtripreopen494ms. These are actual samples, not comparisons with the smaller revision0 scene or promises for large factories.

## Sources and verification workflow

- src/model.js: native scene assembly. src/control.js: saved program/UI. src/parts/wrist-hub.js and cable-guide.js are separate pure cage factories; src/parts/index.js builds the JSON part set, src/interface.js owns shared dimensions and src/cad.js owns shared cubic helpers. All7srcJS files are hash-fenced.
- docs/Design.md + docs/Tool-interface.md in that order, joined by2newlines: canonical embeddedDoc.
- docs/Interface-loads.md: follow-up DRAFT, not embedded or a load qualification. It documents mass implications and separate bending/torsion cases; implement/recheck numerical artifact before treating arithmetic as current evidence.
- tools/build.mjs writes only work/candidate. tools/check.mjs checks candidate, sourcefences and currentcanonicalfingerprint; only a pass promotes canonicalHASH/publicartifacts. Failed candidates keep the prior canonical. Identical verified candidate publication avoids rewriting; observed external edits cancel promotion. Fingerprint+atomicrename is not a filesystemCAS against arbitrary concurrent writes.
- artifacts/build.json,verification.json,manifest.json bind actual source hashes and geometry. artifacts/neira.png,control.png,tool-assembled.png,tool-exploded.png were inspected.
- artifacts/refresh-comparison.json records controlled revision0 performance evidence, not a benchmark of revision1.

Set FRAME_ROOT=C:\Neira\work\frame for reproducibility; this clean detached checkout is atb19eaee0fb7a96fce00e4096d9b689a8d0c05a3e, with node_modules junction to C:\frame\node_modules. Do not update it while a source-fenced build/check is running. RequiredindexSHA60f65fb5f04d454da20b45dc6d73e413e5843a4db27bae1400364dcc2f86addf. More recent core changes need coordinated requalification.

## Frame work and ownership

C:\frame contains substantial unrelated userprinter/render/test changes. Inspect status before editing, stage only owned hunks, never discard or publish those unrelated diffs. Core fixes already selectively pushed and Pages-byteverified:

- a518c19: index AI objectreference resolution; actual10k reference regression uses10k slotchecks afterwarmup;13CPUchecks.
- c0e0350: typedobject bindings inScenePrograms, main/Worker/remapping/diagnostics;18CPU+13nativechecks.
- 52d86ea: core.refresh relies on render's existing sync;100refreshes→100syncs instead of200. The model separately removed an extra refresh after each transaction. Controlledrev0 comparison preserved75owners/cages/geometry/frames, removed84renders/168syncs;singlepaired timing12.147s→11.637s is not a generalappspeedup.

b19eaee is now selectively committed/pushed and Pages-byteverified: concurrent FrameSpline.flush observers no longer dirty the evaluator. CPU4checks and native9checks (also exactcommittedsource) prove8observers share1pass/1tree/2syncs, while a realrequest duringwork still produces2passes andfreshgeometry. Asyncerror/repair/selection/Undo remain correct. Prior8observer microcase31.8ms became15.4ms; no generalapplication speedup is claimed. Tests are tests/spline-flush-observers.mjs and tests/spline-flush-observers-browser.mjs. Nativeintegration210checks also passed onthiscore.

## Next project continuation

1. Part-agent/main-assembler extraction is implemented and passed integration. Pure factories use mating-face datumZ0/+Z; assembler places bothHub andGuide at wristZ+6, including Instances. Shareddimensions/cad/model/registry belong to the main assembler; individual part files have independent owners. Factories create no Frame scene, IDs or GPU data. No geometric variants beyond the default interface have been qualified.
2. Compared against591ca3a, allHub world sourcecontrols match exactly and Guide controls/handles differ by at most1.11e-16mm, with identical connectivity. Actuallocalcages areHubZ[-40,3], GuideZ[0,30]; all4placements+6 were observed through nativegeometry. Source/Doc/hardware/controls were rechecked, then canonicalfile promoted. The modular checkpoint was committed and pushed as bfc84c3.
3. Implement the draft load/mass worksheet with explicitvectors and units: gravity/sidepull ataxial100mm produce bending, notMz; a separateassumed3Nm tool-axis torque screens pin. Check signedforce/momentbalance independently. No strengthrating/material selection follows automatically.
4. Resolve pinseat/retention and design rear wrist support/bearings/actuator. CurrentHub~101.7cm3 is an interfaceblank, potentially~275g at illustrativeAl density; actual housing/rotor layout must drive hollowing. Define concrete tasks, mass and torque requirements before componentselection. Outdoor requirements and additional armDOF remain open.

## Viewing and processes

The user prefers opening the canonicalfile in their ownFrame. An IAB mainFrame tab also successfully loaded http://127.0.0.1:4317/index.html?scene=neira-work.hash (alias towork/interface-preview.hash). Only opening its SceneControlpopup was browser-policy blocked; don't retry thatblockedpopup. The independent developer browser tests may validate owned fixtures. The discarded captured-viewwatch tools were removed at the user's preference.

Read-only localserver tools/serve.mjs was restarted; execsession91705 served127.0.0.1:4317. Check actual listener before restarting. /neira.hash aliases the verifiedcanonical; /neira-work.hash aliases ignoredworkingpreview. Native Frame startup requires an allowed relative HASH filename; arbitrary /__neira/... querypaths fail 'Invalid scene filename'. No filesystemhost token or browser security changes were used.
