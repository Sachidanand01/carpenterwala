import fs from 'fs';
import path from 'path';

const blogDataPath = path.resolve('lib/blog-data.js');
let fileContent = fs.readFileSync(blogDataPath, 'utf8');

const checklists = {
  'why-painted-walls-bubble-peel-root-causes-and-fix': `
      <h2>Before &amp; After Painting Process Checklist &amp; Shopping Kit</h2>
      <p>Winning the Google "Featured Snippet" position for wall repainting and defect repair requires following a strict chronological protocol with the exact tools and materials:</p>

      <div style="background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
        <h3 style="margin-top: 0; color: var(--primary);">🛒 Essential Shopping Kit (What You Need to Buy)</h3>
        <ul>
          <li><strong>Premium Emulsion Paint:</strong> 2 topcoats of luxury or premium acrylic emulsion (such as <a href="/blog/asian-paints-royale-vs-berger-silk-luxury-paint-comparison-guide">Asian Paints Royale or Berger Silk</a>) diluted with 35–40% clean potable water.</li>
          <li><strong>1.5-Inch Blue Painter's Masking Tape:</strong> 3 to 4 rolls of low-tack crepe masking tape for sharp, bleed-free borders on floor skirting, switchboards, door architraves, and ceiling junctions.</li>
          <li><strong>Sandpaper Grits 180 &amp; 320:</strong>
            <ul>
              <li><strong>180-Grit Coarse Emery Paper:</strong> For leveling dried wall putty patches, scuffing old glossy enamel, and feathering damaged paint edges.</li>
              <li><strong>320-Grit Fine Silicon Carbide Paper:</strong> For smoothing intermediate primer coats and de-nibbing micro-lint between emulsion topcoats.</li>
            </ul>
          </li>
          <li><strong>Application Paint Rollers:</strong> 9-inch short-nap (5mm–9mm) microfiber or woven roller sleeve with heavy-duty cage frame, roller tray, and telescopic extension pole for uniform, stipple-free wall coverage.</li>
          <li><strong>Precision Paint Brushes:</strong> 2-inch to 3-inch synthetic angled sash brushes with tapered polyester-nylon filaments for clean corner cutting-in, ceiling borders, and trim detailing without leaving brush streak marks.</li>
          <li><strong>Putty &amp; Substrate Primers:</strong> 1kg–2kg acrylic ready-mix wall putty, 1L crystalline Damp-Block primer (for moisture spots), and 1L water-based masonry primer.</li>
        </ul>

        <h3 style="color: var(--primary);">📋 Before, During &amp; After Execution Checklist</h3>
        <ol>
          <li><strong>BEFORE Painting (Preparation, Sanding &amp; Masking):</strong>
            <ul>
              <li>Move furniture to the room center and drape heavy-gauge plastic drop sheets over flooring.</li>
              <li>Scrape all loose, peeling, and bubbling paint back to sound plaster using a 4-inch stiff steel scraper blade.</li>
              <li>Apply 2 coats of acrylic wall putty over scraped cavities; allow 6–8 hours to dry.</li>
              <li>Level the dried putty flush with the wall using <strong>180-grit sandpaper</strong>; wipe off 100% of fine sanding dust with a damp microfiber cloth.</li>
              <li>Apply 1 coat of water-based masonry primer over patched areas; allow 4 hours dry time, then smooth gently with <strong>320-grit sandpaper</strong>.</li>
              <li>Firmly press <strong>1.5-inch blue masking tape</strong> along all baseboards, switchboards, door frames, and ceiling borders.</li>
            </ul>
          </li>
          <li><strong>DURING Painting (Cutting-in, Rolling &amp; Recoat Timing):</strong>
            <ul>
              <li>Cut in a 2-to-3-inch border around all ceiling lines, corners, and electrical fixtures using your <strong>2-inch synthetic angled brush</strong>.</li>
              <li>Immediately load your <strong>9-inch microfiber roller</strong> evenly from the paint tray; roll emulsion onto walls in smooth "W" or "N" patterns, backrolling vertically while maintaining a wet edge.</li>
              <li>Allow the first coat of emulsion paint to dry undisturbed for a minimum of 4 hours in a well-ventilated room.</li>
              <li>Lightly de-nib the first coat with <strong>320-grit sandpaper</strong> to knock off any stray dust nibs; wipe clean with a dry cotton rag.</li>
              <li>Apply the second topcoat of emulsion paint in uniform vertical downward passes for flawless color saturation and sheen consistency.</li>
            </ul>
          </li>
          <li><strong>AFTER Painting (Tape Removal, Inspection &amp; Curing):</strong>
            <ul>
              <li>Peel masking tape away at a slow 45-degree angle while the second coat is still slightly tacky to prevent chipping dry paint edges.</li>
              <li>Conduct a low-angle inspection with a flashlight (glancing light test) to verify 100% defect-free coverage and zero roller lap marks.</li>
              <li>Reinstall switchboard faceplates and clean brushes and rollers in warm water before storing them.</li>
              <li>Allow 14 to 21 days for full acrylic polymer cross-linking before scrubbing or wet-wiping the newly painted wall surface.</li>
            </ul>
          </li>
        </ol>
      </div>

`,
  'asian-paints-royale-vs-berger-silk-luxury-paint-comparison-guide': `
      <h2>Before &amp; After Luxury Painting Process Checklist &amp; Shopping Kit</h2>
      <p>To achieve a mirror-flat, velvet luxury finish with Asian Paints Royale or Berger Silk and win top search snippet placement, use this comprehensive materials kit and 3-phase checklist:</p>

      <div style="background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
        <h3 style="margin-top: 0; color: var(--primary);">🛒 Luxury Emulsion Shopping Kit (What You Need to Buy)</h3>
        <ul>
          <li><strong>Luxury Acrylic Emulsion Paint:</strong> Asian Paints Royale (Matt, Luxury, or Glitz) or Berger Silk (Glamor or Breathe Easy) — calculate 2 coats at 140–150 sq.ft/L per coat with 35–40% water dilution.</li>
          <li><strong>1.5-Inch Blue Painter's Masking Tape:</strong> Low-tack edge-lock masking tape (3–5 rolls per room) to ensure crisp, razor-sharp paint demarcations along trims, crown molding, and granite skirting.</li>
          <li><strong>Sandpaper Grits 180 &amp; 320:</strong>
            <ul>
              <li><strong>180-Grit Coarse Sandpaper:</strong> For leveling acrylic wall putty and removing surface ridges or trowel marks.</li>
              <li><strong>320-Grit Ultra-Fine Sandpaper:</strong> For polishing dried primer to a glass-smooth base and de-nibbing the first emulsion topcoat.</li>
            </ul>
          </li>
          <li><strong>Microfiber Paint Rollers:</strong> 9-inch short-nap (5mm–7mm nap) microfiber roller with cage frame and extension pole, plus a 4-inch mini roller for tight pillar sections.</li>
          <li><strong>Precision Synthetic Brushes:</strong> 2-inch to 2.5-inch synthetic angled sash brushes with tapered polyester bristles to eliminate brush lap streaks during cutting-in.</li>
          <li><strong>Surface Prep Essentials:</strong> Polymer-modified acrylic wall putty, water-based interior acrylic wall primer, roller bucket with grid, and lint-free cotton wiping rags.</li>
        </ul>

        <h3 style="color: var(--primary);">📋 Before, During &amp; After Execution Checklist</h3>
        <ol>
          <li><strong>BEFORE Painting (Substrate Prep &amp; Precision Masking):</strong>
            <ul>
              <li>Lay 100-micron polythene floor drop sheets and tape them down with masking tape.</li>
              <li>Inspect walls for dampness (&lt;12% moisture); fill all hairline fissures and nail holes with acrylic wall putty.</li>
              <li>Sand all putty repairs flat using <strong>180-grit sandpaper</strong>; vacuum and damp-wipe all dust off the walls.</li>
              <li>Apply 1 coat of water-based masonry primer; allow 4 hours dry time, then smooth the primer surface with <strong>320-grit sandpaper</strong>.</li>
              <li>Apply <strong>1.5-inch blue masking tape</strong> along skirting boards, door frames, switch panels, and ceiling perimeters.</li>
            </ul>
          </li>
          <li><strong>DURING Painting (Cutting-in, Microfiber Rolling &amp; Sheen Development):</strong>
            <ul>
              <li>Dilute Royale or Berger Silk emulsion accurately with 35–40% clean water by volume; stir mechanically for 2 minutes.</li>
              <li>Cut in wall edges, corners, and ceiling perimeters using a <strong>2-inch synthetic angled brush</strong>.</li>
              <li>Immediately roll the wall from top to bottom using the <strong>9-inch short-nap microfiber roller</strong>, keeping a continuous wet edge to prevent overlapping lap lines.</li>
              <li>Allow the first coat to dry for 4 to 6 hours at room temperature.</li>
              <li>De-nib the dry first coat with <strong>320-grit sandpaper</strong> using light circular pressure; wipe off dust with a dry tack cloth.</li>
              <li>Apply the second coat of luxury emulsion in uniform downward strokes for maximum depth of color and uniform sheen.</li>
            </ul>
          </li>
          <li><strong>AFTER Painting (Tape Peeling, Low-Angle Light Audit &amp; Curing):</strong>
            <ul>
              <li>Remove masking tape at a 45-degree angle within 1 hour of applying the second coat to avoid tearing cured paint film.</li>
              <li>Audit walls with a low-angle halogen or LED light to verify zero orange-peel stippling or color inconsistencies.</li>
              <li>Wash brushes and roller sleeves immediately in warm soapy water to protect bristle softness.</li>
              <li>Allow a full 21-day curing window before testing Teflon surface washability or scrubbing scuffs with wet sponges.</li>
            </ul>
          </li>
        </ol>
      </div>

`,
  'how-to-waterproof-paint-balcony-exterior-walls-monsoon-guide': `
      <h2>Before &amp; After Exterior Painting &amp; Waterproofing Checklist &amp; Shopping Kit</h2>
      <p>To ensure high-rise balconies and monsoon-exposed exterior walls remain completely leak-free and win Google featured snippet ranking, follow this exact procurement list and process checklist:</p>

      <div style="background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
        <h3 style="margin-top: 0; color: var(--primary);">🛒 Exterior Waterproofing Shopping Kit (What You Need to Buy)</h3>
        <ul>
          <li><strong>Elastomeric Exterior Waterproof Emulsion Paint:</strong> High-build crack-bridging exterior emulsion (e.g., <em>Asian Paints Apex Ultima Protek</em> or <em>Berger WeatherCoat Long Life</em>) with elastomeric topcoat.</li>
          <li><strong>Heavy-Duty Weather-Resistant Masking Tape:</strong> 2-inch UV-resistant exterior masking tape to seal window glass frames, balcony railings, and floor tiles from heavy paint splatters.</li>
          <li><strong>Sandpaper Grits 180 &amp; 320 (Plus 80-Grit Coarse):</strong>
            <ul>
              <li><strong>80/180-Grit Sandpaper:</strong> 80-grit and 180-grit abrasive paper to strip dead exterior chalk, scuff old flaking coats, and smooth fiber-reinforced crack filler.</li>
              <li><strong>320-Grit Sandpaper:</strong> For fine-smoothing parapet edges, smooth balcony ceilings, and primer intermediate layers.</li>
            </ul>
          </li>
          <li><strong>Exterior Paint Rollers:</strong> 9-inch long-nap (18mm–25mm) rough surface roller for textured exterior plaster, plus a 9-inch short-nap microfiber roller for smooth balcony soffits.</li>
          <li><strong>Masonry &amp; Precision Brushes:</strong> 3-inch wide exterior masonry block brush for mortar grooves, plus a 2-inch synthetic angled brush for window reveal cutting.</li>
          <li><strong>Waterproofing Chemicals &amp; Putty:</strong> Crystalline damp-proof exterior primer, elastomeric crack paste (up to 3mm cracks), and fiber mesh tape for expansion joints.</li>
        </ul>

        <h3 style="color: var(--primary);">📋 Before, During &amp; After Execution Checklist</h3>
        <ol>
          <li><strong>BEFORE Painting (Pressure Washing, Crack Stitching &amp; Masking):</strong>
            <ul>
              <li>Pressure wash exterior surfaces (120–150 bar) to strip algae, moss, soot, and loose plaster; allow 48 hours sun-drying.</li>
              <li>V-groove all structural cracks with a chisel; pack with acrylic elastomeric crack filler paste and fiber mesh.</li>
              <li>Sand crack patches smooth with <strong>180-grit sandpaper</strong>; blow away all loose masonry grit.</li>
              <li>Apply 1 coat of penetrating waterproof base primer (diluted with max 10% water) across all exterior plaster; allow 6 hours to cure.</li>
              <li>Mask balcony floor tiles, aluminum sliding glass frames, and drain outlets with <strong>2-inch exterior masking tape</strong>.</li>
            </ul>
          </li>
          <li><strong>DURING Painting (Basecoat Mesh &amp; Elastomeric Rolling):</strong>
            <ul>
              <li>Brush exterior parapet corners, weep holes, and joints using a <strong>2-inch synthetic brush</strong>.</li>
              <li>Apply the heavy-build waterproof basecoat (e.g., <em>Ultima Protek Duralife Basecoat</em>) using the <strong>long-nap exterior roller</strong> at recommended spreading rates (55–60 sq.ft/L).</li>
              <li>Allow the basecoat to dry for 6 to 8 hours.</li>
              <li>Lightly sand smooth balcony ceiling areas with <strong>320-grit sandpaper</strong> before topcoating.</li>
              <li>Apply 2 coats of elastomeric exterior emulsion paint using the <strong>microfiber roller</strong>, waiting 4 to 6 hours between coats.</li>
            </ul>
          </li>
          <li><strong>AFTER Painting (Inspection, Tape Removal &amp; Monsoon Readiness):</strong>
            <ul>
              <li>Peel all exterior masking tape immediately after final coat surface drying.</li>
              <li>Inspect all parapet coping edges and floor junctions with a mirror to confirm 100% pinhole-free membrane coverage.</li>
              <li>Test balcony water drainage slope by pouring a bucket of water toward the floor trap to verify zero standing puddles.</li>
              <li>Allow 72 hours of dry weather for the elastomeric polymer membrane to fully cure before exposure to heavy monsoon downpours.</li>
            </ul>
          </li>
        </ol>
      </div>

`,
  'how-to-paint-rusted-window-grills-iron-gates-anti-rust-guide': `
      <h2>Before &amp; After Metal Painting Process Checklist &amp; Shopping Kit</h2>
      <p>To eliminate rust permanently from iron gates and window grills while winning top Google featured snippet positioning, use this exact procurement kit and 3-phase checklist:</p>

      <div style="background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
        <h3 style="margin-top: 0; color: var(--primary);">🛒 Anti-Rust Metal Painting Shopping Kit (What You Need to Buy)</h3>
        <ul>
          <li><strong>Anti-Rust Enamel or PU Metal Paint:</strong> High-gloss polyurethane (PU) metal enamel or exterior anti-rust metal paint (e.g., <em>Asian Paints Apcolite Premium Gloss</em> or <em>Berger Luxol PU</em>) in chosen color shade.</li>
          <li><strong>1.5-Inch Blue Painter's Masking Tape:</strong> 3 to 4 rolls of precision masking tape to protect window glass panes, granite window sills, and surrounding plastered walls from paint splatter.</li>
          <li><strong>Sandpaper Grits 180 &amp; 320 (Plus 80-Grit Emery &amp; Wire Brush):</strong>
            <ul>
              <li><strong>80/180-Grit Coarse Emery Sandpaper:</strong> 80-grit and 180-grit emery sheets to grind away crusty rust, mill scale, and flaky old enamel down to bright bare metal.</li>
              <li><strong>320-Grit Fine Silicon Carbide Paper:</strong> For smoothing dried anti-rust primer and de-nibbing metal topcoats between coats.</li>
            </ul>
          </li>
          <li><strong>Mini Rollers for Sheet Metal:</strong> 4-inch high-density foam or short-nap microfiber mini rollers with slim wire frame for rolling flat gate sheets and wide metal louvers.</li>
          <li><strong>Specialized Metal Paint Brushes:</strong> 1-inch and 2-inch synthetic angled sash brushes with stiff nylon filaments for reaching deep into intricate wrought-iron grill curves and weld joints.</li>
          <li><strong>Chemical Inhibitors &amp; Primers:</strong> Phosphoric acid rust converter solution, Red Oxide / Zinc Phosphate anti-corrosive metal primer, NC metal putty, and mineral turpentine thinner.</li>
        </ul>

        <h3 style="color: var(--primary);">📋 Before, During &amp; After Execution Checklist</h3>
        <ol>
          <li><strong>BEFORE Painting (De-Rusting, Priming &amp; Masking):</strong>
            <ul>
              <li>Lay cardboard or drop sheets beneath grills; scrape heavy rust crusts with a stiff steel wire brush.</li>
              <li>Sand all iron bars vigorously down to bright, silver-gray bare metal using <strong>180-grit emery sandpaper</strong>.</li>
              <li>Wipe away all metallic dust with a mineral turpentine soaked rag.</li>
              <li>Apply 1 coat of phosphoric acid rust converter over pitted sections; let react for 2 hours until black iron phosphate forms.</li>
              <li>Apply 1 coat of <em>Red Oxide or Zinc Phosphate Anti-Rust Primer</em>; let dry 6 hours, then smooth with <strong>320-grit sandpaper</strong>.</li>
              <li>Carefully tape window glass edges and surrounding wall sills with <strong>1.5-inch blue masking tape</strong>.</li>
            </ul>
          </li>
          <li><strong>DURING Painting (Cutting-in Grill Bars &amp; Smooth Rolling):</strong>
            <ul>
              <li>Dilute synthetic enamel paint with 8–10% mineral turpentine for optimal brush leveling without sagging.</li>
              <li>Paint intricate grill corners, scrolls, and weld joints using the <strong>1-inch and 2-inch synthetic brushes</strong> in thin, uniform coats.</li>
              <li>Roll flat gate sheet sections with the <strong>4-inch mini roller</strong> to prevent visible brush drag marks.</li>
              <li>Allow the first coat to dry for a minimum of 8 to 12 hours.</li>
              <li>Lightly scuff-sand the first coat with <strong>320-grit sandpaper</strong> to knock off dust nibs and ensure strong inter-coat adhesion.</li>
              <li>Apply the second topcoat of high-gloss enamel for full opacity, weatherproofing, and UV resistance.</li>
            </ul>
          </li>
          <li><strong>AFTER Painting (Tape Stripping, Inspection &amp; Hard Curing):</strong>
            <ul>
              <li>Peel masking tape off window glass at a 45-degree angle before the enamel cures rock-hard to prevent ragged paint edges.</li>
              <li>Inspect weld seams and bottom grill anchor rods with a flashlight to verify zero unpainted metal pinholes.</li>
              <li>Clean brushes in mineral turpentine and hang bristles downward.</li>
              <li>Allow 48 to 72 hours for complete enamel cross-linking before sliding window sashes or exposing gates to monsoon rain.</li>
            </ul>
          </li>
        </ol>
      </div>

`,
  'how-to-choose-primer-vs-putty-when-to-skip-guide': `
      <h2>Before &amp; After Wall Preparation Checklist &amp; Essential Shopping Kit</h2>
      <p>To achieve showroom-grade walls and win Google featured snippet ranking for primer and putty preparation, follow this exact procurement inventory and 3-phase execution checklist:</p>

      <div style="background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
        <h3 style="margin-top: 0; color: var(--primary);">🛒 Wall Preparation Shopping Kit (What You Need to Buy)</h3>
        <ul>
          <li><strong>Interior Acrylic Emulsion Paint:</strong> 2 topcoats of premium acrylic emulsion paint (e.g., <em>Asian Paints Apcolite / Royale</em> or <em>Berger Silk</em>) diluted with 35% potable water.</li>
          <li><strong>1.5-Inch Blue Painter's Masking Tape:</strong> 3 to 4 rolls of low-tack crepe tape to protect switchboards, door frames, floor skirting, and fixtures during plastering and painting.</li>
          <li><strong>Sandpaper Grits 180 &amp; 320:</strong>
            <ul>
              <li><strong>180-Grit Emery Sandpaper:</strong> For leveling dried acrylic wall putty, removing spatula ridges, and feathering old paint edges.</li>
              <li><strong>320-Grit Silicon Carbide Sandpaper:</strong> For polishing intermediate primer coats and final de-nibbing between emulsion topcoats.</li>
            </ul>
          </li>
          <li><strong>Application Paint Rollers:</strong> 9-inch short-nap (7mm) microfiber roller with sturdy cage frame, extension rod, and roller grid bucket for smooth, streak-free paint application.</li>
          <li><strong>Precision Wall Brushes:</strong> 2-inch and 2.5-inch synthetic angled sash brushes with tapered filaments for cutting in edges, ceiling junctions, and door architraves.</li>
          <li><strong>Putty &amp; Primers:</strong> Polymer-modified white cement or acrylic ready-mix wall putty (1.0mm thickness), water-based masonry primer (Decoprime/BP White), 6-inch and 8-inch steel putty blades.</li>
        </ul>

        <h3 style="color: var(--primary);">📋 Before, During &amp; After Execution Checklist</h3>
        <ol>
          <li><strong>BEFORE Painting (Substrate Sealing, Puttying &amp; Masking):</strong>
            <ul>
              <li>Scrape all loose plaster or flaking old paint with a 4-inch scraper; vacuum fine dust.</li>
              <li>Apply 1 coat of water-based masonry primer over bare plaster/masonry to regulate porosity; let dry 4 hours.</li>
              <li>Apply 1st coat of acrylic wall putty vertically (0.5mm thickness); let dry 6 hours.</li>
              <li>Apply 2nd coat of acrylic wall putty horizontally (0.5mm thickness) for optical leveling; let dry 8 hours.</li>
              <li>Sand dried putty flat using <strong>180-grit sandpaper</strong>; wipe wall with a damp microfiber cloth to remove all dust.</li>
              <li>Apply 1 coat of intermediate primer over sanded putty; let dry 4 hours, then smooth with <strong>320-grit sandpaper</strong>.</li>
              <li>Firmly apply <strong>1.5-inch blue masking tape</strong> along baseboards, switchboards, and ceiling borders.</li>
            </ul>
          </li>
          <li><strong>DURING Painting (Cutting-in, Microfiber Rolling &amp; Recoating):</strong>
            <ul>
              <li>Cut in ceiling lines and corners with your <strong>2-inch synthetic angled brush</strong>, maintaining a 2-inch wet edge.</li>
              <li>Immediately roll emulsion paint with the <strong>9-inch microfiber roller</strong> in uniform "V" patterns, followed by vertical backrolling.</li>
              <li>Allow the 1st coat of emulsion to dry for a full 4 hours.</li>
              <li>Lightly de-nib the first coat with <strong>320-grit sandpaper</strong> using feather-light pressure; wipe away dust.</li>
              <li>Apply the 2nd topcoat of emulsion paint in straight vertical downward passes for consistent sheen and color depth.</li>
            </ul>
          </li>
          <li><strong>AFTER Painting (Tape Removal, Inspection &amp; Polymer Cure):</strong>
            <ul>
              <li>Peel masking tape at a 45-degree angle while the paint is slightly tacky to ensure crisp, razor-straight edge lines.</li>
              <li>Hold a flashlight flat against the wall (low-angle inspection) to confirm zero putty trowel marks or roller stipples.</li>
              <li>Reinstall electrical switch plates and clean rollers and brushes in warm water.</li>
              <li>Allow 14 to 21 days of chemical curing before washing or scrubbing walls with soap solutions.</li>
            </ul>
          </li>
        </ol>
      </div>

`,
  'how-to-calculate-paint-coverage-litres-needed-guide': `
      <h2>Before &amp; After Painting Process Checklist &amp; Material Shopping Kit</h2>
      <p>Accurately buying paint materials and executing your project without mid-way shortages requires this exact procurement kit and 3-phase checklist to win Google featured snippet ranking:</p>

      <div style="background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
        <h3 style="margin-top: 0; color: var(--primary);">🛒 Paint Procurement Shopping Kit (What You Need to Buy)</h3>
        <ul>
          <li><strong>Calculated Interior Emulsion Paint:</strong> Total wall surface area ÷ 65 sq.ft/L (for 2 coats) + 10% wastage reserve of your chosen brand (e.g., <em>Asian Paints Royale, Apcolite, or Berger Silk</em>).</li>
          <li><strong>1.5-Inch Blue Painter's Masking Tape:</strong> 4 to 6 rolls of low-tack masking tape per apartment for floor skirtings, electrical switchboards, window frames, and ceiling border demarcation.</li>
          <li><strong>Sandpaper Grits 180 &amp; 320:</strong>
            <ul>
              <li><strong>180-Grit Sandpaper (5–8 sheets per room):</strong> For leveling dried wall putty coats and scuffing existing paint films.</li>
              <li><strong>320-Grit Silicon Carbide Paper (5–8 sheets per room):</strong> For de-glazing intermediate primer coats and de-nibbing between topcoats.</li>
            </ul>
          </li>
          <li><strong>Application Paint Rollers:</strong> 9-inch short-nap (5mm–9mm) microfiber roller with heavy-duty frame and telescopic extension pole (plus 1 replacement roller sleeve per color shade).</li>
          <li><strong>Precision Paint Brushes:</strong> 2-inch and 3-inch synthetic angled sash brushes with tapered bristles for clean corner cutting-in and ceiling edges without brush drag lines.</li>
          <li><strong>Associated Prep Materials:</strong> 2 coats acrylic wall putty (approx. 1kg per 10–12 sq.ft), 1 coat interior wall primer (140 sq.ft/L), plastic drop sheets, and cotton wiping rags.</li>
        </ul>

        <h3 style="color: var(--primary);">📋 Before, During &amp; After Execution Checklist</h3>
        <ol>
          <li><strong>BEFORE Painting (Measuring, Material Purchase &amp; Masking):</strong>
            <ul>
              <li>Calculate exact net wall square footage (Total Wall Area − Doors/Windows) and order calculated paint tins in unified batch codes.</li>
              <li>Cover all flooring with heavy plastic drop sheets; remove switchboard faceplates.</li>
              <li>Repair cracks and holes with acrylic putty; sand flat using <strong>180-grit sandpaper</strong>; wipe clean with a damp cloth.</li>
              <li>Apply 1 coat of masonry primer; let dry 4 hours and smooth gently with <strong>320-grit sandpaper</strong>.</li>
              <li>Apply <strong>1.5-inch blue painter's masking tape</strong> along skirting boards, door frames, and ceiling borders.</li>
            </ul>
          </li>
          <li><strong>DURING Painting (Precise Dilution, Cutting &amp; Rolling):</strong>
            <ul>
              <li>Dilute emulsion paint strictly according to manufacturer specs (35–40% clean water by volume); stir thoroughly.</li>
              <li>Cut in corners and borders using your <strong>2-inch synthetic angled brush</strong>.</li>
              <li>Roll wall fields immediately using the <strong>9-inch microfiber roller</strong> in continuous "W" passes, maintaining a wet edge to avoid overlapping marks.</li>
              <li>Allow the first topcoat to dry for 4 hours.</li>
              <li>Lightly de-nib the first coat with <strong>320-grit sandpaper</strong>; wipe off dust with a dry tack rag.</li>
              <li>Apply the second topcoat in uniform vertical passes for consistent color opacity and texture.</li>
            </ul>
          </li>
          <li><strong>AFTER Painting (Tape Stripping, Tins Storage &amp; Curing):</strong>
            <ul>
              <li>Peel masking tape at a 45-degree angle while the paint is slightly tacky to achieve razor-sharp paint borders.</li>
              <li>Inspect walls under low-angle light to ensure zero thin patches or roller stipples.</li>
              <li>Seal remaining leftover paint in airtight tins, noting room names and color batch numbers for future touch-ups.</li>
              <li>Wash rollers and brushes in warm water; allow 14 to 21 days for full acrylic paint washability cure.</li>
            </ul>
          </li>
        </ol>
      </div>

`,
  'how-to-estimate-interior-painting-cost-distemper-emulsion-royale': `
      <h2>Before &amp; After Painting Checklist &amp; Contractor Procurement Kit</h2>
      <p>To eliminate contractor overcharging, control material expenses, and win Google featured snippet ranking for painting cost estimates, use this master shopping kit and 3-phase checklist:</p>

      <div style="background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
        <h3 style="margin-top: 0; color: var(--primary);">🛒 Painting Material Shopping Kit (What You Need to Buy)</h3>
        <ul>
          <li><strong>Interior Emulsion Paint:</strong> Economy Emulsion (₹180–₹240/L), Premium Acrylic Emulsion (₹280–₹380/L), or Luxury Emulsion (₹450–₹750/L) calculated at 65 sq.ft/L for 2 topcoats.</li>
          <li><strong>1.5-Inch Blue Painter's Masking Tape:</strong> 4 to 6 rolls of low-tack crepe tape to protect switchboards, door frames, aluminum window channels, and floor skirting.</li>
          <li><strong>Sandpaper Grits 180 &amp; 320:</strong>
            <ul>
              <li><strong>180-Grit Coarse Emery Sandpaper:</strong> For leveling dried wall putty and removing wall imperfections.</li>
              <li><strong>320-Grit Silicon Carbide Sandpaper:</strong> For polishing intermediate primer coats and de-nibbing between topcoats.</li>
            </ul>
          </li>
          <li><strong>Application Paint Rollers:</strong> 9-inch short-nap (5mm–9mm) microfiber roller with sturdy cage frame, extension rod, and roller grid tray.</li>
          <li><strong>Precision Cutting Brushes:</strong> 2-inch and 3-inch synthetic angled sash brushes with tapered filaments for razor-sharp cutting-in without leaving brush drag lines.</li>
          <li><strong>Putty &amp; Primer Materials:</strong> 2 coats acrylic wall putty (₹6–₹8/sq.ft material cost), 1–2 coats water-based masonry primer (₹3–₹5/sq.ft material cost), plastic floor drop sheets, and steel putty knives.</li>
        </ul>

        <h3 style="color: var(--primary);">📋 Before, During &amp; After Execution Checklist</h3>
        <ol>
          <li><strong>BEFORE Painting (Contractor Scope Verification, Prep &amp; Masking):</strong>
            <ul>
              <li>Audit contractor quote: verify if rates include 2 coats of putty, 1 coat primer, and 2 full coats of branded emulsion.</li>
              <li>Cover flooring with plastic drop sheets; remove switchboard faceplates.</li>
              <li>Scrape loose paint; apply 2 coats of acrylic wall putty; let dry 6–8 hours.</li>
              <li>Sand dried putty smooth with <strong>180-grit sandpaper</strong>; wipe away all fine dust with a damp cloth.</li>
              <li>Apply 1 coat of masonry primer; allow 4 hours dry time, then smooth with <strong>320-grit sandpaper</strong>.</li>
              <li>Apply <strong>1.5-inch blue masking tape</strong> along baseboards, door trims, and ceiling lines.</li>
            </ul>
          </li>
          <li><strong>DURING Painting (Dilution Auditing, Cutting-in &amp; Rolling):</strong>
            <ul>
              <li>Ensure painters dilute emulsion paint strictly with 35–40% water (preventing excessive thinning to stretch paint).</li>
              <li>Cut in corners, ceiling borders, and edges using a <strong>2-inch synthetic angled brush</strong>.</li>
              <li>Roll wall fields evenly using a <strong>9-inch microfiber roller</strong>, maintaining a wet edge to eliminate lap marks.</li>
              <li>Enforce a strict 4-hour drying interval between the first and second coats.</li>
              <li>Lightly de-nib the first coat with <strong>320-grit sandpaper</strong> before applying the second topcoat.</li>
            </ul>
          </li>
          <li><strong>AFTER Painting (Inspection, Measurement Audit &amp; Final Payment):</strong>
            <ul>
              <li>Peel masking tape at a 45-degree angle while paint is slightly tacky to prevent chipped edges.</li>
              <li>Perform a low-angle flashlight inspection across all walls to spot any missed patches or brush streaks.</li>
              <li>Conduct final joint measurement of actual wall area before settling contractor labor bills.</li>
              <li>Allow 14 to 21 days for full acrylic paint curing before washing walls.</li>
            </ul>
          </li>
        </ol>
      </div>

`,
  'how-to-chalk-paint-old-furniture-vintage-distressed-look': `
      <h2>Before &amp; After Furniture Painting Checklist &amp; Shopping Kit</h2>
      <p>To transform old vintage wooden furniture with chalk paint and win top Google search snippet ranking, follow this exact materials kit and 3-phase execution checklist:</p>

      <div style="background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
        <h3 style="margin-top: 0; color: var(--primary);">🛒 Furniture Upcycling Shopping Kit (What You Need to Buy)</h3>
        <ul>
          <li><strong>Chalk Paint / Ultra-Matte Emulsion Paint:</strong> High-calcium chalk paint or ultra-matte acrylic emulsion (e.g., <em>Asian Paints Nilaya Vintage Chalk</em> or <em>Rust-Oleum Chalked</em>) in your desired vintage shade.</li>
          <li><strong>1.5-Inch Low-Tack Painter's Masking Tape:</strong> 2 rolls of delicate surface painter's tape to mask glass door inserts, decorative wooden inlays, and interior drawer slides.</li>
          <li><strong>Sandpaper Grits 180 &amp; 320:</strong>
            <ul>
              <li><strong>180-Grit Medium Sandpaper:</strong> For light scuffing of old glossy varnish and distressing high-wear edges/carvings to expose natural wood underneath.</li>
              <li><strong>320-Grit Ultra-Fine Sandpaper:</strong> For smoothing between chalk paint coats to achieve a buttery, porcelain-soft touch.</li>
            </ul>
          </li>
          <li><strong>Mini Foam &amp; Microfiber Rollers:</strong> 4-inch high-density foam or short-nap microfiber mini rollers for smooth, streak-free tabletop and cabinet side panel coverage.</li>
          <li><strong>Specialized Chalk Paint Brushes:</strong> 1.5-inch and 2-inch oval natural/synthetic bristle brushes for rich paint holding and textured vintage stippling across carvings and spindles.</li>
          <li><strong>Wax &amp; Finishing Sealers:</strong> Clear furniture finishing wax or matte water-based polyurethane topcoat, lint-free cotton buffing cloth, and wood filler paste.</li>
        </ul>

        <h3 style="color: var(--primary);">📋 Before, During &amp; After Execution Checklist</h3>
        <ol>
          <li><strong>BEFORE Painting (Disassembly, Cleaning &amp; Scuff Sanding):</strong>
            <ul>
              <li>Remove all metal handles, hinges, and drawer knobs; label them for easy reassembly.</li>
              <li>Degrease wood surfaces thoroughly with warm water and dish soap; allow to dry.</li>
              <li>Lightly scuff-sand the entire piece with <strong>180-grit sandpaper</strong> (no need to strip to bare wood—just take off gloss).</li>
              <li>Wipe off 100% of sanding dust using a damp microfiber rag.</li>
              <li>Mask glass panels, mirrored surfaces, and drawer edges with <strong>1.5-inch painter's tape</strong>.</li>
            </ul>
          </li>
          <li><strong>DURING Painting (Applying Chalk Emulsion &amp; Distressing):</strong>
            <ul>
              <li>Stir chalk paint thoroughly; apply the first thin coat with an <strong>oval chalk brush</strong> or <strong>4-inch mini roller</strong>.</li>
              <li>Allow the first coat to dry for 2 to 3 hours.</li>
              <li>Smooth lightly with <strong>320-grit sandpaper</strong>; apply the second coat for rich color opacity.</li>
              <li>For a vintage distressed look: Gently rub corners, raised carvings, and leg edges with <strong>180-grit sandpaper</strong> (or a damp cotton rag) to reveal underlying wood grain.</li>
            </ul>
          </li>
          <li><strong>AFTER Painting (Protective Wax Sealing &amp; Buffing):</strong>
            <ul>
              <li>Peel masking tape at a 45-degree angle.</li>
              <li>Apply clear furniture wax in thin circular motions with a lint-free cloth; let cure for 24 hours.</li>
              <li>Buff the waxed surface with a clean microfiber cloth to a lustrous, silky satin sheen.</li>
              <li>Reinstall polished or antiqued brass hardware; allow 7 days before placing heavy items on the surface.</li>
            </ul>
          </li>
        </ol>
      </div>

`,
  'how-to-repaint-wooden-furniture-deco-pu-paint': `
      <h2>Before &amp; After Furniture Repainting Checklist &amp; Shopping Kit</h2>
      <p>To repaint old wooden furniture with high-durability Deco or PU paint and win Google featured snippet ranking, use this master procurement kit and 3-phase checklist:</p>

      <div style="background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
        <h3 style="margin-top: 0; color: var(--primary);">🛒 Furniture Repainting Shopping Kit (What You Need to Buy)</h3>
        <ul>
          <li><strong>Deco / Polyurethane (PU) or Premium Acrylic Paint:</strong> High-solids PU wood enamel (e.g., <em>Asian Paints PU Woodtech / Apcolite Premium Satin Enamel</em>) in satin or gloss finish.</li>
          <li><strong>1.5-Inch Blue Painter's Masking Tape:</strong> 2 to 3 rolls of low-tack crepe tape to mask drawer runners, glass panels, internal shelves, and hardware locations.</li>
          <li><strong>Sandpaper Grits 180 &amp; 320 (Plus 120-Grit Coarse):</strong>
            <ul>
              <li><strong>120/180-Grit Sandpaper:</strong> 120-grit for stripping old flaking varnish and 180-grit for leveling wood putty and scuffing primer.</li>
              <li><strong>320-Grit Silicon Carbide Sandpaper:</strong> For micro-smoothing between PU/Deco topcoats to eliminate dust nibs.</li>
            </ul>
          </li>
          <li><strong>High-Density Foam &amp; Microfiber Rollers:</strong> 4-inch high-density foam mini rollers for glass-smooth flat tabletops and cabinet door faces without brush ridges.</li>
          <li><strong>Fine Synthetic Brushes:</strong> 1.5-inch and 2-inch soft synthetic bristle brushes with flagged tips for precision trim, carved moldings, and chair spindles.</li>
          <li><strong>Wood Prep Supplies:</strong> Acrylic wood filler paste, white wood primer / PU sanding sealer, NC thinner / turpentine, and tack cloths.</li>
        </ul>

        <h3 style="color: var(--primary);">📋 Before, During &amp; After Execution Checklist</h3>
        <ol>
          <li><strong>BEFORE Painting (Hardware Removal, Sanding &amp; Wood Priming):</strong>
            <ul>
              <li>Dismantle drawer pulls, hinges, and locks; label them in plastic bags.</li>
              <li>Sand old varnish and polish down with <strong>180-grit sandpaper</strong> until the surface is uniform and matte.</li>
              <li>Fill gouges, dents, and screw holes with acrylic wood filler; sand flat with 180-grit paper.</li>
              <li>Wipe away all fine wood dust with a mineral spirit tack rag.</li>
              <li>Apply 1 coat of white wood primer or PU sanding sealer; allow 6 hours dry time, then smooth with <strong>320-grit sandpaper</strong>.</li>
              <li>Mask all internal drawer sides, glass inserts, and runners with <strong>1.5-inch blue painter's tape</strong>.</li>
            </ul>
          </li>
          <li><strong>DURING Painting (Applying Deco/PU Paint in Thin Layers):</strong>
            <ul>
              <li>Dilute paint with appropriate thinner (5–10% mineral turpentine or PU thinner); stir well.</li>
              <li>Paint detailed moldings, bevels, and edges using a <strong>2-inch soft synthetic brush</strong>.</li>
              <li>Roll large flat surfaces (tabletops, door faces) with a <strong>4-inch high-density foam roller</strong>, rolling in one uniform direction.</li>
              <li>Allow the first coat to dry for 8 to 12 hours.</li>
              <li>De-nib the surface gently with <strong>320-grit sandpaper</strong>; wipe completely clean with a dry microfiber cloth.</li>
              <li>Apply the second topcoat of Deco/PU paint for rock-hard durability and uniform sheen.</li>
            </ul>
          </li>
          <li><strong>AFTER Painting (Tape Removal, Hardware Reassembly &amp; Curing):</strong>
            <ul>
              <li>Peel masking tape at a 45-degree angle within 2 hours of topcoat application.</li>
              <li>Inspect surface with low-angle light to ensure zero sagging drips or orange-peel texture.</li>
              <li>Clean brushes in turpentine or thinner immediately; hang dry.</li>
              <li>Allow 72 hours of curing before reattaching handles and putting furniture back into active daily use.</li>
            </ul>
          </li>
        </ol>
      </div>

`
};

