# v38-T1-C2 final archive restoration check

Result: **PASS for archival recovery and documented native checkpoint identity**, not production approval.

A separately retained project archive was restored into a fresh directory. The extracted native scene, not a pre-existing working copy, was reopened with unchanged Frame commit `2375c4ae3d66ecd6b7154419767d85f7af8d4d10`.

- Archive: 132532297 bytes, 3242 entries, SHA256 `ea14b3dc1e31c10ea476dce17035f28909976dfbc326d25a332f9020aa8436fe`; archive remained unchanged.
- Public scene: `scenes/rigid-finger-v38-T1-C2.hash`, 146545 bytes, SHA256 `7905bc6c5fe4e0c91318749d9a3b10d5d19012ad28711e9b3bcf7522f70ae199`.
- Exact embedded/public documentation: `docs/Rigid-finger-v38-T1-C2.md`, 6646 UTF-8 bytes, SHA256 `42edf7d0b9ef252dbc7652578162e24e203ae6686aba51e27105855ce75acc9b`.
- All 200 evaluated geometry hashes matched. At native frames 0 and 90, 200 object world matrices were compared: maximum entry differences 1.1102230246251565e-16 and 7.105427357601002e-15 respectively. These are numerical identity checks, not bit-exact matrices or formal interval proofs.
- Four native views of the extracted copy were visually inspected. No model was saved or changed by the recovery test.

The preceding documentation-only finalization separately checked 200 geometry hashes across seven stages and 322 node matrices at five poses. Its corrected padded local-AABB displacement estimate is 2.3517834084649375e-14 mm, below the stated 1e-9 mm numerical guard; matrix-entry guard is 1e-12. Initial strict matrix-equality failure and superseded bound evidence were retained in the project archive, not silently discarded.

This public package contains the editable native checkpoint, documentation, concise evidence and images. It does not contain the complete scripted rebuild archive. Recovery success does not cure known overlapping microtriangles, certify continuous collision freedom, global wall thickness, manufactured fits, strength, wear or safety. See the checkpoint document and verification receipt for those limits.
