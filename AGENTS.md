# Neira working instructions

## Resume

Read `STATE.md`, `docs/Design.md` and `docs/Tool-interface.md` before continuing. Inspect the current model source and Git status; saved notes are context, not proof of current geometry or behavior. Keep the files and the scene's embedded Doc consistent at each delivered checkpoint. The canonical embedded Doc combines `docs/Design.md` followed by `docs/Tool-interface.md`, in that order. Rebuild the HASH and verify this exact composite after either source changes. Record actual files, commands, outcomes and the next useful step in `STATE.md`.

## Engineering

- Develop a mobile two-arm robot and the equipment needed to manufacture and maintain it. The first body uses wheels on a flat workshop floor. Outdoor capability and alternative locomotion remain future design questions.
- Separate assumed dimensions, derived geometric checks, calculated behavior and physical validation. Give assumptions and unresolved interfaces names. Do not describe a visual animation as a load, collision, stability or manufacturing validation.
- Make each component's function, assembly access and intended manufacturing or purchasing route explicit. Treat purchased motors, bearings, electronics, sensors and other components as external dependencies until real selections are made.
- Take clear architectural decisions and record their reason. Ask the user about genuinely disputed decisions. Report a missing tool with the concrete operation it prevents.
- Preserve aesthetics as a design requirement: coherent proportions, readable assembly and deliberate visible details.

## Modeling and performance

- No polygonal modeling, authored mesh parts, mesh conversion or hidden mesh substitutes. Use native Spline Patches, splines, profiles and supported parametric generators; retain their editable source.
- No Frame plugins, including Atomic. Do not add a physics or manufacturing plugin dependency to the model or verification.
- Use the fewest controls, objects and sampling subdivisions that preserve the required geometry. Retain real features and interfaces. Reuse Instances for repeated parts. Keep object names short and organize meaning in the hierarchy and Doc.
- Distinguish source-curve approximation, rendered tessellation and manufacturing tolerance. Use independently checked source accuracy for locating features; a visually round bore or mesh bound cannot qualify a fit. Suppress detailed thread helices while preserving explicit manufacturing/thread intent.
- Use Scene Control for joint controls, reproducible sequences and inspection views. Separate commanded motion, geometric observations and validated mechanics in its labels and reports.
- Measure performance on the actual scene and record the source revision and environment. Use completed-operation timings for creation, rebuild, selection, transformation, Undo and HASH round-trip where relevant. Preserve a reproducible baseline before claiming an improvement.
- Frame core improvements belong in `C:\frame\index.html` and its affected tests/docs; read that checkout's `AGENTS.md` and inspect concurrent changes first. Preserve unrelated user work. Focus on the smallest relevant change and default to DPR 1 with no plugins. Full/general verification needs the user's explicit request.
- Use isolated scene/browser sessions for development and tests. Do not replace the user's printer scene or working tabs.

## Publication

Keep the public repository free of secrets, machine-specific credentials and unrelated personal files. Publish checked artifacts and honest evidence. Preserve third-party source and license attribution. The project license is pending; do not describe the repository as licensed open source until a license has been selected.
