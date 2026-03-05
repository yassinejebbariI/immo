import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Home, Bed, Bath, Maximize, Calendar } from 'lucide-react';
import api from '../api/axios';
import { Property } from '@peec/shared';
import { useAuthStore } from '../store/authStore';

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [visitDate, setVisitDate] = useState('');
  const [visitNotes, setVisitNotes] = useState('');
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data } = await api.get(`/properties/${id}`);
      setProperty(data);
    } catch (error) {
      console.error('Error fetching property:', error);
    }
  };

  const handleScheduleVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await api.post('/visits', {
        propertyId: id,
        scheduledDate: visitDate,
        notes: visitNotes
      });
      alert('Visite programmée avec succès !');
      setVisitDate('');
      setVisitNotes('');
    } catch (error) {
      alert('Erreur lors de la programmation de la visite');
    }
  };

  if (!property) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="bg-gray-200 h-96 rounded-lg overflow-hidden mb-4">
            {property.images[0] && (
              <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {property.images.slice(1, 5).map((img, idx) => (
              <div key={idx} className="bg-gray-200 h-24 rounded overflow-hidden">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin size={20} className="mr-2" />
            <span>{property.address}, {property.city}</span>
          </div>
          
          <div className="text-4xl font-bold text-blue-600 mb-6">
            {property.price.toLocaleString()} DH
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-100 rounded">
              <Maximize className="mx-auto mb-2 text-blue-600" />
              <div className="font-semibold">{property.surface}m²</div>
              <div className="text-sm text-gray-600">Surface</div>
            </div>
            <div className="text-center p-4 bg-gray-100 rounded">
              <Bed className="mx-auto mb-2 text-blue-600" />
              <div className="font-semibold">{property.rooms}</div>
              <div className="text-sm text-gray-600">Chambres</div>
            </div>
            <div className="text-center p-4 bg-gray-100 rounded">
              <Bath className="mx-auto mb-2 text-blue-600" />
              <div className="font-semibold">{property.bathrooms}</div>
              <div className="text-sm text-gray-600">Salles de bain</div>
            </div>
            <div className="text-center p-4 bg-gray-100 rounded">
              <Home className="mx-auto mb-2 text-blue-600" />
              <div className="font-semibold">{property.type}</div>
              <div className="text-sm text-gray-600">Type</div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{property.description}</p>
          </div>

          {property.features.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Caractéristiques</h2>
              <div className="flex flex-wrap gap-2">
                {property.features.map((feature, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Programmer une visite</h2>
            <form onSubmit={handleScheduleVisit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Date et heure</label>
                <input
                  type="datetime-local"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Notes (optionnel)</label>
                <textarea
                  value={visitNotes}
                  onChange={(e) => setVisitNotes(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={3}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Demander une visite
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
