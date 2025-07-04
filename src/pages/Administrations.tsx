
import Layout from "@/components/Layout";
import AdminProfile from "@/components/AdminProfile";

const Administrations = () => {
  const administrators = [
    {
      name: "Sheick Haniph Akbar Aly",
      title: "Président Directeur Général",
      email: "jao.lazabdallah83@gmail.com",
      image: "/lovable-uploads/dda32bd3-afb8-4490-94d7-79321a9fe45a.png",
      backgroundColor: "bg-blue-100"
    }
  ];

  const departments = [
    {
      name: "Direction Générale",
      description: "Supervision générale et orientation stratégique de l'organisation",
      icon: "👥",
      members: ["Sheick Haniph Akbar Aly"]
    },
    {
      name: "Gestion Financière",
      description: "Gestion des ressources financières et comptabilité",
      icon: "📊",
      members: ["À définir"]
    },
    {
      name: "Coordination Pédagogique",
      description: "Supervision des programmes éducatifs et formation",
      icon: "🎓",
      members: ["À définir"]
    },
    {
      name: "Affaires Sociales",
      description: "Gestion des programmes d'aide et d'assistance sociale",
      icon: "🤝",
      members: ["À définir"]
    },
    {
      name: "Communication",
      description: "Relations publiques et communication externe",
      icon: "📢",
      members: ["À définir"]
    },
    {
      name: "Ressources Humaines",
      description: "Gestion du personnel et développement des compétences",
      icon: "👤",
      members: ["À définir"]
    }
  ];

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
            <div className="flex justify-center">
              <div className="max-w-md">
                {administrators.map((admin) => (
                  <AdminProfile
                    key={admin.name}
                    name={admin.name}
                    title={admin.title}
                    email={admin.email}
                    image={admin.image}
                    backgroundColor={admin.backgroundColor}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Departments Section */}
          <div>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Structure Administrative
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {departments.map((dept) => (
                <div key={dept.name} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-green-600 text-2xl">{dept.icon}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {dept.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {dept.description}
                    </p>
                    <div className="text-sm text-gray-500">
                      <strong>Responsable:</strong>
                      <div className="mt-1">
                        {dept.members.map((member, index) => (
                          <span key={index} className="block">
                            {member}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-16 text-center bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Contact Administration
            </h3>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <span>📞</span>
                <span>0344679192</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✉️</span>
                <span>jao.lazabdallah83@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>Antananarivo, Madagascar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Administrations;
