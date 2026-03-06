import { Link } from 'react-router-dom';
import { Shield, TrendingUp, CircleCheck as CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div>
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            La Plateforme Immobilière Sécurisée du Maroc
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Trouvez votre bien idéal en toute confiance. Annonces vérifiées, prix transparents, agences certifiées.
          </p>
          <Link to="/properties" className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 inline-block">
            Découvrir les annonces
          </Link>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Nos Valeurs</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Sécurité</h3>
            <p className="text-gray-600">Vérification complète des documents et des agences</p>
          </div>
          <div className="text-center p-6">
            <CheckCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Fiabilité</h3>
            <p className="text-gray-600">Annonces uniques et mises à jour en temps réel</p>
          </div>
          <div className="text-center p-6">
            <TrendingUp className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Transparence</h3>
            <p className="text-gray-600">Analyse des prix du marché avec IA</p>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche ?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Recherchez</h3>
              <p className="text-gray-600">Utilisez nos filtres avancés pour trouver le bien parfait</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Comparez</h3>
              <p className="text-gray-600">Analysez les prix et les caractéristiques avec notre IA</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Contactez</h3>
              <p className="text-gray-600">Prenez rendez-vous avec des agences certifiées</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Prêt à commencer ?</h2>
        <p className="text-xl text-gray-600 mb-8">Rejoignez des milliers d'utilisateurs qui nous font confiance</p>
        <div className="flex justify-center space-x-4">
          <Link to="/register" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700">
            Créer un compte
          </Link>
          <Link to="/properties" className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50">
            Voir les annonces
          </Link>
        </div>
      </section>
    </div>
  );
}
