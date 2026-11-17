# Interface mass and load worksheet — draft

Status: analytic screening proposal for a later calculation artifact. This document is not part of the currently fenced embedded Doc. It changes no geometry and provides no working-load rating, safety factor or flange qualification. Loads and support assumptions below are explicit study inputs, not measurements from a real robot.

## Hub mass is a design issue

The current native-geometry audit supplied an approximate volume of 101,669 mm³ for one integrated Hub. This worksheet uses that input; the later artifact must read/pin the actual geometry report and source revision rather than treat the number as permanent. Evaluated tessellation and source approximation contribute uncertainty to volume.

[Kaiser Aluminum's 6061 rod/bar data](https://online.kaiseraluminum.com/depot/PublicProductInformation/Document/1025/Kaiser_Aluminum_6061_Rod_and_Bar.pdf) gives a nominal density of 2.70 Mg/m³, equivalent to 2.70 g/cm³. At that illustrative density:

```text
V = 101669 / 1000 = 101.669 cm³
m_one = 101.669 × 2.70 = 274.5063 g ≈ 275 g
m_two = 549.0126 g ≈ 549 g
```

This selects no alloy or temper. The same producer lists typical T6/T651 rod/bar yield of 276 MPa; it is a product-reference value, not a minimum certified property or an allowable used here. It must not be applied to the unselected locating-pin or screw material.

The Ø58 body with a Ø12 passage and 34 mm length alone has an ideal annular volume of about 85,985 mm³ before local bores. Most of the present hub is consequently solid stock around a small service passage. It remains an interface blank with unresolved rear support, not a completed actuator/bearing housing. Two such hubs would already contribute about 0.55 kg at the reference density, before guides, hardware, bearings or motors.

The next mass-reduction decision must follow a bearing/shaft/actuator layout: define support lands, bearing spacing, rear attachment, cable path, thread-seat webs and load paths, then design the cavity. Removing stock by appearance alone would conceal those missing requirements. Hub self-weight and inertia must enter the later arm mass model at their own centres; the separate 0.5 kg tool case below does not include them.

## Axes, cases and factors

Use the assembled mating face as the load reference. +Z points from wrist to tool, X/Y lie in the flange plane. Positions are in mm, forces in N, moments in N·mm. Compute moments as `M = r × F`.

| Case | Inputs | Resultant moment | Intended screening |
| --- | --- | --- | --- |
| G: tool gravity | m = 0.5 kg; assumed g = 9.80665 m/s²; r = [0, 0, 100]; F = [0, −4.903325, 0] | [490.3325, 0, 0] | Flange bending / bolt axial increments |
| S: side pull | r = [0, 0, 100]; F = [30, 0, 0] | [0, 3000, 0] | Flange bending / bolt axial increments |
| T: separate tool-axis torque | F = [0, 0, 0]; prescribed M = [0, 0, 3000] | [0, 0, 3000] | Pin/register torque-couple screening |

Cases G and S have no Mz. Their bending moments must not be converted to pin force by dividing by the pin radius. Case T is a separately assumed pure torque; it is not derived from either axial-offset force case or from the currently modeled cable guide.

Numbers below use load multiplier 1.0, with no dynamic, impact, fatigue, uncertainty or safety factors. Reversing force or torque reverses the corresponding signs. Cases are evaluated separately; no simultaneous combined-load case is claimed.

## Ideal three-bolt bending distribution

Use three bolt axes on radius R = 20 at angles 0°, 120° and 240°, ordered as follows:

```text
(x_i, y_i) = [(20, 0), (−10, +17.320508), (−10, −17.320508)] mm
I_g = Σx_i² = Σy_i² = 600 mm²;  Σx_i y_i = 0
ΔF_i = Fz/3 + (Mx y_i − My x_i)/I_g
orientation envelope for bending: max |ΔF_i| ≤ 2 |M_b|/(3R)
|M_b| = sqrt(Mx² + My²)
```

This signed, equal-stiffness axial-group model transfers the bending moment into bolt force increments without credit for member stiffness. It assumes rigid flanges and no prying. Preload and contact make the real joint response different. A negative increment is an unloading contribution, not a bolt pushing in compression or an absolute negative clamp force. The full joint needs a contact/preload model to establish actual bolt tensions and separation.

| Case | ΔF at 0°, 120°, 240° (N) | Largest absolute increment (N) | Orientation envelope (N) |
| --- | --- | ---: | ---: |
| G | [0, +14.15468, −14.15468] | 14.15468 | 16.34442 |
| S | [−100, +50, +50] | 100 | 100 |

For a nominal M4 coarse thread, [Bossard's ISO 898-1 table](https://media.bossard.com/global-en/-/media/bossard-group/website/documents/technical-resources/en/f-004-en.pdf) gives stress area As = 8.78 mm². Dividing the largest absolute increments by that area gives 1.612 MPa for G and 11.390 MPa for S. These are ideal incremental axial stresses, excluding preload and tightening torsion. No screw class, allowable stress or factor of safety is selected.

The transverse forces in G/S still require a load path through face friction, the central register, hardware or another constraint. The axial bolt calculation does not resolve that load sharing or qualify shear/slip resistance. The pure torque in T is not an input to this bending formula.

## Pin screening for case T only

Assume the entire prescribed torque bypasses face friction and is carried by a tangential pin force at radius Rp = 17, balanced by an opposite lateral resultant at the central register. This creates the required torque couple. It is a chosen allocation, not a measured reaction or a dynamic upper bound.

Model a circular pin with d = 3, projection L = 3 and uniform side load over that projected engagement. The pin is rigidly supported at the flange face; the resultant acts at e = L/2 = 1.5. Ignore clearance impacts, end chamfers, root flexibility, seat retention and stress concentration for this nominal calculation.

```text
F_pin = |Tz|/Rp = 3000/17 = 176.47059 N
A_pin = πd²/4 = 7.068583 mm²
average single-shear stress = F_pin/A_pin = 24.965 MPa
nominal projected bearing pressure = F_pin/(d L) = 19.608 MPa
root bending moment = F_pin e = 264.70588 N·mm
outer-fibre bending stress = 32 F_pin e/(πd³) = 99.862 MPa
```

Bearing pressure uses the assumed 3 mm engagement in the mate's slot, not the full 6 mm plate thickness or the pin's 7 mm nominal embedment. Real end chamfers may reduce effective engagement; edge loading and fit alter the pressure distribution. Average shear and maximum outer-fibre bending occur with different stress distributions, so the two values are not naively combined into a yield ratio. Pin material and condition remain unselected.

## What this does not qualify

These calculations do not establish flange bending/prying, register contact pressure, pin-seat retention, thread stripping, screw preload or torque, joint slip, local edge stresses, fatigue, cable snagging, impact, machining fits or actual actuator loads. Small nominal bolt increments do not show that the flange or joint is adequate. An eventual calculation artifact should preserve every input, unit, load vector, equation and assumption, reproduce the signed moment/force balance and report arithmetic checks separately from engineering qualification.
