# Neira state and handoff

Updated: 2026-11-17. Goal remains ACTIVE: continue until the user explicitly asks to stop. Do not mark the overall project complete at a checkpoint.

## User direction

Develop Neira as a prospective physical embodiment for AI-directed work, then develop the workshop around the actual parts and processes it needs. The user grants broad design freedom and wants to watch progress. They will open C:\Neira\scenes\neira.hash in their own Frame application. Keep that filename as the verified checkpoint and announce meaningful updates. They suggested subagents design independent parts while the main chat assembles; adopt this with declared datums/interfaces and separate file ownership.

Priorities: real engineering assumptions and evidence, native spline/Spline Patch/generator modeling, economical geometry/shared Instances/short names, core index.html performance, fix reproduced bugs, no Frame plugins (including Atomic), no authored polygons. Maintain source, embedded Doc and this handoff. Public repository https://github.com/mozg4D/Neira; later article is future work. No license has been selected.

## Verified revision 1

Canonical scene: scenes/neira.hash, 62,654 bytes; SHA256 55a9074b180b5d7eb02121b30d168a325dae0a8f036459106fcec5047608159b.

90 authored owners including groups/profiles;57 evaluated occurrences;24 replicas;33 independent position buffers;6,440 vertices/12,768 display triangles. Home envelope650x675x1450mm; base650x675x250mm. No authored mesh parts.

The two wrists now have a one-piece flanged Hub with integral20mm register and12mm service bore, integral mating cable Guide, a3x10 nominal pin and three nativeDIN912 M4x16 screws withDIN125 washers each. Pin is atR17/60deg; Mate has a5x3.2 radial slot. Both nativecages are ordinarily editable Spline Patches; standard hardware and repeated pieces share Instances. Locating boundaries use8arcs to keep source approximation below0.1micrometre; ordinary outlines use4arcs. ActualR10 bound9.99999699046..10.00004376280mm =>0.043763micrometre maximum radial error. This is source representation, not manufacturing qualification.

Native timeline0..180 moves8jointstudyframes;180..240 withdraws screws/washers,240..300 withdraws Guides. This is an exploded illustration, not a simulation of unscrewing or physical contact. Joint sliders editframe90. Four joints per arm do not establish a general6D tool workspace.

Build14checks and focused verification208checks passed on hardwareNVIDIA Turing/DPR1, no Frame plugin runtimes/browser/GPU errors/source drift. Checks cover full curve+axial walls, topology+nonzero triangles, source dimensions and8arc bound, actual hardware/bearing planes,6localØ10driver paths, pin/slot geometry, affine motion, UIcontrols/exploded ordering, exact immediatepreexport metadata/cages and compositeDoc/code persistence. Sourceboundary nominalclearance0 forregister/bore: H7/g6 offsets have not been applied to the nominal CAD shape; fit remains unqualified. Driver source-envelope separation>=1.99634856mm; otherheads>26mm. Shafttip axial overlap9.2mm, full-major envelopeoverlap8.885mm; these are not effective thread engagement. Modeled blindbottomgap4.8mm; proposed fullthreadendgap2.8mm.

No payload, strength, fatigue, whole-robot collision freedom, actuator/bearing sizing, fits, pin retention or physical manufacture is qualified. Hub rear attachment remains open. Most other body/joint components are packaging envelopes.

Baseline only:6fresh frames medianCPU1.40ms/GPU2.490ms at1280x900/DPR1. Build15.60s,coldopen699ms,reachseek91ms,export222ms,roundtripreopen600ms. These are actual samples, not comparisons with the smaller revision0 scene or promises for large factories.

## Sources and verification workflow

- src/model.js: native scene assembly and current inlinepartcages. src/control.js: saved program/UI.
- docs/Design.md + docs/Tool-interface.md in that order, joined by2newlines: canonical embeddedDoc.
- docs/Interface-loads.md: follow-up DRAFT, not embedded or a load qualification. It documents mass implications and separate bending/torsion cases; implement/recheck numerical artifact before treating arithmetic as current evidence.
- tools/build.mjs writes only work/candidate. tools/check.mjs checks candidate, sourcefences and currentcanonicalfingerprint; only a pass promotes canonicalHASH/publicartifacts. Failed candidates keep the prior canonical. Identical verified candidate publication avoids rewriting; observed external edits cancel promotion. Fingerprint+atomicrename is not a filesystemCAS against arbitrary concurrent writes.
- artifacts/build.json,verification.json,manifest.json bind actual source hashes and geometry. artifacts/neira.png,control.png,tool-assembled.png,tool-exploded.png were inspected.
- artifacts/refresh-comparison.json records controlled revision0 performance evidence, not a benchmark of revision1.

