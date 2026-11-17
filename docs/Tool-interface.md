# Manual tool interface — engineering proposal

Revision 1. Status: native geometry, source accuracy, local driver approaches, persistence and commanded assembly inspection are checked. Manufacturing fits, materials, pin retention, loads and physical qualification remain open. Dimensions are millimetres. Coordinates below are local to the wrist, with +Z toward the tool. Catalogue examples establish geometry, not a selected supplier, material grade, purchase or load rating.

## Architecture and location

Replace the separate wrist cylinder and plate with one turned flanged hub: Ø58 body at Z = −34…0, Ø60 flange at 0…6, integral Ø20 register at 6…9, and continuous Ø12 service bore. The mating tool has a Ø60 × 6 plate at 6…12 with a Ø20 register bore. Its integral guide extends from Z = 12…36: outer radius 13 at 12 tapers to 9 at 35.5; inner radius 10 tapers to 6 over the same span. Mouth chamfers end at outer radius 8.5 and inner radius 6.5 at 36. This retains a nominal continuous Ø12 minimum passage. Rear actuator attachment remains unresolved.

The register locates the mating tool laterally; flange-face contact establishes axial seating. Candidate register fit is Ø20 H7/g6 for removable location, following the clearance-fit classes in [MISUMI's fit-selection reference](https://in.misumi-ec.com/pdf/fa/2014/p1_2287.pdf). This is a proposed drawing callout, not an achieved fit. Current register/bore source boundaries are congruent nominal Ø20 shapes with zero nominal diameter clearance; manufacturing-fit offsets are not represented. Surface finish, lead-in, root clearance, concentricity, temperature and inspection must be specified before release.

Place one Ø3 locating pin at radius 17, angle 60°: X = 8.5, Y = 14.722432. Replace the mate's second round hole with a radial slot of nominal width 3.2 and overall length 5. Its long axis follows the radius. The slot begins at radius 14.5, leaving 1.5 nominal ligament to the guide's radius-13 base; the earlier radius-15 position would intersect that base. The central register constrains lateral position and the pin/slot clocks the tool while allowing radial pitch error. This applies the one-axis secondary-location principle described by [Carr Lane](https://www.carrlane.com/product/locating-pins/locating-pins/round-diamond-pins/diamond-pins); the radial slot is Neira's design choice, not their product.

Nominal pin/slot free clocking is approximately ±(3.2 − 3)/(2 × 17) radians = ±0.337°. This ignores the remaining fit and positional tolerances and is not a repeatability bound. It suits the proposed coarse guide study; precision tool registration would need revision.

## Purchased geometry references

| Item | Nominal reference geometry | Proposal |
| --- | --- | --- |
| Socket screw | M4 × 16, pitch 0.7, fully threaded; head Ø7 × 4; 3 mm hex socket | Three, entering from the tool side; [Accu DIN 912 / ISO 4762 example](https://www.accu.co.uk/metric-cap-head-screws/3841-SSCF-M4-16-A2) |
| Flat washer | M4 Form A: ID 4.3, OD 9; use 0.8 for nominal layout | Three under the heads; [Accu DIN 125 example](https://www.accu.co.uk/metric-flat-washers/72488-HPW-M4-A2) specifies thickness 0.9 with −0.2 tolerance, so check the actual selected washer |
| Locating pin | Ø3 × 10, ISO 2338a, diameter class m6; example actual diameter 3.002…3.008 | Nominal embedment 7 and projection 3, from Z = −1…9; [Accu pin reference](https://www.accu.co.uk/dowel-pins/394893-HDP-3-10-V1-A1) |
| Hex nut, rejected arrangement | M4 DIN 934; 7 across flats, height 3.2, pitch 0.7 | Geometry reference only; not included in selected architecture; [Accu nut reference](https://www.accu.co.uk/hexagon-nuts/7890-HPN-M4-A2) |

The pin's seat and retention are unresolved. An H7 hole with an m6 pin is a transition combination and does not guarantee retention. Select the fixed-seat fit or another explicit retention method after hub material, assembly force and replacement access are decided. The slot is a clearance feature, not the fixed seat.

## Fastening and access

Use three M4 tapped blind holes on radius 20 at 0°, 120° and 240°. The mate retains Ø4.5 clearance bores. The intended full-thread region in the hub runs from Z = 6 to −6. For cut M4 × 0.7 threads, [Guhring's tapping-hole chart](https://guhring.com/media/support/Tapping-Size-Holes-For-Thread-Cutting.pdf) gives a 3.30 mm predrill. The source represents the blind hole as a simplified Ø4 cylinder to Z = −8, including a runout/tool-space allowance. It denotes a suppressed thread envelope, not a manufacturing clearance bore or a literal predrill profile. No helical thread detail is authored for this study.

With a 6 mm mate and nominal 0.8 mm washer, the M4 × 16 screw's under-head plane is Z = 12.8 and its measured tip is −3.2. The checked nominal overlap is 9.2, while the full-major cylindrical shaft envelope overlaps by 8.885 after the tip detail. The modelled blind bottom at −8 leaves 4.8 clearance to the tip; the proposed full-thread end at −6 leaves 2.8. These are envelope measurements, not effective engaged threads. Washer thickness alone in the cited 0.7…0.9 range changes nominal penetration to 9.3…9.1. Entry chamfers, thread runout, screw length, plate and other tolerances remain to be stacked.

Reserve additional straight predrill depth for the chosen tap's lead and chip clearance, then drill-point space. A candidate reservation is straight predrill to Z = −8 and a drill point to about −9; this must be checked against the actual tool. Full thread depth, tap travel, straight drill depth and point depth are separate dimensions. [Guhring's blind-hole tap example](https://guhring.com/media/tools/803.pdf?version=061520110035) lists a 2–3-pitch chamfer, illustrating why extra depth is needed.

Provide straight 3 mm hex-key access from +Z. Use a Ø10 approach cylinder around each screw axis. Against the guide's nominal radius 13, the simple layout gap is 20 − 5 − 13 = 2. Conservative checks against the evaluated guide and bounded ruled source give a clearance bound of approximately 1.99634856 on all six front approaches; other screw heads leave more than 26.14. The Ø9 washer has 2.5 nominal clearance to the guide and 5.5 to the flange edge. This verifies the local round approach envelope, not a selected driver's body, socket engagement, the whole robot, hand access or physical tightening.

Ordinary rear nuts would occupy the Ø58 wrist body and require rear spanner access. Captured nuts could remove the spanner need but add pockets, retention and assembly sequencing. Direct tapped holes avoid both issues in this first manual interface. Thread stripping, preload and loosening still require design work. [Nord-Lock](https://www.nord-lock.com/en-au/learnings/bolting-tips/2015/the-experts-thread-engagement-in-a-tapped-hole/) gives approximate engagement guidance of 1d in steel and 2d in aluminium while explicitly warning that material-dependent calculations can require more; nominal 9.2 mm penetration does not qualify this joint.

## Manufacturing and assembly study

The candidate low-part-count route uses turning and drilling/milling rather than metal printing for these predominantly axisymmetric parts. Turn the hub, flange, register and service bore from one round blank with machining allowance. Establish the register, mating face and bore from a controlled datum setup. Drill/tap the bolt circle and finish the pin seat using an indexed fixture or CNC. Turn the integral mate/guide, finish its register bore, then drill clearance holes and mill the radial slot. Material, tooling, setups, finishes and inspection cost remain to be selected; no price advantage has been measured.

Break cable-contact edges and provide compatible register lead-in/root relief. Define these edge details before manufacturing. Install and check the fixed pin, route the dummy cable, seat the mate over the register and pin, then install the three screws/washers from +Z. Torque, tightening sequence and reuse/locking policy are not released. The rear actuator connection is a separate required design task.

## Real first function and unverified load cases

The first tool is a passive guide for a de-energized dummy cable, provisionally Ø8 or smaller, through the wrist's Ø12 minimum service passage. The integral guide gives a replaceable cable-entry surface. Verify cable insertion, seating, edge contact and removal on a physical sample before assigning a cable bend radius or service life. No clamping, powered tool process or precision placement is claimed.

Native checks find each evaluated Hub/Guide to be one closed orientable surface with no boundary/nonmanifold edges, orientation mismatch, invalid vertex links or zero-area faces. Eight-arc locating boundaries meet their 0.1 µm source-radius budget with a conservative maximum deviation of 0.043763 µm at nominal radius 10. These are representation/topology results, not manufacturing-fit or self-intersection qualification. At animation frame 240, fasteners have withdrawn while guides remain seated; frame 300 separates each guide by 60 and the fasteners by 110 on its actual wrist axis, retaining the hub and pin. This is exploded inspection, with no simulated screw rotation or physical disassembly.

For later calculations only, define a study case of 0.5 kg combined tool/cable mass with its centre 100 mm from the mating face: gravity force 4.905 N and worst perpendicular static moment 0.4905 N·m. A separate provisional 30 N side pull at 100 mm gives 3 N·m. These are assumed test inputs, not measured loads, allowed working loads or a proof of strength. Material, acceleration, cable snagging, fastener preload, friction, pin load sharing, fatigue and joint stiffness remain open.
