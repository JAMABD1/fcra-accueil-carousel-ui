
import { useQuery } from "@tanstack/react-query";
import { getDirectors } from "@/lib/db/queries";
import { getPublicUrl } from "@/lib/storage/r2";
import Layout from "@/components/Layout";
import AdminProfile from "@/components/AdminProfile";

const Administrations = () => {
  // Fetch directors from database
  const { data: directors = [], isLoading, error } = useQuery({
    queryKey: ['directors'],
    queryFn: async () => {
      return await getDirectors();
    }
  });

  // Separate directors and staff
  const mainDirectors = directors.filter(d => d.isDirector);
  const staff = directors.filter(d => !d.isDirector);

 

  if (isLoading) {
    return (
      <Layout>
        <div className="py-16 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="py-16 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-red-600 text-lg">
                Erreur lors du chargement des informations d'administration.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Les Administrateurs de FCRA
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez notre équipe dirigeante et notre structure administrative
            </p>
          </div>

          {/* Leadership Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Direction
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {mainDirectors.map((director) => {
                // Handle image URL - use full URL if available, otherwise convert relative path to public URL
                const imageUrl = director.image_url || director.imageUrl;
                const finalImageUrl = !imageUrl 
                  ? "/placeholder.svg"
                  : imageUrl.startsWith('http://') || imageUrl.startsWith('https://')
                  ? imageUrl
                  : getPublicUrl(imageUrl);
                
                return (
                  <AdminProfile
                    key={director.id}
                    name={director.name}
                    title={director.job || "Directeur"}
                   // email={director.centres?.name ? `${director.centres.name.toLowerCase().replace(/\s+/g, '')}@fcra.mg` : "direction@fcra.mg"}
                    image={finalImageUrl}
                    backgroundColor="bg-blue-100"
                  />
                );
              })}
            </div>
            
            {mainDirectors.length === 0 && (
              <div className="text-center text-gray-500">
                <p>Aucun directeur enregistré pour le moment.</p>
              </div>
            )}
          </div>

          {/* Staff Section */}
          {staff.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                Équipe Administrative
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {staff.map((member) => {
                  // Handle image URL - use full URL if available, otherwise convert relative path to public URL
                  const imageUrl = member.image_url || member.imageUrl;
                  const finalImageUrl = !imageUrl 
                    ? "/placeholder.svg"
                    : imageUrl.startsWith('http://') || imageUrl.startsWith('https://')
                    ? imageUrl
                    : getPublicUrl(imageUrl);
                  
                  return (
                    <AdminProfile
                      key={member.id}
                      name={member.name}
                      title={member.job || "Membre de l'équipe"}
                     // email={member.centres?.name ? `${member.centres.name.toLowerCase().replace(/\s+/g, '')}@fcra.mg` : "contact@fcra.mg"}
                      image={finalImageUrl}
                      backgroundColor="bg-green-100"
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Founders Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Fondateurs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                  <img 
                    src="/image/founder1.jpg" 
                    alt="Sheick Roshan Jamil" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Sheick Roshan Jamil
                </h3>
                <p className="text-gray-600 text-sm">
                  Co-fondateur et Ex-Président
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                  <img 
                    src="/image/founder2.jpg" 
                    alt="Abdoul Moumin" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Abdoul Moumin
                </h3>
                <p className="text-gray-600 text-sm">
                  Co-fondateur 
                </p>
              </div>
            </div>
          </div>

          {/* Departments Section */}
         

          {/* Contact Info */}
       

        </div>
      </div>
    </Layout>
  );
};

export default Administrations;
