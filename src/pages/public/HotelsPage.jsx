import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, Star, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { mockHotels } from '../../data/mock/mockData';
import { EmptyState, CardSkeleton, Pagination } from '../../components/common/UI';

const formatPrice = (n) => '₹' + n.toLocaleString('en-IN');

const CATEGORIES = ['All', 'Luxury', 'Heritage', 'Resort', 'Business', 'Mountain', 'Palace'];
const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export default function HotelsPage() {
  const [params] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'All',
    minPrice: '',
    maxPrice: '',
    minRating: '',
  });
  const [sort, setSort] = useState('relevance');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const city = params.get('city') || '';
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      let result = [...mockHotels];
      if (city) result = result.filter(h => h.city.toLowerCase().includes(city.toLowerCase()) || h.location.toLowerCase().includes(city.toLowerCase()));
      setHotels(result);
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, [city]);

  // Apply client-side filters
  let filtered = [...hotels];
  if (filters.category !== 'All') filtered = filtered.filter(h => h.category === filters.category);
  if (filters.minPrice) filtered = filtered.filter(h => h.priceFrom >= Number(filters.minPrice));
  if (filters.maxPrice) filtered = filtered.filter(h => h.priceFrom <= Number(filters.maxPrice));
  if (filters.minRating) filtered = filtered.filter(h => h.rating >= Number(filters.minRating));

  // Sort
  if (sort === 'price-asc') filtered.sort((a, b) => a.priceFrom - b.priceFrom);
  else if (sort === 'price-desc') filtered.sort((a, b) => b.priceFrom - a.priceFrom);
  else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const clearFilters = () => setFilters({ category: 'All', minPrice: '', maxPrice: '', minRating: '' });

  return (
    <div className="container" style={{ paddingBlock: 'var(--space-8)' }}>
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">
            {city ? `Hotels in ${city}` : 'All Hotels'}
          </h1>
          <p className="page-subtitle">{filtered.length} propert{filtered.length !== 1 ? 'ies' : 'y'} found</p>
        </div>

        <div className="d-flex gap-3 items-center flex-wrap">
          {/* Sort */}
          <div className="form-input-wrapper" style={{ minWidth: 180 }}>
            <select
              className="form-select"
              value={sort}
              onChange={e => { setSort(e.target.value); setPage(1); }}
              aria-label="Sort hotels"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Filter toggle (mobile) */}
          <button
            className="btn btn-outline btn-sm show-mobile"
            onClick={() => setShowFilters(v => !v)}
            aria-expanded={showFilters}
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>

        {/* ── FILTER PANEL ─────────────────────────────── */}
        <aside
          className={`filter-panel hide-mobile ${showFilters ? 'show-mobile' : ''}`}
          aria-label="Filter hotels"
          style={{ position: 'sticky', top: 'calc(var(--header-height) + var(--space-4))' }}
        >
          <div className="d-flex justify-between items-center mb-4">
            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)' }}>Filters</h2>
            <button className="btn btn-ghost btn-sm" onClick={clearFilters} style={{ fontSize: 'var(--text-xs)' }}>Clear all</button>
          </div>

          {/* Category */}
          <div className="filter-group">
            <h3 className="filter-group-title">Property Type</h3>
            <div className="d-flex flex-col gap-2">
              {CATEGORIES.map(cat => (
                <label key={cat} className="form-check">
                  <input
                    type="radio"
                    name="category"
                    className="form-check-input"
                    checked={filters.category === cat}
                    onChange={() => { setFilters(f => ({ ...f, category: cat })); setPage(1); }}
                  />
                  <span className="form-check-label">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="filter-group">
            <h3 className="filter-group-title">Price per Night (₹)</h3>
            <div className="d-flex gap-2">
              <input
                type="number"
                className="form-input"
                placeholder="Min"
                value={filters.minPrice}
                onChange={e => { setFilters(f => ({ ...f, minPrice: e.target.value })); setPage(1); }}
                aria-label="Minimum price"
              />
              <input
                type="number"
                className="form-input"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={e => { setFilters(f => ({ ...f, maxPrice: e.target.value })); setPage(1); }}
                aria-label="Maximum price"
              />
            </div>
          </div>

          {/* Rating */}
          <div className="filter-group">
            <h3 className="filter-group-title">Minimum Rating</h3>
            <div className="d-flex flex-col gap-2">
              {['4.5', '4.0', '3.5'].map(r => (
                <label key={r} className="form-check">
                  <input
                    type="radio"
                    name="rating"
                    className="form-check-input"
                    checked={filters.minRating === r}
                    onChange={() => { setFilters(f => ({ ...f, minRating: r })); setPage(1); }}
                  />
                  <span className="form-check-label">{r}+ ★</span>
                </label>
              ))}
              <label className="form-check">
                <input
                  type="radio"
                  name="rating"
                  className="form-check-input"
                  checked={filters.minRating === ''}
                  onChange={() => { setFilters(f => ({ ...f, minRating: '' })); setPage(1); }}
                />
                <span className="form-check-label">Any rating</span>
              </label>
            </div>
          </div>
        </aside>

        {/* ── RESULTS GRID ─────────────────────────────── */}
        <div>
          {loading ? (
            <div className="grid-auto-fill">
              {Array.from({ length: 4 }, (_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : paginated.length === 0 ? (
            <EmptyState
              title="No hotels found"
              description="Try adjusting your filters or searching a different destination."
              action={<button className="btn btn-primary mt-4" onClick={clearFilters}>Clear Filters</button>}
            />
          ) : (
            <>
              <div className="grid-auto-fill">
                {paginated.map(hotel => (
                  <Link to={`/hotels/${hotel.slug}`} key={hotel.id} style={{ textDecoration: 'none', display: 'block' }}>
                    <article className="hotel-card" style={{ height: '100%' }}>
                      <div className="hotel-card-image">
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          loading="lazy"
                          onError={e => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80';
                          }}
                        />
                        <div style={{ position: 'absolute', top: 'var(--space-3)', right: 'var(--space-3)' }}>
                          <span className="badge" style={{ background: 'var(--color-secondary)', color: '#fff', fontSize: 'var(--text-xs)' }}>
                            {hotel.category}
                          </span>
                        </div>
                      </div>
                      <div className="hotel-card-body">
                        <h2 className="hotel-card-name">{hotel.name}</h2>
                        <p className="hotel-card-location"><MapPin size={12} aria-hidden="true" /> {hotel.location}</p>
                        <div className="hotel-card-rating">
                          <Star size={13} fill="#EAB308" color="#EAB308" aria-hidden="true" />
                          {hotel.rating}
                          <span style={{ color: 'var(--color-text-secondary)', fontWeight: 'normal', fontSize: 'var(--text-xs)' }}>
                            ({hotel.reviewCount.toLocaleString()})
                          </span>
                        </div>
                        <div className="d-flex flex-wrap gap-1 mb-3">
                          {hotel.amenities.slice(0, 3).map(a => (
                            <span key={a} className="amenity-tag">{a}</span>
                          ))}
                          {hotel.amenities.length > 3 && (
                            <span className="amenity-tag">+{hotel.amenities.length - 3}</span>
                          )}
                        </div>
                        <div className="d-flex justify-between items-center">
                          <div>
                            <span className="hotel-card-price tabular-nums">From {formatPrice(hotel.priceFrom)}</span>
                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', display: 'block' }}>per night</span>
                          </div>
                          <span className="btn btn-outline btn-sm">View</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              <div className="d-flex justify-between items-center mt-8">
                <span className="table-count">
                  Showing {((page - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                </span>
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
