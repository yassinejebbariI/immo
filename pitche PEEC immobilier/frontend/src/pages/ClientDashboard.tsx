import { useState, useEffect } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import api from '../api/axios';

interface Visit {
  _id: string;
  propertyId: any;
  scheduledDate: string;
  status: string;
  agencyId: any;
}

export default function ClientDashboard() {
  const [visits, setVisits] = useState<Visit[]>([]);

  useEffect(() => {
    fetchMyVisits();
  }, []);

  const fetchMyVisits = async () => {
    try {
      const { data } = await api.get('/visits/my-visits');
      setVisits(data);
    } catch (error) {
      console.error('Error fetching visits:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mes Visites</h1>

      <div className="space-y-4">
        {visits.map((visit) => (
          <div key={visit._id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{visit.propertyId?.title}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin size={16} className="mr-1" />
                  <span>{visit.propertyId?.city}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Calendar size={16} className="mr-1" />
                  <span>{new Date(visit.scheduledDate).toLocaleString('fr-FR')}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Agence: {visit.agencyId?.companyName || visit.agencyId?.name}
                </div>
                <div className="text-sm text-gray-600">
                  Contact: {visit.agencyId?.phone}
                </div>
              </div>
              <span className={`px-3 py-1 rounded text-sm ${
                visit.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                visit.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                visit.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-red-100 text-red-800'
              }`}>
                {visit.status}
              </span>
            </div>
          </div>
        ))}

        {visits.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucune visite programmée
          </div>
        )}
      </div>
    </div>
  );
}