let updatedCount = 0;
for (const [slug, checklistHtml] of Object.entries(checklists)) {
  const slugMarker = `slug: '${slug}'`;
  const slugIndex = fileContent.indexOf(slugMarker);
  if (slugIndex === -1) {
    console.error(`Could not find slug ${slug}`);
    continue;
  }

  // Find Troubleshooting header after this slug
  const troubleMarker = `<h2>Troubleshooting Common Mistakes`;
  const troubleIndex = fileContent.indexOf(troubleMarker, slugIndex);
  if (troubleIndex === -1) {
    console.error(`Could not find Troubleshooting header for ${slug}`);
    continue;
  }

  // Check if checklist is already present in this post
  const nextSlugMarker = `slug: '`;
  const nextSlugIndex = fileContent.indexOf(nextSlugMarker, slugIndex + slugMarker.length);
  const postEnd = nextSlugIndex !== -1 ? nextSlugIndex : fileContent.length;
  const postContentSub = fileContent.substring(slugIndex, postEnd);

  if (postContentSub.includes('<h2>Before &amp; After') || postContentSub.includes('<h2>Before & After')) {
    console.log(`Checklist already present for ${slug}, skipping or updating...`);
    continue;
  }

  // Insert before <h2>Troubleshooting Common Mistakes
  fileContent = fileContent.substring(0, troubleIndex) + checklistHtml + fileContent.substring(troubleIndex);
  updatedCount++;
  console.log(`✅ Successfully inserted checklist into: ${slug}`);
}

fs.writeFileSync(blogDataPath, fileContent, 'utf8');
console.log(`\n🎉 Total posts updated: ${updatedCount}`);
