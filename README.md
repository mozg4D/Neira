# Neira

Neira is an engineering study of a mobile, two-arm robot and the workshop that could manufacture, assemble and maintain it. The robot is the reason for the workshop: each part should have an explicit manufacturing or purchasing route.

The first iteration is an editable packaging and kinematic model in [Frame](https://github.com/mozg4D/frame). It explores a wheeled body, two arms and a provisional manual tool interface. Mechanical strength, actuator sizing, stability, control hardware and manufacturing tolerances remain open engineering work.

![Neira body study in Frame](artifacts/neira.png)

## Start here

- [Design](docs/Design.md): intent, dimensions, interfaces, decisions and verification boundaries.
- [Tool interface](docs/Tool-interface.md): hub/register, mating cable guide, referenced hardware, manufacturing study and open fit/load questions. Embedded Doc combines Design and Tool interface in this order.
- [State](STATE.md): current artifacts, evidence, outstanding work and the next continuation step.
- [Working instructions](AGENTS.md): modeling, performance and collaboration rules.

The native scene uses Frame's Spline Patches, profiles, generators and Instances. [Model source](src/model.js) constructs the robot; [Scene Control source](src/control.js) exposes eight commanded joints and a reproducible timeline, including an exploded manual-tool interface. The authoritative editable scene is `C:\Neira\scenes\neira.hash`: open this file directly in your own Frame application. Authored source, parameters and verification records belong alongside it so another person or a later AI model can continue the work.

Part agents develop the [wrist hub](src/parts/wrist-hub.js) and [cable guide](src/parts/cable-guide.js) in separate pure factories. The main assembler owns [shared dimensions](src/interface.js), [cage helpers](src/cad.js) and [part collection](src/parts/index.js), then creates and verifies the complete Frame assembly. Parts use millimetres, a mating face at local Z = 0 and normal +Z; both current datums are placed at wrist Z = +6. All source JavaScript is included in the build/verification hash fence.

## Run locally

Use Node.js 22 or later and a local Frame checkout at commit `b19eaee0fb7a96fce00e4096d9b689a8d0c05a3e` or newer, with its browser/test dependencies installed. This baseline includes Neira's required object bindings and avoids redundant refresh passes when concurrent observers settle. `FRAME_ROOT` defaults to `C:\frame`; set it to your checkout when needed. The verification workflow uses hardware WebGPU at DPR 1 and loads no Frame plugins.

From the Neira directory:

```powershell
$env:FRAME_ROOT = 'C:\frame'
npm run serve
```

For an optional local Frame session, open [Frame on port 4317](http://127.0.0.1:4317/index.html) and load the canonical file. The server also exposes a read-only [neira.hash download alias](http://127.0.0.1:4317/neira.hash). Open Scene Control to exercise the home pose, reach pose, exploded tool, playback and individual joint controls. `NEIRA_PORT` changes the port if 4317 is occupied.

Build and verify in separate isolated browser sessions:

```powershell
npm run build
npm run check
```

Build creates a candidate under `work/candidate/`, embedding the composite Design + Tool-interface text and control source. It leaves the canonical scene in place. Check verifies the candidate, checks the canonical file's saved fingerprint, then promotes through an atomic file replacement and publishes reports under `artifacts/`. An observed external change to the canonical file blocks promotion. Inspect report results and source hashes before treating a scene as verified. The checks cover native authoring, geometry, persistence and commanded motion; mechanical and manufacturing qualification remain open.

The current revision-1 part-factory checkpoint passed build and focused native checks, with 90 authored owners, 57 evaluated surface occurrences, 24 replicas, 33 independent position buffers and 12,768 generated display triangles. It checked the hub/register, cable guide, hardware stacks, six local front driver approaches, native persistence, eight joint controls and ordered exploded view. Separate factories and their assembly datums have passed native integration checks. See [verification evidence](artifacts/verification.json) and [continuation state](STATE.md) for exact source revisions, scope and remaining engineering work. Fits, pin retention, material/grade selection, payload and physical manufacture remain unqualified.

This repository is intended for public development and a later article. A redistribution license has not yet been selected.
