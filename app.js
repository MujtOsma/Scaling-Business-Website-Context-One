// ================================================================
// AMARA — Women's Streetwear Ecommerce
//
// To brand this site: replace every "AMARA" string with your
// final brand name. The BRAND_NAME constant at the top controls
// all in-app references.
//
// Components (in order of definition):
//   CartCtx / CartProvider / useCart  — in-memory cart state
//   SVG Icon components               — IcoBag, IcoMenu, …
//   CartButton                        — reusable cart icon + badge
//   Nav                               — sticky nav + hamburger
//   HeroSection                       — full-bleed homepage hero
//   ProductCard                       — grid card (homepage + related)
//   CurrentDrop                       — drop grid section
//   BrandStatement                    — mission copy block
//   LookbookTeaser                    — 3-image editorial strip
//   EmailCapture                      — email signup
//   Footer                            — site-wide footer
//   Homepage                          — composes all homepage sections
//   SizeGuideModal                    — modal triggered from PDP
//   AccordionItem                     — expand/collapse row
//   ImageGallery                      — swipeable PDP gallery
//   ProductDetailPage (PDP)           — full product page
//   CartDrawer                        — slide-in cart panel
//   App                               — root, in-memory router
// ================================================================

const { createContext, useContext, useState, useEffect, useRef } = React;

// ── BRAND CONFIG ─────────────────────────────────────────────────
// Change BRAND_NAME before going live.
const BRAND_NAME = 'AMARA';

