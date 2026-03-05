import { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import api from '../api/axios';
import { Property, PropertyStatus } from '@peec/shared';

export default function AdminDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    fetchPendingProperties();
  }, []);

  const fetchPendingProperties = async () => {
    try {
      const { data } = await api.get('/properties');
      setProperties(data.filter((p: Property) => p.status === PropertyStatus.PENDING));
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleVerify = async (id: string, status: PropertyStatus, notes?: string) => {
    try {
      await api.patch(`/properties/${id}/verify`, { status, verificationNotes: notes });
      fetchPendingProperties();
    } catch (error) {
      alert('Erreur lors de la vérification');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Vérification des Annonces</h1>

      <div className="space-y-4">
        {properties.map((property) => (
          <div key={property._id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                <p className="text-gray-600 mb-2">{property.description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>Type: {property.type}</div>
                  <div>Prix: {property.price.toLocaleString()} DH</div>
                  <div>Surface: {property.surface}m²</div>
                  <div>Ville: {property.city}</div>
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleVerify(property._id, PropertyStatus.VERIFIED)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-1"
                >
                  <CheckCircle size={18} />
                  <span>Approuver</span>
                </button>
                <button
                  onClick={() => {
                    const notes = prompt('Raison du rejet:');
                    if (notes) handleVerify(property._id, PropertyStatus.REJECTED, notes);
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-1"
                >
                  <XCircle size={18} />
                  <span>Rejeter</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {properties.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucune annonce en attente de vérification
          </div>
        )}
      </div>
    </div>
  );
}
