import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Home, DollarSign } from 'lucide-react';
import api from '../api/axios';
import { Property, PropertyType, TransactionType } from '@peec/shared';

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState({
    city: '',
    type: '',
    transactionType: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const { data } = await api.get(`/properties?${params}`);
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Annonces Immobilières</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="grid md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Ville"
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          />
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Type de bien</option>
            <option value={PropertyType.APARTMENT}>Appartement</option>
            <option value={PropertyType.HOUSE}>Maison</option>
            <option value={PropertyType.VILLA}>Villa</option>
            <option value={PropertyType.LAND}>Terrain</option>
            <option value={PropertyType.COMMERCIAL}>Commercial</option>
          </select>
          <select
            value={filters.transactionType}
            onChange={(e) => setFilters({ ...filters, transactionType: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Vente/Location</option>
            <option value={TransactionType.SALE}>Vente</option>
            <option value={TransactionType.RENT}>Location</option>
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

      <div className="grid md:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Link key={property._id} to={`/properties/${property._id}`} className="bg-white rounded-lg shadow hover:shadow-lg transition">
            <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
              {property.images[0] && (
                <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="p-4">
              {property.sponsored && (
                <span className="bg-yellow-400 text-xs px-2 py-1 rounded">Sponsorisé</span>
              )}
              <h3 className="text-xl font-semibold mt-2">{property.title}</h3>
              <div className="flex items-center text-gray-600 mt-2">
                <MapPin size={16} className="mr-1" />
                <span>{property.city}</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-2xl font-bold text-blue-600">{property.price.toLocaleString()} DH</span>
                <div className="text-gray-600 text-sm">
                  {property.surface}m² • {property.rooms} chambres
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
    </div>
  );
}