// ── PRODUCT DATA ─────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 1,
    name: 'Roots Coord Set',
    dropName: 'The Roots Capsule',
    price: 89,
    display: '$89 CAD',
    colors: [
      { name: 'Midnight',   hex: '#1A1A1A' },
      { name: 'Terracotta', hex: '#C4622D' },
      { name: 'Cream',      hex: '#E8E0D2' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: { XS: 7, S: 10, M: 3, L: 0, XL: 9 },
    category: 'Coord Sets',
    imgCount: 4,
    imgShade: ['#D9D0C4', '#C8BFB3', '#BAB0A4', '#ADA39A'],
    material: '95% Cotton, 5% Elastane. Medium-weight brushed fabric with slight stretch.',
    related: [2, 3, 4],
  },
  {
    id: 2,
    name: 'Roots Seamless Gym Set',
    dropName: 'The Roots Capsule',
    price: 74,
    display: '$74 CAD',
    colors: [
      { name: 'Midnight', hex: '#1A1A1A' },
      { name: 'Mocha',    hex: '#6B4226' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: { XS: 5, S: 8, M: 5, L: 2, XL: 11 },
    category: 'Gym Sets',
    imgCount: 3,
    imgShade: ['#2A2A2A', '#343434', '#1E1E1E'],
    material: '88% Nylon, 12% Spandex. Seamless, four-way stretch, squat-proof.',
    related: [1, 3, 4],
  },
  {
    id: 3,
    name: 'Heritage Jorts',
    dropName: 'The Roots Capsule',
    price: 58,
    display: '$58 CAD',
    colors: [
      { name: 'Washed Indigo', hex: '#3A4A6B' },
      { name: 'Light Wash',    hex: '#8A9BBC' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: { XS: 4, S: 4, M: 1, L: 6, XL: 3 },
    category: 'Bottoms',
    imgCount: 3,
    imgShade: ['#5A6B8A', '#6A7B9A', '#4A5B7A'],
    material: '100% Cotton denim. Mid-rise, raw hem, lightly distressed.',
    related: [1, 2, 4],
  },
  {
    id: 4,
    name: 'Y2K Shield Frames',
    dropName: 'The Roots Capsule',
    price: 32,
    display: '$32 CAD',
    colors: [
      { name: 'Black',      hex: '#0A0A0A' },
      { name: 'Tortoise',   hex: '#5C3A1E' },
      { name: 'Clear Smoke',hex: '#C8C4BC' },
    ],
    sizes: ['One Size'],
    stock: { 'One Size': 6 },
    category: 'Accessories',
    imgCount: 2,
    imgShade: ['#E0D8CC', '#D0C8BC'],
    material: 'TR90 lightweight frame. UV400 polycarbonate lenses. Oversized shield silhouette.',
    related: [1, 2, 3],
  },
];

// ── CART CONTEXT ─────────────────────────────────────────────────
const CartCtx = createContext(null);

function CartProvider({ children }) {
  const [items,  setItems]  = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const cartCount = items.reduce((n, i) => n + i.qty, 0);
  const subtotal  = items.reduce((n, i) => n + i.price * i.qty, 0);

  function addItem(product, size, color) {
    const key = `${product.id}__${size}__${color.name}`;
    setItems(prev => {
      const found = prev.find(i => i.key === key);
      if (found) return prev.map(i => i.key === key ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, {
        key, productId: product.id,
        name: product.name, dropName: product.dropName,
        size, color, price: product.price,
        qty: 1,
        thumbShade: product.imgShade[0],
      }];
    });
    setIsOpen(true);
  }

  function removeItem(key) {
    setItems(prev => prev.filter(i => i.key !== key));
  }

  function changeQty(key, delta) {
    setItems(prev =>
      prev
        .map(i => i.key === key ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0)
    );
  }

  return (
    <CartCtx.Provider value={{ items, cartCount, subtotal, isOpen, setIsOpen, addItem, removeItem, changeQty }}>
      {children}
    </CartCtx.Provider>
  );
}

function useCart() { return useContext(CartCtx); }

// ── ICONS ─────────────────────────────────────────────────────────
function IcoBag({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  );
}

function IcoMenu({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <line x1="3" y1="6"  x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}

function IcoX({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <line x1="18" y1="6"  x2="6"  y2="18"/>
      <line x1="6"  y1="6"  x2="18" y2="18"/>
    </svg>
  );
}

function IcoArrowLeft({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7"/>
    </svg>
  );
}

function IcoChevronDown({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6"/>
    </svg>
  );
}

function IcoTrash({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
      <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
    </svg>
  );
}

function IcoInstagram({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

function IcoTiktok({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5
        2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27
        0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0
        006.33-6.34v-7a8.16 8.16 0 004.77 1.52V6.37a4.85 4.85 0 01-1-.32z"/>
    </svg>
  );
}

// ── CART BUTTON ───────────────────────────────────────────────────
function CartButton({ className = '' }) {
  const { cartCount, setIsOpen } = useCart();
  return (
    <button
      onClick={() => setIsOpen(true)}
      className={`relative flex items-center ${className}`}
      aria-label={`Open bag — ${cartCount} item${cartCount !== 1 ? 's' : ''}`}
    >
      <IcoBag />
      {cartCount > 0 && (
        <span
          className="absolute -top-2 -right-2.5 bg-near-black text-white text-[9px] font-bold
            w-[17px] h-[17px] rounded-full flex items-center justify-center leading-none"
        >
          {cartCount > 9 ? '9+' : cartCount}
        </span>
      )}
    </button>
  );
}

// ── NAV ───────────────────────────────────────────────────────────
const NAV_LINKS = ['Shop', 'Lookbook', 'Story', 'Drops'];

function Nav({ onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  function close() { setMenuOpen(false); }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-black/[0.07]">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

          {/* Logo */}
          <button
            onClick={() => { onNavigate('home'); close(); }}
            className="font-display font-black text-[1.6rem] tracking-[0.22em] uppercase leading-none"
          >
            {BRAND_NAME}
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(l => (
              <button key={l} className="nav-link text-[0.78rem] font-medium tracking-[0.14em] uppercase text-black/70 hover:text-black">
                {l}
              </button>
            ))}
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-4">
            <button className="hidden md:block nav-link text-[0.78rem] font-medium tracking-[0.14em] uppercase text-black/70 hover:text-black">
              Account
            </button>
            <CartButton />
            <button
              className="md:hidden -mr-1 p-1"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <IcoX /> : <IcoMenu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu — slides open below nav bar */}
      <div className={`mobile-menu ${menuOpen ? 'is-open' : ''} fixed top-14 left-0 right-0 z-30 bg-white border-b border-black/[0.07] md:hidden`}>
        <div className="px-5 pt-5 pb-6 flex flex-col gap-1">
          {[...NAV_LINKS, 'Account'].map(l => (
            <button
              key={l}
              onClick={close}
              className="text-left font-display font-black text-2xl tracking-[0.18em] uppercase py-2.5 border-b border-black/[0.05] last:border-0"
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ── HERO SECTION ──────────────────────────────────────────────────
function HeroSection({ onNavigate }) {
  return (
    <section className="hero-section w-full">
      <p className="text-white/15 text-[0.6rem] tracking-[0.3em] uppercase mb-auto mt-10 font-body">
        [ Swap with full-bleed campaign photograph or video ]
      </p>
      <div className="text-center px-4 pb-2">
        <p className="text-white/50 text-[0.7rem] sm:text-xs tracking-[0.35em] uppercase mb-5 font-body font-light">
          Now dropping — The Roots Capsule
        </p>
        <button
          onClick={() => onNavigate('product', PRODUCTS[0])}
          className="transition-btn inline-block bg-white text-near-black text-[0.72rem] font-semibold
            tracking-[0.25em] uppercase px-10 py-3.5 hover:bg-accent hover:text-white"
        >
          Shop the drop
        </button>
      </div>
    </section>
  );
}

// ── PRODUCT CARD ──────────────────────────────────────────────────
function ProductCard({ product, onNavigate }) {
  const anyLow = Object.values(product.stock).some(s => s > 0 && s <= 3);
  const allOut = Object.values(product.stock).every(s => s === 0);

  return (
    <article
      className="product-card group"
      onClick={() => onNavigate('product', product)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onNavigate('product', product)}
      aria-label={`View ${product.name}`}
    >
      {/* Image area */}
      <div className="card-img aspect-[3/4] mb-3 relative">
        <div
          className="img-placeholder absolute inset-0"
          style={{ backgroundColor: product.imgShade[0] }}
        >
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <span className="text-black/20 text-[0.6rem] tracking-widest text-center px-4 font-body leading-relaxed">
              [ {product.category}<br/>{product.name} ]
            </span>
          </div>
        </div>
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
          {allOut && (
            <span className="bg-black/55 text-white text-[0.58rem] tracking-[0.2em] uppercase px-2 py-1">
              Sold out
            </span>
          )}
          {!allOut && anyLow && (
            <span className="bg-near-black text-white text-[0.58rem] tracking-[0.2em] uppercase px-2 py-1">
              Low stock
            </span>
          )}
        </div>
      </div>

      {/* Text */}
      <div>
        <p className="text-[0.58rem] text-black/30 tracking-[0.28em] uppercase mb-0.5 font-body">{product.dropName}</p>
        <h3 className="font-display font-bold text-[1.05rem] tracking-[0.08em] uppercase leading-snug mb-1">
          {product.name}
        </h3>
        <p className="text-sm font-body text-black/75">{product.display}</p>
      </div>
    </article>
  );
}

// ── CURRENT DROP ──────────────────────────────────────────────────
function CurrentDrop({ onNavigate }) {
  return (
    <section className="py-20 px-4 sm:px-6 max-w-screen-xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[0.6rem] tracking-[0.32em] uppercase text-black/30 mb-2 font-body">Now dropping</p>
          <h2 className="font-display font-black text-[2.6rem] sm:text-[3.2rem] uppercase tracking-[0.06em] leading-none">
            The Roots Capsule
          </h2>
        </div>
        <button className="hidden sm:block text-[0.7rem] tracking-[0.2em] uppercase border-b border-near-black pb-0.5 hover:border-accent hover:text-accent transition-colors">
          View all
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {PRODUCTS.map(p => <ProductCard key={p.id} product={p} onNavigate={onNavigate} />)}
      </div>

      <div className="mt-8 flex sm:hidden">
        <button className="text-[0.7rem] tracking-[0.2em] uppercase border-b border-near-black pb-0.5">
          View all
        </button>
      </div>
    </section>
  );
}

// ── BRAND STATEMENT ───────────────────────────────────────────────
function BrandStatement() {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-[0.6rem] tracking-[0.38em] uppercase text-black/25 mb-10 font-body">
          Our mission
        </p>
        <blockquote
          className="font-display font-black uppercase leading-[1.08]
            text-[1.95rem] sm:text-[2.55rem] md:text-[3rem] tracking-[0.04em]"
        >
          "We exist because the culture that built Y2K fashion never got its own
          brand&nbsp;— so we built it, for her, from the ground up."
        </blockquote>
      </div>
    </section>
  );
}

// ── LOOKBOOK TEASER ───────────────────────────────────────────────
const LOOKBOOK_TILES = [
  { label: 'Editorial — Vol. I',   shade: '#222' },
  { label: 'Editorial — Vol. II',  shade: '#2C2C2C' },
  { label: 'Editorial — Vol. III', shade: '#1A1A1A' },
];

function LookbookTeaser() {
  return (
    <section className="py-16 px-4 sm:px-6 max-w-screen-xl mx-auto">
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="font-display font-black text-[2.2rem] sm:text-[2.8rem] uppercase tracking-[0.06em] leading-none">
          Lookbook
        </h2>
        <button className="text-[0.7rem] tracking-[0.2em] uppercase border-b border-near-black pb-0.5 hover:border-accent hover:text-accent transition-colors">
          View all
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {LOOKBOOK_TILES.map((t, i) => (
          <div key={i} className="lookbook-tile aspect-[2/3] relative">
            <div className="img-placeholder-dark absolute inset-0" style={{ backgroundColor: t.shade }}>
              <div className="absolute bottom-3 left-3 right-3 z-10">
                <span className="text-white/20 text-[0.58rem] tracking-widest font-body">[ {t.label} ]</span>
              </div>
            </div>
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 z-20" />
          </div>
        ))}
      </div>
    </section>
  );
}

// ── EMAIL CAPTURE ─────────────────────────────────────────────────
function EmailCapture() {
  const [email,     setEmail]     = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  }

  return (
    <section className="bg-near-black text-white py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-md mx-auto text-center">
        <p className="text-[0.6rem] tracking-[0.38em] uppercase text-white/25 mb-4 font-body">Inner circle</p>
        <h2 className="font-display font-black uppercase leading-none text-[2.8rem] sm:text-[3.4rem] tracking-[0.06em] mb-3">
          Join the {BRAND_NAME} list
        </h2>
        <p className="text-white/35 text-sm font-body mb-10 leading-relaxed">
          Drop alerts and restock notifications. No noise.
        </p>

        {submitted ? (
          <p className="font-display font-black text-3xl uppercase tracking-[0.15em] text-accent">
            You're in.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 bg-transparent border border-white/18 px-4 py-3.5 text-white
                placeholder-white/22 text-sm font-body focus:outline-none focus:border-white/55
                transition-colors"
            />
            <button
              type="submit"
              className="transition-btn bg-white text-near-black px-8 py-3.5 text-[0.7rem]
                font-semibold tracking-[0.22em] uppercase hover:bg-accent hover:text-white flex-shrink-0"
            >
              Join
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────
function Footer({ onNavigate }) {
  return (
    <footer className="bg-near-black text-white py-14 px-4 sm:px-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <button
              onClick={() => onNavigate('home')}
              className="font-display font-black text-xl tracking-[0.22em] uppercase mb-3 block"
            >
              {BRAND_NAME}
            </button>
            <p className="text-white/30 text-xs font-body leading-relaxed">
              For her. From the ground up.<br/>Toronto, ON — Canada
            </p>
            <div className="flex gap-4 mt-5">
              <a href="#" aria-label="Instagram" className="text-white/35 hover:text-white transition-colors">
                <IcoInstagram />
              </a>
              <a href="#" aria-label="TikTok" className="text-white/35 hover:text-white transition-colors">
                <IcoTiktok />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="text-[0.58rem] tracking-[0.28em] uppercase text-white/25 mb-4 font-body">Shop</p>
            <ul className="space-y-2.5 text-sm text-white/50 font-body">
              {['The Roots Capsule', 'Coord Sets', 'Gym Sets', 'Accessories', 'Drops Archive'].map(l => (
                <li key={l}><button className="hover:text-white transition-colors">{l}</button></li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="text-[0.58rem] tracking-[0.28em] uppercase text-white/25 mb-4 font-body">Info</p>
            <ul className="space-y-2.5 text-sm text-white/50 font-body">
              {['Our Story', 'Size Guide', 'Shipping', 'Returns & Exchanges', 'Contact'].map(l => (
                <li key={l}><button className="hover:text-white transition-colors">{l}</button></li>
              ))}
            </ul>
          </div>

          {/* Follow */}
          <div>
            <p className="text-[0.58rem] tracking-[0.28em] uppercase text-white/25 mb-4 font-body">Follow</p>
            <ul className="space-y-2.5 text-sm text-white/50 font-body">
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">TikTok</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row justify-between gap-2">
          <p className="text-white/18 text-[0.63rem] font-body">© 2025 {BRAND_NAME}. All rights reserved.</p>
          <div className="flex gap-4">
            {['Privacy Policy', 'Terms', 'Return Policy'].map(l => (
              <button key={l} className="text-white/18 text-[0.63rem] font-body hover:text-white/50 transition-colors">{l}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── HOMEPAGE ──────────────────────────────────────────────────────
function Homepage({ onNavigate }) {
  return (
    <main>
      <HeroSection  onNavigate={onNavigate} />
      <CurrentDrop  onNavigate={onNavigate} />
      <BrandStatement />
      <LookbookTeaser />
      <EmailCapture />
      <Footer onNavigate={onNavigate} />
    </main>
  );
}

// ── SIZE GUIDE MODAL ──────────────────────────────────────────────
const SIZE_ROWS = [
  ['XS', '30–32"', '23–25"', '33–35"'],
  ['S',  '32–34"', '25–27"', '35–37"'],
  ['M',  '34–36"', '27–29"', '37–39"'],
  ['L',  '36–38"', '29–31"', '39–41"'],
  ['XL', '38–40"', '31–33"', '41–43"'],
];

function SizeGuideModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div className="relative bg-white w-full sm:w-auto sm:min-w-[400px] sm:max-w-md
        max-h-[90vh] overflow-y-auto rounded-t-xl sm:rounded-none">
        <div className="flex justify-between items-center px-6 py-5 border-b border-black/[0.07]">
          <h3 className="font-display font-black text-xl uppercase tracking-[0.12em]">Size Guide</h3>
          <button onClick={onClose} className="text-black/40 hover:text-black transition-colors">
            <IcoX />
          </button>
        </div>
        <div className="px-6 py-5">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-black/10">
                {['Size', 'Bust', 'Waist', 'Hip'].map(h => (
                  <th key={h} className="text-left py-2.5 font-semibold text-[0.68rem] tracking-[0.12em] uppercase text-black/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZE_ROWS.map(([size, ...vals]) => (
                <tr key={size} className="border-b border-black/[0.05]">
                  <td className="py-2.5 font-semibold">{size}</td>
                  {vals.map((v, i) => <td key={i} className="py-2.5 text-black/60">{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-[0.65rem] text-black/30 font-body leading-relaxed">
            All measurements in inches. When between sizes, size up for a relaxed fit.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── ACCORDION ─────────────────────────────────────────────────────
function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-black/[0.07]">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex justify-between items-center py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-[0.7rem] tracking-[0.2em] uppercase font-semibold font-body">{title}</span>
        <span className={`text-black/35 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <IcoChevronDown />
        </span>
      </button>
      <div className={`accordion-body ${open ? 'is-open' : ''}`}>
        <div className="pb-5 text-sm text-black/50 font-body leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

// ── IMAGE GALLERY ─────────────────────────────────────────────────
function ImageGallery({ product }) {
  const [idx, setIdx] = useState(0);
  const total  = product.imgCount;
  const touchX = useRef(null);

  function prev() { setIdx(i => (i - 1 + total) % total); }
  function next() { setIdx(i => (i + 1) % total); }

  function onTouchStart(e) { touchX.current = e.touches[0].clientX; }
  function onTouchEnd(e) {
    if (touchX.current === null) return;
    const d = touchX.current - e.changedTouches[0].clientX;
    if (Math.abs(d) > 44) d > 0 ? next() : prev();
    touchX.current = null;
  }

  const shade = i => product.imgShade[i] ?? product.imgShade[0];

  return (
    <div className="flex flex-col-reverse md:flex-row md:items-start gap-3">

      {/* Thumbnail strip — horizontal on mobile, vertical on desktop */}
      <div className="thumb-strip flex md:flex-col gap-2 flex-shrink-0">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`flex-shrink-0 w-14 h-[70px] border-2 transition-colors overflow-hidden relative
              ${idx === i ? 'border-near-black' : 'border-transparent hover:border-black/30'}`}
            style={{ backgroundColor: shade(i) }}
            aria-label={`View image ${i + 1}`}
          >
            <div className="img-placeholder absolute inset-0" style={{ backgroundColor: shade(i) }} />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div
        className="flex-1 relative overflow-hidden select-none"
        style={{ aspectRatio: '3/4' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="img-placeholder absolute inset-0 transition-colors duration-200"
          style={{ backgroundColor: shade(idx) }}
        >
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <p className="text-black/18 text-[0.62rem] tracking-widest text-center px-8 font-body leading-loose">
              [ Image {idx + 1} / {total}<br/>{product.name} ]
            </p>
          </div>
        </div>

        {/* Prev / next arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/80
            hover:bg-white flex items-center justify-center transition-colors"
          aria-label="Previous image"
        >
          <IcoArrowLeft size={14} />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/80
            hover:bg-white flex items-center justify-center transition-colors rotate-180"
          aria-label="Next image"
        >
          <IcoArrowLeft size={14} />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors
                ${i === idx ? 'bg-near-black' : 'bg-near-black/22'}`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── PRODUCT DETAIL PAGE ───────────────────────────────────────────
function ProductDetailPage({ product, onBack, onNavigate }) {
  const { addItem } = useCart();
  const [color,     setColor]     = useState(product.colors[0]);
  const [size,      setSize]      = useState(null);
  const [sizeGuide, setSizeGuide] = useState(false);
  const [error,     setError]     = useState('');

  const related = PRODUCTS.filter(p => product.related.includes(p.id));

  function stockFor(s)   { return product.stock[s] ?? 0; }

  function scarcityMsg() {
    if (!size) return null;
    const n = stockFor(size);
    if (n > 0 && n <= 3) return `Only ${n} left in size ${size}`;
    return null;
  }

  function handleAdd() {
    if (!size) { setError('Select a size to continue'); return; }
    if (stockFor(size) === 0) { setError('This size is sold out'); return; }
    setError('');
    addItem(product, size, color);
  }

  return (
    <>
      {sizeGuide && <SizeGuideModal onClose={() => setSizeGuide(false)} />}

      {/* Sticky sub-header */}
      <div className="sticky top-14 z-30 bg-white border-b border-black/[0.07]">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-11 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-body text-black/45 hover:text-black transition-colors"
          >
            <IcoArrowLeft size={15} /> Back
          </button>
          <CartButton />
        </div>
      </div>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 pb-28 md:pb-12">
        <div className="grid md:grid-cols-[1fr_420px] lg:grid-cols-[1fr_460px] gap-8 lg:gap-16">

          {/* Gallery column */}
          <ImageGallery product={product} />

          {/* Info column */}
          <div>
            <p className="text-[0.58rem] tracking-[0.32em] uppercase text-black/28 mb-1.5 font-body">
              {product.dropName}
            </p>
            <h1 className="font-display font-black uppercase text-[2.6rem] sm:text-[3rem]
              tracking-[0.05em] leading-[1.02] mb-4">
              {product.name}
            </h1>
            <p className="text-xl font-body mb-7">{product.display}</p>

            {/* Colour selector */}
            <div className="mb-6">
              <p className="text-[0.62rem] tracking-[0.22em] uppercase text-black/38 mb-3 font-body">
                Colour — <span className="text-near-black">{color.name}</span>
              </p>
              <div className="flex gap-3">
                {product.colors.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c)}
                    className={`color-swatch ${color.name === c.name ? 'is-selected' : ''}`}
                    style={{ backgroundColor: c.hex }}
                    aria-label={c.name}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-3">
                <p className="text-[0.62rem] tracking-[0.22em] uppercase text-black/38 font-body">Size</p>
                <button
                  onClick={() => setSizeGuide(true)}
                  className="text-[0.62rem] tracking-[0.15em] underline text-black/38
                    hover:text-near-black transition-colors font-body"
                >
                  Size guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => {
                  const out = stockFor(s) === 0;
                  return (
                    <button
                      key={s}
                      onClick={() => { if (!out) { setSize(s); setError(''); } }}
                      disabled={out}
                      className={`size-pill ${size === s ? 'is-selected' : ''} ${out ? 'is-out' : ''}`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scarcity signal — only shown when genuinely low */}
            {scarcityMsg() && (
              <p className="text-[0.75rem] font-medium text-accent mb-4 font-body">{scarcityMsg()}</p>
            )}

            {/* Validation error */}
            {error && (
              <p className="text-[0.75rem] text-red-500 mb-3 font-body">{error}</p>
            )}

            {/* Add to bag — desktop only (mobile is pinned to bottom) */}
            <button
              onClick={handleAdd}
              className="hidden md:block transition-btn w-full bg-near-black text-white py-4
                text-[0.7rem] font-semibold tracking-[0.22em] uppercase mb-8 hover:bg-accent"
            >
              Add to bag
            </button>

            {/* Product detail accordions */}
            <div className="border-t border-black/[0.07] mt-2">
              <AccordionItem title="Material & Care">
                <p>{product.material}</p>
                <p className="mt-2">Machine wash cold, gentle cycle. Lay flat to dry. Do not bleach or tumble dry.</p>
              </AccordionItem>
              <AccordionItem title="Shipping">
                <p>Free standard shipping on orders over $100 CAD. Express available at checkout.</p>
                <p className="mt-2">Ships within 2–4 business days. Delivery 3–7 business days within Canada.</p>
              </AccordionItem>
              <AccordionItem title="Returns & Exchanges">
                <p>14-day return window from delivery date. Items must be unworn, unwashed, and untagged.</p>
                <p className="mt-2">Final sale items are non-refundable. Exchanges subject to availability.</p>
              </AccordionItem>
            </div>
          </div>
        </div>

        {/* You may also like */}
        <div className="mt-20 sm:mt-28">
          <h2 className="font-display font-black uppercase text-[2rem] sm:text-[2.5rem] tracking-[0.06em] mb-10">
            You may also like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
            {related.slice(0, 3).map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onNavigate={(_, prod) => onNavigate('product', prod)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Mobile pinned add-to-bag bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-black/[0.07] px-4 py-3 mobile-atb-bar">
        <button
          onClick={handleAdd}
          className="transition-btn w-full bg-near-black text-white py-4
            text-[0.7rem] font-semibold tracking-[0.22em] uppercase hover:bg-accent"
        >
          Add to bag
        </button>
      </div>
    </>
  );
}

// ── CART DRAWER ───────────────────────────────────────────────────
function CartDrawer({ onNavigate }) {
  const { items, isOpen, setIsOpen, subtotal, cartCount, removeItem, changeQty } = useCart();

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  function handleShopDrop() { setIsOpen(false); onNavigate('home'); }

  return (
    <>
      {/* Dimmed overlay */}
      <div
        className="fixed inset-0 z-[45] bg-black/40 transition-opacity duration-[380ms]"
        style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'all' : 'none' }}
        onClick={() => setIsOpen(false)}
        aria-hidden
      />

      {/* Drawer panel */}
      <div
        className={`cart-drawer ${isOpen ? 'is-open' : ''}
          fixed top-0 right-0 h-full w-full sm:w-[400px] z-[50] bg-white flex flex-col`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-black/[0.07] flex-shrink-0">
          <h2 className="font-display font-black uppercase text-xl tracking-[0.12em]">
            Your bag
            {cartCount > 0 && (
              <span className="font-body font-normal text-sm text-black/30 ml-1.5 tracking-normal">
                ({cartCount})
              </span>
            )}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-black/35 hover:text-near-black transition-colors"
            aria-label="Close bag"
          >
            <IcoX />
          </button>
        </div>

        {/* Scrollable line items */}
        <div className="flex-1 overflow-y-auto drawer-scroll">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center px-6 text-center gap-3">
              <p className="font-display font-black uppercase text-2xl tracking-[0.12em]">Nothing here yet</p>
              <p className="text-sm text-black/38 font-body leading-relaxed">
                Explore the drop and find something made for you.
              </p>
              <button
                onClick={handleShopDrop}
                className="transition-btn mt-3 bg-near-black text-white px-8 py-3
                  text-[0.68rem] tracking-[0.22em] uppercase font-semibold hover:bg-accent"
              >
                Shop the drop
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-black/[0.05]">
              {items.map(item => (
                <li key={item.key} className="flex gap-4 px-5 py-5">
                  {/* Thumbnail */}
                  <div
                    className="flex-shrink-0 w-[72px] h-[90px] img-placeholder relative"
                    style={{ backgroundColor: item.thumbShade }}
                    aria-hidden
                  />

                  {/* Item info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-display font-bold uppercase tracking-[0.08em] text-sm leading-snug">
                        {item.name}
                      </p>
                      <p className="text-[0.65rem] text-black/38 mt-0.5 font-body">
                        {item.color.name} / {item.size}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-black/14">
                        <button className="qty-btn" onClick={() => changeQty(item.key, -1)} aria-label="Decrease quantity">−</button>
                        <span className="w-7 text-center text-sm font-body select-none">{item.qty}</span>
                        <button className="qty-btn" onClick={() => changeQty(item.key,  1)} aria-label="Increase quantity">+</button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-body font-medium">
                          ${(item.price * item.qty).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.key)}
                          className="text-black/22 hover:text-near-black transition-colors"
                          aria-label={`Remove ${item.name}`}
                        >
                          <IcoTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Fixed checkout footer */}
        {items.length > 0 && (
          <div className="flex-shrink-0 border-t border-black/[0.07] px-5 py-5">
            <div className="flex justify-between text-sm font-body mb-1">
              <span className="text-black/40">Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)} CAD</span>
            </div>
            <p className="text-[0.62rem] text-black/22 font-body mb-4">
              Shipping & taxes calculated at checkout
            </p>
            <button
              className="transition-btn w-full bg-near-black text-white py-4
                text-[0.7rem] font-semibold tracking-[0.22em] uppercase hover:bg-accent"
            >
              Checkout — ${subtotal.toFixed(2)}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────
function App() {
  const [page,          setPage]          = useState('home');
  const [activeProduct, setActiveProduct] = useState(null);

  function navigate(target, product = null) {
    setPage(target);
    if (product) setActiveProduct(product);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  return (
    <CartProvider>
      <div className="min-h-screen">
        <Nav onNavigate={navigate} />
        <div className="pt-14">
          {page === 'home' && (
            <Homepage onNavigate={navigate} />
          )}
          {page === 'product' && activeProduct && (
            // key={activeProduct.id} forces remount (resets size/colour state) on product change
            <ProductDetailPage
              key={activeProduct.id}
              product={activeProduct}
              onBack={() => navigate('home')}
              onNavigate={navigate}
            />
          )}
        </div>
        <CartDrawer onNavigate={navigate} />
      </div>
    </CartProvider>
  );
}

// ── MOUNT ─────────────────────────────────────────────────────────
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
