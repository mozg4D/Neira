# Neira

Neira is an engineering study of a mobile, two-arm robot and the workshop that could manufacture, assemble and maintain it. The robot is the reason for the workshop: each part should have an explicit manufacturing or purchasing route.

The first iteration is an editable packaging and kinematic model in [Frame](https://github.com/mozg4D/frame). It explores a wheeled body, two arms and a provisional manual tool interface. Mechanical strength, actuator sizing, stability, control hardware and manufacturing tolerances remain open engineering work.

![Neira revision 0 in Frame](artifacts/neira.png)

## Start here

- [Design](docs/Design.md): intent, dimensions, interfaces, decisions and verification boundaries. This is the canonical design text for the scene's Doc.
- [State](STATE.md): current artifacts, evidence, outstanding work and the next continuation step.
- [Working instructions](AGENTS.md): modeling, performance and collaboration rules.

The native scene uses Frame's Spline Patches, profiles, generators and Instances. [Model source](src/model.js) constructs the robot; [Scene Control source](src/control.js) exposes eight commanded joints and a reproducible timeline. The native scene is saved as `scenes/neira.hash`. Authored source, parameters and verification records belong alongside the scene so another person or a later AI model can continue the work.

## Run locally

Use Node.js 22 or later and a local Frame checkout at commit `c0e035050635ff7d8a75cd72bcb097de8bcc4bdc` or newer, with its browser/test dependencies installed. This version adds the object bindings used by Neira. `FRAME_ROOT` defaults to `C:\frame`; set it to your checkout when needed. The verification workflow uses hardware WebGPU at DPR 1 and loads no Frame plugins.

From the Neira directory:

```powershell
$env:FRAME_ROOT = 'C:\frame'
npm run serve
```

Open [the local Frame session](http://127.0.0.1:4317/index.html) and load `scenes/neira.hash`. Open Scene Control to exercise the home pose, reach pose, playback and individual joint controls. `NEIRA_PORT` changes the server port if 4317 is occupied.

Build and verify in separate isolated browser sessions:

```powershell
npm run build
npm run check
```

The build regenerates the editable scene and embeds the current Design text and control source. Reports are written under `artifacts/`; inspect their current results before treating the scene as verified. These checks cover native authoring, geometry, persistence and commanded motion. Mechanical and manufacturing qualification remain open.

The initial checkpoint passes 14 build and 61 verification checks. It contains 75 authored owners and 9,496 generated display triangles; its home envelope is 650 × 675 × 1450 mm. The manual plate is verified as a closed surface with five through-holes. See [verification evidence](artifacts/verification.json) and [continuation state](STATE.md) for scope and remaining work.

This repository is intended for public development and a later article. A redistribution license has not yet been selected.
