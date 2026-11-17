# Wrist-roll support — draft architecture

Status: sourced dimensional proposal, not modeled or qualified. No part, bearing, material, fit, preload, life, stiffness or working-load rating is released. This draft changes no fenced model/Doc source. It defines a passive wrist-support study before actuator selection or mass reduction.

All positions below are wrist assembly Z coordinates in mm, with +Z toward the tool. A part factory keeps the common front mating datum at local Z = 0, normal +Z; the assembler places it at wrist Z = +6. Convert these table positions to that factory datum by subtracting 6. Existing tool-interface face, register, pin and bolt-circle placement remain unchanged in this proposal.

## Bearing and abutment references

[NSK 6804](https://www.nsk.com/eu-en/engineering/6804-dgbb-sr.html) is an actual open single-row deep-groove bearing with bore 20, OD 32, width 7, minimum chamfer 0.3 and approximate mass 17 g. The catalogue gives shaft abutment diameter da(min) = 22, also lists da(max) = 22, housing abutment Da(max) = 30 and abutment fillet ra(max) = 0.3. Use the exact selected variant's drawing to resolve abutment tolerances; do not silently substitute a wider shaft shoulder or infer seal clearances from the envelope.

The preliminary inner-race shoulder/spacer/washer OD is consequently 22. Housing shoulder and front-cap opening are provisionally Ø28, below the catalogue's maximum Ø30 abutment opening. A candidate shoulder fillet no larger than 0.2 leaves nominal room within the 0.3 fillet limit; final tool nose, relief, chamfer and tolerance details remain to be checked.

The NSK reference is an open bearing. Seal/shield variant, lubrication, protection and supplier are unresolved; a shielded or sealed product must be checked on its own drawing. Its published bearing ratings are not an assembled-wrist rating and are not used to qualify this layout.

## Preliminary axial layout

| Feature | Wrist Z range / location | Nominal geometry and purpose |
| --- | --- | --- |
| Existing tool register / flange | 6…9 / 0…6 | Keep existing Ø20 register and Ø60 flange geometry |
| Rotor front boss | −12…0 | Ø50 with continuous Ø12 service bore; retain the front blind-hole material |
| Inner-race shoulder land | −15…−12 | Ø22 rotating collar, in front of the bearing; separates the broad boss from the fixed cover |
| Front bearing | −22…−15 | NSK 6804 geometry 20 × 32 × 7; centre −18.5 |
| Inner spacer | −45…−22 | Custom OD22/ID20.2 tube, length 23; contacts inner rings only |
| Rear bearing | −52…−45 | Second 20 × 32 × 7 bearing; centre −48.5 |
| Rear inner-race washer | −53…−52 | Custom OD22/ID20.2, thickness 1; not a large standard M20 washer |
| Shaft circlip groove | −54.3…−53 | Candidate DIN 471 shaft-20 groove, width 1.3 |
| Shaft rear end | −56 | Gives 1.7 nominal material beyond the rear groove edge |
| Rotating shaft | −56…−15 | OD20, ID12; journal fits unresolved |
| Fixed cartridge nose | About −34…−15 | OD44 envelope, separate from the rotating hub; bearing bores and caps below |
| Fixed Fore insert | −58…−34 | Candidate integrated 59.8 × 63.8 rounded-rectangle section, corner radius 15.9 |
| Fore end stop | −34…−31 | Candidate fixed flange matching Fore outer 68 × 72, corner radius 20 |
| Front fixed cover | −15…−13 | Candidate thickness 2, opening Ø28, contacts front outer ring only |
| Rear fixed cover | −54.5…−52.5 | Candidate thickness 2, opening about Ø30; retains outer ring travel with clearance |

Derived layout checks:

- Bearing-centre span is 30; the 23 spacer plus one bearing width gives that distance.
- The Ø44 nose leaves nominal centred gaps of 8 and 10 inside the Fore's 60 × 64 envelope. The proposed rear insert supplies a separate physical attachment geometry, described below; those nose gaps alone are not a mount.
- The front cover ends at −13 while the broad rotating boss begins at −12, leaving a nominal 1 axial gap. Only the Ø22 shoulder land reaches the front inner ring; the Ø50 boss must not rub the fixed outer ring/cover.
- At a bolt centre radius 20, the Ø50 boss leaves nominal radial material 25 − 20 − 2 = 3 around the Ø4 thread envelope. Extending the boss to −12 leaves 4 behind the modelled hole bottom at −8, or 3 behind the earlier candidate drill point at −9. An Ø50 boss ending at −8 would leave zero bottom material. These ligaments still need stress/process checks.

The shaft currently ends after retaining the bearing stack. A motor, torque coupling, encoder, brake and their axial space remain undefined. This is a passive support proposal; nominally touching a motor envelope would not supply those interfaces.

## Location, retention and floating end

Make the front bearing the locating position: its outer ring sits between a cartridge shoulder at −22 and the front cover's bearing face at −15. Keep those contacts on the outer ring. Define cover fastening, shims and assembly endplay before machining; the nominal 7 mm pocket is not permission to apply uncontrolled preload.

Trap the inner-ring/spacer stack between the rotor's Ø22 front shoulder and a rear inner-race washer plus external shaft ring. The rear bearing's outer ring should float axially in its Ø32 bore rather than be clamped as a second locating position. A preliminary rear outer-ring window −52.5…−44.5 has length 8 around the nominal 7 mm bearing, providing ±0.5 nominal travel. Its clearance and fit must be selected from thermal movement, load direction and retention needs; that 1 mm is a packaging reservation, not a verified thermal allowance.

[Rotor Clip DSH-20, DIN 471](https://www.rotorclip.com/product/dsh-20/) specifies shaft diameter 20, groove diameter 18.870…19.000, groove width 1.300, ring thickness 1.140…1.200 and minimum edge margin 1.500. The proposed 1.7 edge margin meets that dimensional minimum nominally. With a Ø12 shaft bore, minimum nominal wall at the smallest groove diameter is (18.87 − 12)/2 = 3.435. Groove stress, material, retention load, plier access and the installed lug envelope remain unchecked. Ring/groove width clearance and bearing/spacer tolerances require an endplay stack; the ring is not a preload adjustment.

For comparison, [Rotor Clip DHO-32, DIN 472](https://www.rotorclip.com/product/dho-32/) uses housing bore 32, groove diameter 33.700…33.950, width 1.300, ring thickness 1.140…1.200 and minimum edge margin 2.600. It is an alternative housing-retention reference, not an added part in this cap-based proposal. Adding it without a complete axial stack could block the intended floating outer ring. A rear cover opening near Ø30 reserves clearance around the shaft ring; actual installed ring/pliers geometry must still be checked.

## Fits are conditional

[NSK's industrial-machinery fit tables](https://www.nsk.com/content/dam/nsk/am/en_us/documents/bearings-americas/Rolling-Bearings-for-Industrial-Machinery.pdf) distinguish load direction and magnitude. For rotating-inner-ring ball-bearing loads at these sizes, light-load examples use js6/j6, while normal-load examples use k5 or k6; H7 housing bores appear for stationary outer-ring load. The table's housing guidance is for steel/cast iron and includes a light-alloy warning. This proposal selects none of those classes yet.

[SKF's maintenance handbook](https://www.skf.com/binaries/pub12/Images/0901d1968013be94-SKF-bearing-maintenance-handbook---10001_1-EN%281%29_tcm_12-463040.pdf) specifically identifies hollow shafts, thin/light-alloy housings, thermal expansion and non-locating-ring displacement as fit-selection factors. Here the shaft bore/OD ratio is 12/20 = 0.6; a solid-steel-shaft fit cannot simply be copied. [NSK also explains](https://www.nsk.com/tools-resources/abc-bearings/fits-and-internal-clearance/) that tight fits reduce internal clearance. Choose bearing clearance, actual shaft/housing material and fits together; then check operating clearance and rear-ring float.

## Real Fore attachment candidate

Extend the fixed cartridge into a keyed-by-shape Fore insert, integrated with the housing rather than represented as an overlapping loose adapter. The Fore's current inner rounded rectangle is 60 × 64 with corner radius 16. A candidate insert of 59.8 × 63.8, radius 15.9, length 24 at Z = −58…−34 is its nominal 0.1 mm inward offset. A fixed stop flange at −34…−31, with the Fore's 68 × 72 / radius-20 outer outline, seats against the tube's cut end. These are preliminary basic dimensions; actual tube size, corner form and assembly clearance need measurement/tolerances.

Use two radial M4 fasteners from each flat X side of Fore, four total: Y = 0, Z = −52 and −40, entering from X = ±34 through the nominal 4 mm wall into tapped insert seats. The proposed insert-seat full-thread depth is 6, subject to drill-point allowance and actual material. A layout example with an M4 × 10 screw, 0.8 washer and 0.1 assembly gap gives nominal entry 10 − 4 − 0.8 − 0.1 = 5.1 into the insert. This is a length example, not selected hardware or a qualified thread. The tapped seats are in the integral housing/insert wall, outside the Ø32 bearing/Ø28 middle bores; they do not rely on tapping the thin Fore shell itself.

This supplies an explicit mechanical path: cartridge to insert, insert to radial fasteners/profile contact, and Fore wall into the arm link; the end stop establishes insertion depth. Four bolts alone do not qualify that path. Check Fore-wall bearing/crushing, local bending, loss of clearance while tightening, thread stripping, corner fit, bolt access and the stop/contact surfaces before accepting the mount. The complete cartridge should be assembled and checked on the bench, then inserted from Fore's front and secured radially; rear bearing/ring service requires withdrawing it. Manufacturing a one-piece insert/nose from suitable stock versus a separately fastened adapter remains a cost/process decision, with no unmodeled joint permitted in the selected version.

## Assembly and manufacturing route

1. Finish rotor datum face, register, shoulder and bearing journals from controlled datums. Preserve the front tapped-hole floor and machine the circlip groove with the selected ring's tolerances. Material and heat treatment remain open.
2. Finish the cartridge bearing seats and locating shoulder coaxially; define covers, their fastening and rear floating window. Check outer-ring-only contact and rotating clearance from actual bearing/retainer drawings.
3. Insert the front bearing into its cartridge seat from the front, applying any fitting force only to its outer ring. Insert the rotor shaft from the front. Support the front inner ring from the open rear through the Ø28 middle bore while fitting the shaft, until the Ø22 shoulder seats. The required support sleeve and fixture are part of the assembly tooling still to be designed.
4. From the rear, install the inner spacer and rear bearing onto the shaft. The proposed rear outer ring must slide in its non-locating bore; support the rotor shoulder/inner-ring stack and apply any shaft-fitting force to the rear inner ring. Install the custom rear washer and shaft ring, then inspect seating and measure the axial stack. A preassembled two-bearing shaft cannot pass through the cartridge's Ø28 middle shoulder; the rear parts have to be fitted from the rear in this housing architecture.
5. Install covers/shims without unintentionally clamping the floating outer ring. [NSK's mounting guidance](https://www.nsk.com/eu-en/tools-resources/maintenance/bearing-mounting/) describes applying the mounting force to the fitted ring; tooling must not send that force through the balls. Check that covers, ring lugs, bearing seals/cages and rotating lands remain clear.
6. Check rotation, clearance, endplay and retention on the bench, then slide the complete fixed insert into Fore from its front until the stop seats and secure its radial fasteners. Insert the guide/cable only after those checks. Actual fits may require a different fixture or bearing-mounting sequence; this preliminary route is not a released assembly instruction.

Turning, boring, drilling/tapping and cap machining are the candidate route. Compare the whole support mass and rotating inertia after adding bearings, spacer, ring, caps and adapter; a lighter rotor alone is not an assembly mass saving.

## Loads and next contract decision

Before bearing selection, include rotor/hardware mass, acceleration, cable forces, seal drag, axial force, bending, intended motion range and contamination. Stiffness, service life and allowable preload remain uncalculated.

Even the earlier 30 N / 100 mm tool case must be transferred to the bearing reference: the mating face is wrist Z = 6, so the force acts at 106; its overhang from the proposed front-bearing centre −18.5 is 124.5. An ideal two-point radial support with 30 mm span would have opposing front/rear reaction magnitudes 154.5 and 124.5 N. This is a static equilibrium illustration only, excluding all support flexibility, preload, hub mass and dynamics; it is not a bearing-life or stiffness check.

The main assembler must next accept or revise the boss depth, bearing coordinates/span, front locating/rear floating arrangement, retention route and actual Fore attachment. Only then should agents model rotor and fixed cartridge parts against a shared interface contract. No native geometry or manufactured variant is qualified by this draft.
