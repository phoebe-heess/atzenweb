import { createHandler, requireAuth, saveItem, itemKey } from '../_lib/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

const SEED_DATA = {
  venues: {
    all: 'ag:venues:all',
    items: [
      { id: 'v1', name: 'REWE Supermarkt', type: 'Supermarkt', isGastronomy: false, address: 'Königstraße 120, 90762 Fürth', distance: 0.32, rating: '4.2', isOpen: true, openingHours: '07:00 - 20:00', hasFood: true, dogFriendly: false, longitude: 11.015, latitude: 49.457 },
      { id: 'v2', name: 'EDEKA Schätz', type: 'Supermarkt', isGastronomy: false, address: 'Waldstraße 101, 90763 Fürth', distance: 0.5, rating: '4.5', isOpen: true, openingHours: '07:00 - 20:00', hasFood: true, dogFriendly: false, longitude: 11.020, latitude: 49.454 },
      { id: 'v3', name: 'Späti am Heizhaus', type: 'Späti', isGastronomy: false, address: 'Wandererstraße 89, 90429 Nürnberg', distance: 0.1, rating: '4.8', isOpen: true, openingHours: '14:00 - 02:00', hasFood: false, dogFriendly: true, longitude: 11.017, latitude: 49.456 },
      { id: 'v4', name: 'Getränkemarkt', type: 'Getränkemarkt', isGastronomy: false, address: 'Leyher Straße 70, 90431 Nürnberg', distance: 0.8, rating: '4.0', isOpen: false, openingHours: '09:00 - 18:00', hasFood: false, dogFriendly: false, longitude: 11.022, latitude: 49.458 },
      { id: 'v5', name: 'Biergarten Wöhrder Wiese', type: 'Biergarten', isGastronomy: true, address: 'Wassertorstraße 5, 90489 Nürnberg', distance: 1.2, rating: '4.7', isOpen: true, openingHours: '11:00 - 23:00', hasFood: true, dogFriendly: true, longitude: 11.025, latitude: 49.453 },
    ]
  },
  story: {
    all: 'ag:story:all',
    items: [
      { id: 1, year: '2020', title: 'Der Umzug aus Liebe', titleEn: 'Relocating for Love', text: 'Gabriel, ein waschechter Berliner Szene-Gastronom, bricht seine Zelte in der Hauptstadt ab und zieht für die Liebe ins fränkische Fürth. Er vermisst die Berliner Späti-Kultur, verliebt sich aber sofort in das legendär gute fränkische Bier.', textEn: 'Gabriel, a true Berlin nightlife creative, leaves the capital behind and relocates to Fürth, Bavaria, following his heart. He misses the late-night Berlin Späti kiosks, but instantly falls for the legendary local Franconian brewing heritage.', tagline: 'BERLIN GOES FRANKEN', taglineEn: 'BERLIN TO BAVARIA', image: 'Map' },
      { id: 2, year: '2020', title: 'Das Atzenhof-Aha!', titleEn: 'The Atzenhof Revelation', text: 'Bei Erkundungstouren stolpert Gabriel über das Fürther Ortsschild \'Atzenhof\'. Gänsehaut-Moment: Im Berliner Dialekt bedeutet \'Atze\' bester Kumpel oder Bruder. Ursprünglich mhd. \'atzen\' (zusammen essen/brotbrechen). Die perfekte Brücke war geboren!', textEn: 'While exploring his new surroundings, Gabriel spots the Fürth district road sign: \'Atzenhof\'. Goosebumps kick in: \'Atze\' is famous Berlin slang for a close friend or brother! The ultimate connection between his two home turf worlds was born.', tagline: 'STADTTEIL TRIFFT SLAENG', taglineEn: 'DESTINY COINCIDENCE', image: 'Compass' },
      { id: 3, year: '2021', title: 'Rezept perfektioniert', titleEn: 'Perfecting the Recipe', text: 'Gabriel perfektioniert sein Rezept mit Unterstützung lokaler Brauereien in Fürth. Monatelang tüftelt er an der perfekten Komposition für ein ehrliches, naturtrübes Kellerbier – gebraut für die besten Kumpels.', textEn: 'Gabriel perfects his recipe with support from local breweries in Fürth. He spends months refining the perfect composition for an authentic, unfiltered Kellerbier—crafted to be shared with brothers.', tagline: 'FÜRTHER GASTRO-POWER', taglineEn: 'LOCAL HOSPITALITY', image: 'Users' },
      { id: 4, year: '2022', title: 'Das Kuckucks-Prinzip', titleEn: 'The Cuckoo Brewery Model', text: 'Statt Millionen in eigene Tanks zu stecken, lebt Gabriel das Kuckucksbrauer-Prinzip. Er mietet freie Sude in traditionsreichen fränkischen Brauereien (z.B. in Buttenheim). Das schont Ressourcen, sichert überlegene Qualität und ehrt die alten Meister.', textEn: 'Instead of borrowing millions for his own factory, Gabriel goes \'Cuckoo\'. He rents idle tank capacities from iconic, generation-old Franconian family breweries. This recycling workflow honors master brewers while keeping the product fully independent.', tagline: 'TRANSPARENT & NACHHALTIG', taglineEn: 'CONSCIOUS COOPERATION', image: 'Infinity' },
      { id: 5, year: 'Heute', title: 'Hype in Franken statt Berlin', titleEn: 'Franconian Hype Override', text: 'Eigentlich war der Plan, das Bier in Berlin-Spätis großzuziehen. Doch das unfiltrierte Atzengold ist so süffig, dass die Franken selbst den Großteil austrinken! Wir erweitern ständig unsere Kapzitäten, um bald auch ganz Berlin glücklich zu machen.', textEn: 'The original business plan was to export the entire volume to late-night Berlin Spätis. However, the locals went wild for the recipe, making Nürnberg/Fürth/Erlangen top drinkers! We are expanding tank spaces to satisfy Berlin soon.', tagline: 'FRANCONIAN THIRST', taglineEn: 'CULT STATUS REACHED', image: 'Award' },
    ]
  },
  merch: {
    all: 'ag:merch:all',
    items: [
      { id: 'm1', name: 'Atzengold "Kutscher" 5-Panel Cap', price: 24.90, promoPrice: 22.00, description: 'Black water-resistant organic canvas with custom gold stenciled "Atzengold" raw embroidery. Flat brim style.', category: 'Accessory', image: 'cap', inStock: true },
      { id: 'm5', name: 'Atzen-Shirt "Classic Gold"', price: 29.90, description: '100% fine organic ring-spun combed cotton. High-comfort heavyweight streetwear fit featuring the iconic stenciled gold brand crest.', category: 'Apparel', image: 'shirt', sizes: ['S', 'M', 'L', 'XL'], inStock: true },
      { id: 'm2', name: 'Atzen-Hoodie "Naturtrüb" (Oversized)', price: 69.90, description: '450gsm heavyweight sand-washed organic cotton with original Berlin-Bavaria spray-stencil back print.', category: 'Apparel', image: 'hoodie', sizes: ['S', 'M', 'L', 'XL'], inStock: true },
      { id: 'm3', name: 'Bayerischer Steinkrug (0.5L)', price: 19.90, description: 'Handcrafted grey stoneware beer mug which keeps Atzengold Kellerbier cold much longer than glass. Cobalt fired logo.', category: 'Drinkware', image: 'mug', inStock: true },
      { id: 'm4', name: 'Atzen-Glas Goldrand Edition', price: 12.90, description: 'Thin-walled elegant crystal lager glass with real fluid gold rim styling. Elevates yeast citrus aromas.', category: 'Drinkware', image: 'glass', inStock: true },
    ]
  },
  testimonials: {
    all: 'ag:testimonials:all',
    items: [
      { id: 't1', name: 'Lukas Schmidt', role: 'Kneipen-Gänger, Nürnberg', textDE: 'Endlich ein Bier, das schmeckt wie früher. Schön süffig und naturtrüb direkt vom Fass am Pflaster.', textEN: 'Finally a beer that tastes like the good old days. Incredibly drinkable and beautifully cloudy straight on the pavement.', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80', location: 'nurnberg' },
      { id: 't2', name: 'Moritz Reinhardt', role: 'Späti-Liebhaber, Fürth', textDE: 'Atzengold hat die Berliner Späti-Seele nach Fürth gebracht. Der beste Begleiter für lange Nächte am Heizhaus.', textEN: 'Atzengold brought the Berlin Späti soul to Franconia. The absolute best companion for long nights near Heizhaus.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80', location: 'furth' },
      { id: 't3', name: 'Sarah König', role: 'Atzin vom Dienst, Berlin', textDE: 'Unglaublich süffig und herrlich unfiltriert. Die Kohlensäure ist perfekt ausbalanciert – extrem gefährlich lecker!', textEN: 'Unbelievably smooth and delightfully unfiltered. Carbonation is spot on – extremely dangerously delicious!', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80', location: 'berlin' },
      { id: 't4', name: 'Jonas Bergmann', role: 'Stammgast, Gostenhof', textDE: 'Als Franke bin ich beim Bier echt wählerisch. Aber das Atzengold Hell hat mich absolut umgehauen.', textEN: 'Being Franconian, I am very picky about my cellar beers. But Atzengold completely blew me away.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80', location: 'nurnberg' },
      { id: 't5', name: 'Max Krüger', role: 'Pavement-Genießer, Berlin', textDE: 'Einfach ehrlich. Kein Schnickschnack. Schmeckt am besten im Sonnenuntergang auf der Bordsteinkante.', textEN: 'Simply honest. No nonsense. Tastes best during sunset sitting directly on the pavement curb.', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80', location: 'berlin' },
      { id: 't6', name: 'Elena Wagner', role: 'Atzin der ersten Stunde, Nürnberg', textDE: 'Das Design der Flasche hat mich angelockt, der ehrliche Geschmack hat mich zum Fan gemacht. Ein Hoch auf die Atzen!', textEN: 'The bottle art drew me in, the honest flavor made me a lifelong fan. Cheers to the Atzen!', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80', location: 'nurnberg' },
      { id: 't7', name: 'Farhan Ali', role: 'Pegnitz-Griller, Nürnberg', textDE: 'Egal ob beim Grillen an der Pegnitz oder Späti-Tour in Kreuzberg: Atzengold gehört einfach dazu.', textEN: 'Whether grilling by the Pegnitz river or doing a Späti tour in Kreuzberg, Atzold is always there.', image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&h=100&q=80', location: 'nurnberg' },
      { id: 't8', name: 'Sina Beck', role: 'Biergarten-Fan, Erlangen', textDE: 'Ein ehrliches fränkisches Kellerbier mit der perfekten Portion Berliner Schnauze. Das neue Standardbier bei uns.', textEN: 'An honest Franconian Kellerbier with a perfect portion of Berlin character. Our new go-to standard.', image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=100&h=100&q=80', location: 'erlangen' },
      { id: 't9', name: 'Hassan Al-Saeed', role: 'Bordstein-Philosoph, Fürth', textDE: 'Gekühlt am besten, aber läuft auch lauwarm an der Ecke runter wie Öl. Absoluter Atzen-Klassiker.', textEN: 'Best when chilled, but flows down like oil even lukewarm at the corner. Absolute Atzen classic.', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&h=100&q=80', location: 'furth' },
    ]
  },
  beerProfile: {
    key: 'ag:beer_profile',
    data: {
      abv: '5.2%', ibu: '22', color: '15 (Strohgelb)', originalWort: '12.8°P',
      gauges: [
        { label: 'Yeast Character', targetValue: 85, colorClass: 'bg-accent', textColorClass: 'text-accent' },
        { label: 'Hop Bitterness', targetValue: 60, colorClass: 'bg-ink', textColorClass: 'text-ink' },
        { label: 'Citrus Notes', targetValue: 45, colorClass: 'bg-primary', textColorClass: 'text-primary' },
      ],
      characteristics: [
        { key: 'brewAbv', label: 'ABV', value: '5.2%' },
        { key: 'brewUnfiltered', label: 'Style', value: 'Unfiltered' },
        { key: 'brewModel', label: 'Model', value: 'Cuckoo Brewing' },
      ]
    }
  },
  brandHub: {
    key: 'ag:brandhub',
    data: {
      colors: [
        { name: 'Atzen Gold', role: 'Primary Brand Accent & Warmth', hex: 'oklch(0.75 0.15 85.0)', rgb: 'rgb(212, 175, 55)', cmyk: 'C0 M17 Y74 M17', usage: 'Buttons, links, highlights, decorative accents', textColor: 'text-ink', bgColor: 'bg-accent' },
        { name: 'Deep Forest', role: 'Primary Background (Dark Mode)', hex: 'oklch(0.25 0.06 150.0)', rgb: 'rgb(26, 47, 35)', cmyk: 'C45 M0 M26 M82', usage: 'Main background, menu overlays', textColor: 'text-canvas', bgColor: 'bg-primary-deep' },
        { name: 'Buttermilk Canvas', role: 'Primary Background (Light Mode)', hex: 'oklch(0.96 0.02 90.0)', rgb: 'rgb(245, 243, 235)', cmyk: 'C0 M1 M4 M4', usage: 'Main background in light mode', textColor: 'text-ink', bgColor: 'bg-canvas' },
        { name: 'Ink Black', role: 'Primary Text', hex: 'oklch(0.15 0.01 150.0)', rgb: 'rgb(25, 28, 25)', cmyk: 'C0 M0 M0 M90', usage: 'Body text, headings', textColor: 'text-canvas', bgColor: 'bg-ink' },
        { name: 'Berlin Magenta', role: 'Secondary Accent', hex: '#B83A3D', rgb: 'rgb(184, 58, 61)', cmyk: 'C0 M68 M67 M28', usage: 'Social media, restricted badges, small accents', textColor: 'text-canvas', bgColor: 'bg-magenta' },
      ],
      values: [
        { title: 'Mission & Dream', description: 'Bringing Franconian Kellerbier into Berlin urban street culture by creating a genuine bridge between traditional Bavarian craftsmanship and the diversity of the city.' },
        { title: 'Brand Personality', description: 'Bold, authentic, unfiltered. A friend you can rely on with a rough exterior and a warm core. Urban meets rural. Heritage with a modern edge.' },
        { title: 'Target Audience', description: 'Beer lovers 25-45 who value quality craftsmanship, cultural authenticity, and consciously local connections.' },
      ],
      coreValues: [
        { title: 'Heritage Honesty', description: 'We respect traditional Franconian purity laws and cooperatively use centuries-old brewery capacities.' },
        { title: 'Cultural Autonomy', description: 'We stay independent. No big corporation dictates our ingredients, prices, or brand voice.' },
        { title: 'Radical Transparency', description: 'We show exactly where our beer is brewed, by whom, and at what cost percentage stays local.' },
      ]
    }
  },
};

export default createHandler({
  async POST(req: VercelRequest, res: VercelResponse) {
    if (!requireAuth(req, res)) return;

    const results: Record<string, number> = {};

    // Seed venues
    let seeded = 0;
    for (const venue of SEED_DATA.venues.items) {
      await saveItem('venues', venue.id, venue);
      seeded++;
    }
    results.venues = seeded;

    // Seed story
    seeded = 0;
    for (const node of SEED_DATA.story.items) {
      await saveItem('story', String(node.id), node);
      seeded++;
    }
    results.story = seeded;

    // Seed merch
    seeded = 0;
    for (const item of SEED_DATA.merch.items) {
      await saveItem('merch', item.id, item);
      seeded++;
    }
    results.merch = seeded;

    // Seed testimonials
    seeded = 0;
    for (const item of SEED_DATA.testimonials.items) {
      await saveItem('testimonials', item.id, item);
      seeded++;
    }
    results.testimonials = seeded;

    // Seed beer profile (singleton)
    await kv.set(SEED_DATA.beerProfile.key, SEED_DATA.beerProfile.data);
    results.beerProfile = 1;

    // Seed brand hub (singleton)
    await kv.set(SEED_DATA.brandHub.key, SEED_DATA.brandHub.data);
    results.brandHub = 1;

    res.json({ success: true, seeded: results });
  }
});
