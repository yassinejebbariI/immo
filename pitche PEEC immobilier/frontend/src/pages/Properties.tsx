import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { supabase, type Property } from '../lib/supabase';

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    minPrice: '',
    maxPrice: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      let query = supabase.from('properties').select('*');

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      if (filters.minPrice) {
        query = query.gte('price', Number(filters.minPrice));
      }
      if (filters.maxPrice) {
        query = query.lte('price', Number(filters.maxPrice));
      }

      const { data, error } = await query;

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Annonces Immobilières</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="grid md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Localisation"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          />
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Type de bien</option>
            <option value="apartment">Appartement</option>
            <option value="house">Maison</option>
            <option value="commercial">Commercial</option>
          </select>
          <input
            type="number"
            placeholder="Prix min"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="number"
            placeholder="Prix max"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Chargement...</div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Link key={property.id} to={`/properties/${property.id}`} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                  {property.image_url && (
                    <img src={property.image_url} alt={property.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{property.title}</h3>
                  <div className="flex items-center text-gray-600 mt-2">
                    <MapPin size={16} className="mr-1" />
                    <span>{property.location}</span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-bold text-blue-600">{property.price.toLocaleString()}</span>
                    <div className="text-gray-600 text-sm">
                      {property.area}m² • {property.bedrooms} ch
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {properties.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Aucune annonce trouvée
            </div>
          )}
        </>
      )}
    </div>
  );
}
