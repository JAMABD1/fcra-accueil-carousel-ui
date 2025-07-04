
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter } from "lucide-react";

const ArticleDetail = () => {
  const { id } = useParams();

  // Mock data - in real app, this would come from API
  const articles = [
    {
      id: 1,
      title: "Cérémonie de Remise des Diplômes 2024",
      date: "15 Décembre 2024",
      author: "Admin FCRA",
      image: "/lovable-uploads/120bc1b5-8776-4510-8628-3d1ca45aef5f.png",
      excerpt: "Une cérémonie exceptionnelle pour célébrer la réussite de nos étudiants diplômés.",
      tags: ["Éducation", "Cérémonie", "Diplômes"],
      content: `
        <p>La cérémonie de remise des diplômes 2024 de FCRA s'est tenue dans une atmosphère de joie et de fierté. Cette année, nous avons eu l'honneur de célébrer la réussite de plus de 150 étudiants qui ont complété avec succès leurs formations dans diverses spécialités.</p>
        
        <p>L'événement s'est déroulé en présence des familles, des enseignants et des partenaires de FCRA. Les diplômés ont été félicités pour leur persévérance et leur dévouement tout au long de leur parcours éducatif.</p>
        
        <h3>Programmes Diplômants</h3>
        <p>Les formations diplômantes cette année couvraient plusieurs domaines :</p>
        <ul>
          <li>Informatique et bureautique</li>
          <li>Couture et textile</li>
          <li>Menuiserie et ébénisterie</li>
          <li>Électricité et électronique</li>
          <li>Agriculture moderne</li>
        </ul>
        
        <h3>Témoignages</h3>
        <p>"Cette formation a changé ma vie. Grâce à FCRA, j'ai acquis les compétences nécessaires pour créer ma propre entreprise," témoigne Aina, diplômée en couture.</p>
        
        <p>La cérémonie s'est conclue par la remise officielle des certificats et un cocktail de célébration, marquant le début d'une nouvelle étape pour ces jeunes diplômés prêts à contribuer au développement de Madagascar.</p>
      `
    },
    {
      id: 2,
      title: "Nouveau Programme d'Aide aux Orphelins",
      date: "10 Décembre 2024",
      author: "Équipe Social",
      image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=400&fit=crop",
      excerpt: "Lancement d'un programme innovant pour soutenir les enfants orphelins.",
      tags: ["Social", "Orphelins", "Programme"],
      content: `
        <p>FCRA lance un nouveau programme d'aide aux orphelins, une initiative ambitieuse visant à offrir un avenir meilleur aux enfants les plus vulnérables de Madagascar.</p>
        
        <p>Ce programme comprend plusieurs volets d'assistance :</p>
        
        <h3>Éducation et Formation</h3>
        <p>Bourses d'études complètes pour permettre aux orphelins de poursuivre leur scolarité jusqu'au niveau universitaire. Un accompagnement personnalisé est fourni par nos conseillers pédagogiques.</p>
        
        <h3>Hébergement et Nutrition</h3>
        <p>Mise en place de foyers d'accueil sécurisés avec repas équilibrés et suivi médical régulier.</p>
        
        <h3>Soutien Psychologique</h3>
        <p>Sessions de counseling individuel et de groupe pour aider les enfants à surmonter leurs traumatismes et développer leur confiance en soi.</p>
        
        <p>Le programme bénéficie du soutien de partenaires internationaux et vise à accompagner plus de 200 orphelins dans les trois prochaines années.</p>
      `
    }
  ];

  const article = articles.find(a => a.id === parseInt(id || "1"));

  if (!article) {
    return (
      <Layout>
        <div className="py-16 bg-gray-50 min-h-screen">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Article non trouvé</h1>
            <Link to="/actualites">
              <Button className="bg-green-600 hover:bg-green-700">
                Retour aux actualités
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link to="/actualites">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Retour aux actualités
              </Button>
            </Link>
          </div>

          {/* Article Header */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div 
              className="h-96 bg-cover bg-center relative"
              style={{ backgroundImage: `url(${article.image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.map((tag) => (
                    <Badge key={tag} className="bg-green-600 text-white">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {article.title}
                </h1>
                <div className="flex items-center gap-6 text-sm opacity-90">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{article.author}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Article Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br>') }}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
                <h3 className="font-bold text-gray-900 mb-4">Partager cet article</h3>
                <div className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Facebook className="w-4 h-4 mr-2" />
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Share2 className="w-4 h-4 mr-2" />
                    Copier le lien
                  </Button>
                </div>

                <hr className="my-6" />

                <h3 className="font-bold text-gray-900 mb-4">Articles similaires</h3>
                <div className="space-y-4">
                  {articles.filter(a => a.id !== article.id).slice(0, 2).map((relatedArticle) => (
                    <div key={relatedArticle.id} className="border-l-4 border-green-600 pl-4">
                      <Link to={`/actualites/${relatedArticle.id}`}>
                        <h4 className="font-semibold text-sm text-gray-900 hover:text-green-600 transition-colors">
                          {relatedArticle.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">{relatedArticle.date}</p>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ArticleDetail;
