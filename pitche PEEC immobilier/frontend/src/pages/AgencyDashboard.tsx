import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '../api/axios';
import { Property, PropertyType, TransactionType } from '@peec/shared';

export default function AgencyDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: PropertyType.APARTMENT,
    transactionType: TransactionType.SALE,
    price: '',
    surface: '',
    rooms: '',
    bathrooms: '',
    address: '',
    city: '',
    coordinates: { lat: 33.5731, lng: -7.5898 },
    features: ''
  });

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const fetchMyProperties = async () => {
    try {
      const { data } = await api.get('/properties');
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/properties', {
        ...formData,
        price: Number(formData.price),
        surface: Number(formData.surface),
        rooms: Number(formData.rooms),
        bathrooms: Number(formData.bathrooms),
        features: formData.features.split(',').map(f => f.trim()),
        images: []
      });
      setShowForm(false);
      fetchMyProperties();
      setFormData({
        title: '',
        description: '',
        type: PropertyType.APARTMENT,
        transactionType: TransactionType.SALE,
        price: '',
        surface: '',
        rooms: '',
        bathrooms: '',
        address: '',
        city: '',
        coordinates: { lat: 33.5731, lng: -7.5898 },
        features: ''
      });
    } catch (error) {
      alert('Erreur lors de la création de l\'annonce');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      try {
        await api.delete(`/properties/${id}`);
        fetchMyProperties();
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mes Annonces</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Nouvelle annonce</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Créer une annonce</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Titre"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="px-4 py-2 border rounded-lg"
                required
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as PropertyType })}
                className="px-4 py-2 border rounded-lg"
              >
                <option value={PropertyType.APARTMENT}>Appartement</option>
                <option value={PropertyType.HOUSE}>Maison</option>
                <option value={PropertyType.VILLA}>Villa</option>
                <option value={PropertyType.LAND}>Terrain</option>
                <option value={PropertyType.COMMERCIAL}>Commercial</option>
              </select>
              <select
                value={formData.transactionType}
                onChange={(e) => setFormData({ ...formData, transactionType: e.target.value as TransactionType })}
                className="px-4 py-2 border rounded-lg"
              >
                <option value={TransactionType.SALE}>Vente</option>
                <option value={TransactionType.RENT}>Location</option>
              </select>
              <input
                type="number"
                placeholder="Prix (DH)"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="number"
                placeholder="Surface (m²)"
                value={formData.surface}
                onChange={(e) => setFormData({ ...formData, surface: e.target.value })}
                className="px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="number"
                placeholder="Nombre de chambres"
                value={formData.rooms}
                onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                className="px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="number"
                placeholder="Salles de bain"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                className="px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Ville"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <input
              type="text"
              placeholder="Adresse complète"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              rows={4}
              required
            />
            <input
              type="text"
              placeholder="Caractéristiques (séparées par des virgules)"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <div className="flex space-x-4">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Créer
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vues</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {properties.map((property) => (
              <tr key={property._id}>
                <td className="px-6 py-4">{property.title}</td>
                <td className="px-6 py-4">{property.price.toLocaleString()} DH</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    property.status === 'verified' ? 'bg-green-100 text-green-800' :
                    property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {property.status}
                  </span>
                </td>
                <td className="px-6 py-4">{property.views}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(property._id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
