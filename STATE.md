# Neira state and handoff

Updated: 2026-11-17. Read this and docs/Design.md before continuing; verify notes against Git and the actual scene.

## Delivered checkpoint

Project: C:\Neira. Public repository: https://github.com/mozg4D/Neira.

First editable packaging/kinematic study is built and checked. It includes a flat-floor wheeled base, body, two four-joint study arms, a nominal manual tool-plate pair on each wrist, embedded Doc and Scene Control. It is not a complete robot design. No actuator, payload, structural strength, assembly tolerance, collision freedom or manufacturing readiness is claimed.

User requirements: develop Neira and the workshop that can make/maintain it; prioritize Frame core performance and index.html; fix encountered bugs; make clear architectural decisions, ask about disputed ones; report missing tools. No Frame plugins (including Atomic) and no polygon authoring. Use economical native splines/Spline Patches/generators, shared Instances, short names and minimal controls. Maintain canonical Doc and this handoff for replacement chats/models. The user concurrently works on printer/plugins in C:\frame: preserve their changes. Intended public article is future work; no article was posted.

## Canonical files

- src/model.js: reproducible native model construction, dimensional assumptions and exact native assembly frames.
- src/control.js: embedded managed program; 8 pose sliders, native timeline, Home/Pause/Play, inspection views. Sliders read saved pose keys; commands synchronize the frame control.
- docs/Design.md: exact source of embedded Doc, requirements, nominal geometry, parts/routes and open engineering issues.
- scenes/neira.hash: delivered editable scene, 47,410 bytes; SHA256 a118773887e4591e2c41c27a5feeded8406fb6476e83d5b1190e6cc6d8fe9924.
- artifacts/build.json, verification.json, manifest.json: actual source hashes, checks, geometry and timing evidence. artifacts/neira.png and control.png: inspected screenshots.
- tools/build.mjs and check.mjs: isolated hardware WebGPU build/verification at DPR1 with plugin-runtime request audit.

Actual home-pose body envelope: 650 x 675 x 1450 mm; base 650 x 675 x 250 mm, within the provisional 750 mm depth allowance. 75 authored owners including groups/profiles, 47 evaluated surfaces/occurrences, 14 replicas, 33 independent position buffers; 9,496 rendered triangles. These triangles are generated display geometry, not authored polygon parts.

## Frame dependency and core changes

Required Frame commit: c0e035050635ff7d8a75cd72bcb097de8bcc4bdc. Published index.html SHA256 9e4e94e3afcaa917164243d698ea1eb559cdb6a0ec9134cadec115ff6d32d00c. Both deployed index.html and frame-sw.js were compared byte-for-byte to Git after successful Pages deployments.

- a518c191743dc813b9b1e73aeff7377a5cf217c6: AI object-reference resolution reuses existing index. Focused actual-resolver regression: 10,000 mixed UI/native references require exactly 10,000 owner-slot checks after warmup; missing-reference behavior retained. 13 CPU checks and syntax passed. This establishes lookup complexity, not an overall app speedup.
- c0e035050635ff7d8a75cd72bcb097de8bcc4bdc: Scene Programs accepts typed object bindings alongside fields. Main/Worker contexts receive inert typed references, with native remapping and explicit unresolved/missing addresses. 18 plan CPU checks and 13 focused native browser checks passed, no plugins.

Both changes were selectively committed/pushed without the concurrent printer/rendering changes in C:\frame. Those unrelated changes remain there. Do not stage or discard them.

A clean detached validation checkout is at C:\Neira\work\frame; its node_modules junction points to C:\frame\node_modules. It is ignored project scratch, not a second product/editor. Set FRAME_ROOT to this checkout for reproducing this checkpoint. New public users need the required Frame commit or newer and its normal browser test dependencies.

## Verification completed

Build: 14 checks passed. Native scene verification: 61 checks passed on NVIDIA Turing, hardware WebGPU, 1280 x 900, DPR1; no Frame plugin runtimes, browser/GPU errors or source drift.

Verified exact source cages, embedded Doc/control source and object-reference persistence through HASH round-trip; all eight joint controls and native Play/Pause/Home; saved edited pose after popup reload; displayed frame after Home/Reach. Affine motion leaves local plate geometry unchanged. Geometry checks cover nominal plate 60 x 60 x 6 mm and each bore at both depths. Independent incidence/vertex-link audit finds one closed orientable manifold with five through-holes (genus 5), no boundary, nonmanifold edges, orientation mismatch or degenerate faces.

Baseline only: six fresh frames, median CPU 1.30 ms / GPU 0.641 ms. Completed operations: build 11.85 s, cold HASH open 592 ms, reach seek 80 ms, export 138 ms, round-trip reopen 357 ms. Consult raw reports for exact samples/environment; do not generalize these to a large factory or promise an end-to-end speedup.

The in-app browser displayed the robot during authoring. Its protection blocked opening the Scene Control popup; no workaround was attempted. Control behavior was verified by the independent development tests. The visible authoring tab was an intermediate session; use the delivered HASH as authoritative. A local read-only development server was started on 127.0.0.1:4317 (tools/serve.mjs); check whether it is still running before starting another.

## Next useful engineering work

1. Define concrete workshop manipulation tasks, tool loads, required reach/orientation, allowable mass and energy assumptions. Four joints per arm are a kinematic demonstrator; general tool orientation needs a task-driven DOF review.
2. Complete one real wrist/tool interface: choose fasteners, pilot/pin fit and engagement, actual tool and assembly access, tolerances, retention/load path and purchased component references. Current geometry has nominal bores and a tool ring; no male pilot, pins or fasteners are installed and no automatic lock is claimed.
3. Choose one actuator/transmission/bearing architecture from those requirements and develop its mounts and load path. Drive/caster/joint volumes remain packaging envelopes. Head is also a solid packaging envelope.
4. Extend complexity through actual necessary parts; measure completed-operation latency before/after relevant core fixes. Add workshop equipment when a robot part/process justifies it.
5. Define outdoor terrain/environment/recovery requirements before choosing alternative locomotion. Select a public redistribution license with the user; currently none is granted.

Before editing: inspect status in both repositories, read owning Frame contracts, preserve user work. Keep source, saved HASH and embedded Doc synchronized; canonical source changes need rebuilding and affected verification. Do not run general/full suites or Frame plugins without a new user request.