Set FRAME_ROOT=C:\Neira\work\frame for reproducibility; this clean detached checkout is at52d86eaea4f447ca93defce0f16a59c684d26a18, with node_modules junction to C:\frame\node_modules. Do not update it while a source-fenced build/check is running. RequiredindexSHA9da129ee88adfe34d384eb5c4185e3e25e826876527d336a16de7ab2a7316430. More recent core changes need coordinated requalification.

## Frame work and ownership

C:\frame contains substantial unrelated userprinter/render/test changes. Inspect status before editing, stage only owned hunks, never discard or publish those unrelated diffs. Core fixes already selectively pushed and Pages-byteverified:

- a518c19: index AI objectreference resolution; actual10k reference regression uses10k slotchecks afterwarmup;13CPUchecks.
- c0e0350: typedobject bindings inScenePrograms, main/Worker/remapping/diagnostics;18CPU+13nativechecks.
- 52d86ea: core.refresh relies on render's existing sync;100refreshes→100syncs instead of200. The model separately removed an extra refresh after each transaction. Controlledrev0 comparison preserved75owners/cages/geometry/frames, removed84renders/168syncs;singlepaired timing12.147s→11.637s is not a generalappspeedup.

Next proven core candidate (agent frame_perf_audit): FrameSpline.flush marksdirty when observers joinrunningwork;1observer caused1pass/1tree vs8observers2passes/2trees. Minimalfix removes only waiter dirtyassignment, leavingrequest() invalidations andallactualpass treepublication intact. Agent tasked to implement+focusedregress actualeditsduringwork,errorrepair/Undo, preserveuserdiffs andselectivelypublish. Check its current status before editing samecode.

## Next project continuation

1. Publish this verifiedrevision1 checkpoint if not yet pushed; Git/report hashes are authoritative.
2. Apply the user's part-agent/main-assembly workflow. Extract pure nativecage factories forHub andGuide into separate owned modules with a sharedCADhelper and explicitlocalmountingdatum. Main owns sceneassembly, partplacement, material reuse, programs and integration. Freeze interfacecoordinates first; modules must create no globalFrame objects or scenes. Verify worldgeometry and sourcefidelity after refactoring, not just moduleunitchecks.
3. Implement the draft load/mass worksheet with explicitvectors and units: gravity/sidepull ataxial100mm produce bending, notMz; a separateassumed3Nm tool-axis torque screens pin. Check signedforce/momentbalance independently. No strengthrating/material selection follows automatically.
4. Resolve pinseat/retention and design rear wrist support/bearings/actuator. CurrentHub~101.7cm3 is an interfaceblank, potentially~275g at illustrativeAl density; actual housing/rotor layout must drive hollowing. Define concrete tasks, mass and torque requirements before componentselection. Outdoor requirements and additional armDOF remain open.

## Viewing and processes

The user prefers opening the canonicalfile in their ownFrame. An IAB mainFrame tab also successfully loaded http://127.0.0.1:4317/index.html?scene=neira-work.hash (alias towork/interface-preview.hash). Only opening its SceneControlpopup was browser-policy blocked; don't retry thatblockedpopup. The independent developer browser tests may validate owned fixtures. The discarded captured-viewwatch tools were removed at the user's preference.

Read-only localserver tools/serve.mjs was restarted; execsession91705 served127.0.0.1:4317. Check actual listener before restarting. /neira.hash aliases the verifiedcanonical; /neira-work.hash aliases ignoredworkingpreview. Native Frame startup requires an allowed relative HASH filename; arbitrary /__neira/... querypaths fail 'Invalid scene filename'. No filesystemhost token or browser security changes were used.
