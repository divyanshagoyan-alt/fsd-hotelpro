import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Star,
  SlidersHorizontal,
  X,
  Search,
  Building,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { mockHotels } from '../../data/mock/mockData';
import hotelService from '../../services/hotelService';
import { EmptyState, CardSkeleton, Pagination, Button } from '../../components/common/UI';

const formatPrice = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

const CATEGORIES = ['All', 'Luxury', 'Heritage', 'Resort', 'Business', 'Mountain', 'Palace'];
const POPULAR_CITIES = ['All', 'Mumbai', 'Jaipur', 'Goa', 'New Delhi', 'Shimla', 'Bengaluru'];

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance / Popularity' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export default function HotelsPage() {
  const [params, setParams] = useSearchParams();
  const [hotels, setHotels] = useState(mockHotels);
  const [loading, setLoading] = useState(false);

  // Search parameters from URL or user input
  const initialQuery = params.get('q') || params.get('destination') || '';
  const initialCity = params.get('city') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [filters, setFilters] = useState({
    category: params.get('category') || 'All',
    minPrice: '',
    maxPrice: '',
    minRating: '',
  });
  const [sort, setSort] = useState('relevance');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const ITEMS_PER_PAGE = 6;

  // Sync state if URL search params change
  useEffect(() => {
    const q = params.get('q') || params.get('destination') || '';
    const c = params.get('city') || '';
    const cat = params.get('category') || 'All';
    if (q !== searchQuery) setSearchQuery(q);
    if (c !== selectedCity) setSelectedCity(c);
    if (cat !== filters.category) setFilters(prev => ({ ...prev, category: cat }));
  }, [params]);

  // Load hotels from hotelService (resilient with offline fallback)
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    hotelService.getHotels()
      .then(res => {
        if (isMounted && res?.hotels?.length) {
          setHotels(res.hotels);
        }
      })
      .catch(() => {
        if (isMounted) setHotels(mockHotels);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  // Multi-attribute search and filtering
  const filteredHotels = useMemo(() => {
    return hotels.filter(h => {
      // 1. Keyword search (Name, City, Location, Description, Category, Amenities)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = h.name.toLowerCase().includes(q);
        const matchCity = h.city.toLowerCase().includes(q);
        const matchLoc = h.location.toLowerCase().includes(q);
        const matchDesc = (h.description || '').toLowerCase().includes(q);
        const matchCat = (h.category || '').toLowerCase().includes(q);
        const matchAmenities = (h.amenities || []).some(a => a.toLowerCase().includes(q));

        if (!matchName && !matchCity && !matchLoc && !matchDesc && !matchCat && !matchAmenities) {
          return false;
        }
      }

      // 2. City Filter
      if (selectedCity && selectedCity !== 'All') {
        const c = selectedCity.toLowerCase();
        const matchCity = h.city.toLowerCase().includes(c) || h.location.toLowerCase().includes(c);
        if (!matchCity) return false;
      }

      // 3. Category Filter
      if (filters.category && filters.category !== 'All') {
        if (h.category !== filters.category) return false;
      }

      // 4. Price Filter
      if (filters.minPrice && h.priceFrom < Number(filters.minPrice)) return false;
      if (filters.maxPrice && h.priceFrom > Number(filters.maxPrice)) return false;

      // 5. Rating Filter
      if (filters.minRating && h.rating < Number(filters.minRating)) return false;

      return true;
    });
  }, [hotels, searchQuery, selectedCity, filters]);

  // Sorting
  const sortedHotels = useMemo(() => {
    const list = [...filteredHotels];
    if (sort === 'price-asc') list.sort((a, b) => a.priceFrom - b.priceFrom);
    else if (sort === 'price-desc') list.sort((a, b) => b.priceFrom - a.priceFrom);
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [filteredHotels, sort]);

  const totalPages = Math.ceil(sortedHotels.length / ITEMS_PER_PAGE);
  const paginated = sortedHotels.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    const newParams = new URLSearchParams();
    if (searchQuery.trim()) newParams.set('q', searchQuery.trim());
    if (selectedCity && selectedCity !== 'All') newParams.set('city', selectedCity);
    if (filters.category !== 'All') newParams.set('category', filters.category);
    setParams(newParams);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setPage(1);
    const newParams = new URLSearchParams(params);
    if (city === 'All') {
      newParams.delete('city');
    } else {
      newParams.set('city', city);
    }
    setParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCity('');
    setFilters({ category: 'All', minPrice: '', maxPrice: '', minRating: '' });
    setSort('relevance');
    setPage(1);
    setParams({});
  };

  const isFiltered = Boolean(
    searchQuery.trim() ||
    (selectedCity && selectedCity !== 'All') ||
    filters.category !== 'All' ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.minRating
  );

  return (
    <div className="container" style={{ paddingBlock: 'var(--space-8)' }}>
      {/* ── Search Bar Section ──────────────────────────────── */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--color-border)',
        padding: 'var(--space-6)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: 'var(--space-8)'
      }}>
        <form onSubmit={handleSearchSubmit}>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: '1 1 320px', position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                style={{
                  paddingLeft: 42,
                  paddingRight: searchQuery ? 40 : 14,
                  fontSize: 'var(--text-md)',
                  height: 48,
                  borderRadius: 'var(--radius-lg)'
                }}
                placeholder="Search hotels by name, city, landmark, or amenity..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                aria-label="Search hotels"
              />
              <Search
                size={20}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-secondary)',
                  pointerEvents: 'none'
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-secondary)'
                  }}
                  title="Clear search text"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <Button type="submit" variant="primary" size="lg" icon={<Search size={18} />}>
              Search Hotels
            </Button>

            {isFiltered && (
              <Button type="button" variant="outline" size="lg" onClick={clearAllFilters} icon={<RotateCcw size={16} />}>
                Reset
              </Button>
            )}
          </div>
        </form>

        {/* Quick City Chips */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          marginTop: 'var(--space-4)',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', fontWeight: 'var(--weight-semibold)', textTransform: 'uppercase' }}>
            Popular Destinations:
          </span>
          {POPULAR_CITIES.map(city => {
            const isSelected = (city === 'All' && !selectedCity) || selectedCity === city;
            return (
              <button
                key={city}
                type="button"
                onClick={() => handleCitySelect(city)}
                style={{
                  border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  background: isSelected ? 'var(--color-primary-light)' : 'var(--color-bg)',
                  color: isSelected ? 'var(--color-primary)' : 'var(--color-text-primary)',
                  fontWeight: isSelected ? 'var(--weight-bold)' : 'var(--weight-normal)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--text-xs)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {city === 'All' ? 'All Cities' : city}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Page Header & Stats ───────────────────────────── */}
      <div className="page-header-row" style={{ marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: 'var(--text-2xl)' }}>
            {searchQuery
              ? `Hotels matching "${searchQuery}"`
              : selectedCity && selectedCity !== 'All'
              ? `Hotels in ${selectedCity}`
              : 'All Available Hotels'}
          </h1>
          <p className="page-subtitle">
            {sortedHotels.length} propert{sortedHotels.length !== 1 ? 'ies' : 'y'} found
            {selectedCity && selectedCity !== 'All' ? ` in ${selectedCity}` : ''}
          </p>
        </div>

        <div className="d-flex gap-3 items-center flex-wrap">
          {/* Sort */}
          <div className="form-input-wrapper" style={{ minWidth: 200 }}>
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
            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)' }}>Refine Filters</h2>
            {isFiltered && (
              <button className="btn btn-ghost btn-sm" onClick={clearAllFilters} style={{ fontSize: 'var(--text-xs)' }}>
                Clear all
              </button>
            )}
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
                    onChange={() => {
                      setFilters(f => ({ ...f, category: cat }));
                      setPage(1);
                      const np = new URLSearchParams(params);
                      if (cat === 'All') np.delete('category');
                      else np.set('category', cat);
                      setParams(np);
                    }}
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
              title="No hotels match your search"
              description={searchQuery ? `No properties found for "${searchQuery}". Try a different keyword or clear your filters.` : 'No properties match the chosen criteria.'}
              action={<Button variant="primary" onClick={clearAllFilters} icon={<RotateCcw size={16} />}>Reset Search & Filters</Button>}
            />
          ) : (
            <>
              <div className="grid-auto-fill">
                {paginated.map(hotel => (
                  <Link to={`/hotels/${hotel.slug || hotel.id}`} key={hotel.id} style={{ textDecoration: 'none', display: 'block' }}>
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
                            ({(hotel.reviewCount || 0).toLocaleString()})
                          </span>
                        </div>
                        <div className="d-flex flex-wrap gap-1 mb-3">
                          {(hotel.amenities || []).slice(0, 3).map(a => (
                            <span key={a} className="amenity-tag">{a}</span>
                          ))}
                          {(hotel.amenities || []).length > 3 && (
                            <span className="amenity-tag">+{(hotel.amenities || []).length - 3}</span>
                          )}
                        </div>
                        <div className="d-flex justify-between items-center">
                          <div>
                            <span className="hotel-card-price tabular-nums">From {formatPrice(hotel.priceFrom)}</span>
                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', display: 'block' }}>per night</span>
                          </div>
                          <span className="btn btn-outline btn-sm">View Details</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="d-flex justify-between items-center mt-8">
                  <span className="table-count">
                    Showing {((page - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(page * ITEMS_PER_PAGE, sortedHotels.length)} of {sortedHotels.length}
                  </span>
                  <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
