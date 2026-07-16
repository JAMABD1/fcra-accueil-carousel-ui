import Layout from "@/components/Layout";
import TaggedHeroCarousel from "@/components/TaggedHeroCarousel";
import Coordonnees from "@/components/ContactForm";
import Counter from "@/components/Counter";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import SectionsGallery from "@/components/SectionsGallery";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getImpactItems, getSections, getTags, getArticles } from "@/lib/db/queries";
import { useNavigate, Link } from "react-router-dom";
import { GraduationCap, HeartPulse, Home } from "lucide-react";

const actionPillars = [
  {
    icon: GraduationCap,
    title: "Nos actions éducatives",
    description:
      "La FCRA développe des établissements scolaires d'excellence à Madagascar, notamment le Lycée Privé La Sagesse à Antaniavo, pour offrir une éducation de qualité aux enfants et aux jeunes.",
    tint: "bg-green-50",
  },
  {
    icon: HeartPulse,
    title: "Santé et médical",
    description:
      "À travers le Dispensaire Shabbir et d'autres structures de santé, la FCRA assure des soins médicaux accessibles aux communautés locales, avec consultations et suivi médical de qualité.",
    tint: "bg-green-50",
  },
  {
    icon: Home,
    title: "Soutien aux orphelins",
    description:
      "Le FCRA gère quatre centres d'orphelinat à Antaniavo, Andakana, Manakara et Sakoana, offrant un accueil sûr et bienveillant aux enfants vulnérables.",
    tint: "bg-white",
  },
];

// YouTube Video Component
const YouTubeVideo = ({ videoId }: { videoId: string }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};   

const Index = () => {
  const navigate = useNavigate();
  
  // Fetch impact data
  const { data: impacts = [] } = useQuery({
    queryKey: ['impacts-public'],
    queryFn: async () => {
      return await getImpactItems();
    }
  });

  // Fetch sections data
  const { data: sections = [] } = useQuery({
    queryKey: ['sections-public'],
    queryFn: async () => {
      return await getSections();
    }
  });

  // Fetch all tags for mapping tag_ids to tag names
  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      return await getTags();
    }
  });

  // Filter impacts to only those with tag 'home'
  const homeTag = tags.find(t => t.name === 'home');
  const impactsHome = homeTag
    ? impacts.filter(impact => {
        let tagIds: string[] = [];
        const impactAny = impact as any;
        if (Array.isArray(impactAny.tag_ids)) {
          tagIds = impactAny.tag_ids;
        } else if (impactAny.tags_id) {
          tagIds = [impactAny.tags_id];
        }
        return tagIds.includes(homeTag.id);
      })
    : [];

  // Filter sections to only those with tag 'featured'
  const featuredTag = tags.find(t => t.name === 'featured');
  const sectionsFeatured = featuredTag
    ? sections.filter(section => {
        let tagIds: string[] = [];
        const sectionAny = section as any;
        if (Array.isArray(sectionAny.tag_ids)) {
          tagIds = sectionAny.tag_ids;
        } else if (sectionAny.tags_id) {
          tagIds = [sectionAny.tags_id];
        }
        return tagIds.includes(featuredTag.id);
      })
    : [];

  // Fetch articles from database
  const { data: articles = [] } = useQuery({
    queryKey: ['articles-public'],
    queryFn: async () => {
      return await getArticles({ status: 'published', limit: 10 });
    }
  });

  // Transform articles for display
  const transformedArticles = articles.map(article => {
    const publishedAt = article.publishedAt ?? article.createdAt;
    return {
      id: article.id,
      slug: article.slug,
      title: article.title,
      date: new Date(publishedAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      author: article.author || 'Admin FCRA',
      image: article.images && article.images.length > 0 ? article.images[0] : '/placeholder.svg',
      excerpt: article.excerpt || article.content.substring(0, 200) + '...',
      tags: article.tags || [],
      content: article.content,
      featured: article.featured || false
    };
  });

  // Get 3 most recent articles
  const latestArticles = transformedArticles.slice(0, 3);

  // Get 3 articles tagged 'home' (by tag name)
  const homeArticles = transformedArticles.filter(article => article.tags.includes('home')).slice(0, 3);

  // Merge, ensuring no duplicates (by id)
  const articleIds = new Set();
  const combinedArticles = [...latestArticles, ...homeArticles].filter(article => {
    if (articleIds.has(article.id)) return false;
    articleIds.add(article.id);
    return true;
  });

  return (
    <Layout>
      {/* Hero Carousel */}
      <TaggedHeroCarousel 
        filterTags={["home"]}
        onLearnMore={() => {
          const about = document.getElementById('apropos');
          if (about) {
            const rect = about.getBoundingClientRect();
            const offset = 100; // scroll to a bit below the top
            window.scrollTo({ top: window.scrollY + rect.top - offset, behavior: 'smooth' });
          }
        }}
        onJoinUs={() => navigate('/administrations')}
      />

      {/* About — editorial layout */}
      <section id="apropos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <ScrollReveal>
              <p className="eyebrow-label mb-4">À propos</p>
              <h1 className="text-section font-bold text-gray-900 mb-6 leading-tight">
                Fifanampiana Centre Rassoul Akram
              </h1>
              <blockquote className="border-l-4 border-green-600 pl-6 my-8 text-xl italic text-gray-700 leading-relaxed">
                Chaque individu mérite une chance équitable de s'épanouir — c'est la
                conviction qui guide toutes nos actions.
              </blockquote>
              <p className="text-lg text-gray-600 max-w-3xl leading-relaxed mb-4">
                FCRA est un centre à but non lucratif dédié à l'entraide, à
                l'éducation, au développement humain et à la promotion des valeurs de
                solidarité. Nous œuvrons pour un avenir meilleur à travers des actions concrètes
                dans les domaines éducatifs, sociaux, spirituels et communautaires.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Nous accueillons les enfants, les jeunes et les familles dans un environnement
                bienveillant, où l'écoute, le respect et la transmission des savoirs sont au
                cœur de notre engagement.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="space-y-6">
                <Card className="border-border/60 card-lift">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Nos missions</h3>
                    <ul className="list-none space-y-3 text-gray-600">
                      <li className="flex gap-2">
                        <span className="text-green-600 mt-1">·</span>
                        Accompagnement éducatif et spirituel des enfants et des jeunes
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-600 mt-1">·</span>
                        Soutien aux familles en situation de vulnérabilité
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-600 mt-1">·</span>
                        Promotion de la paix, du respect et de l'entraide
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-600 mt-1">·</span>
                        Espace d'échange, de dialogue et de cohésion sociale
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-border/60 card-lift">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Nos valeurs</h3>
                    <ul className="space-y-3 text-gray-600">
                      {[
                        ["Solidarité", "L'union et le soutien mutuel au cœur de nos actions"],
                        ["Respect", "La dignité de chaque personne, sans distinction"],
                        ["Foi et spiritualité", "Des principes moraux pour orienter nos engagements"],
                        ["Engagement", "Sincérité, persévérance et responsabilité"],
                        ["Éducation", "La connaissance comme clé du changement"],
                      ].map(([label, desc]) => (
                        <li key={label}>
                          <span className="font-semibold text-gray-900">{label} — </span>
                          {desc}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>
          </div>

          {/* History */}
          <ScrollReveal className="mt-20">
            <SectionHeading
              eyebrow="Notre histoire"
              title="Depuis 2009, au service de la communauté"
              align="left"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Fondé en 2009, le FCRA est né d'une volonté profonde de répondre aux
                  besoins urgents de la communauté en matière d'éducation, d'entraide
                  sociale et de développement humain.
                </p>
                <p>Depuis sa création, le FCRA s'appuie sur quatre piliers fondamentaux :</p>
                <ul className="list-none space-y-2 pl-2">
                  {[
                    "Soutien aux orphelins et aux familles vulnérables",
                    "Formation des jeunes citoyens responsables et engagés",
                    "Dialogue interreligieux dans un esprit d'ouverture",
                    "Projets communautaires durables pour l'autonomie locale",
                  ].map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-green-600 font-bold">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  className="bg-green-600 hover:bg-green-700 mt-4"
                  size="lg"
                  onClick={() => {
                    const section = document.getElementById('sections');
                    if (section) {
                      section.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Découvrez nos projets
                </Button>
              </div>
              <YouTubeVideo videoId="WlknRHFGlW0" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Impact Section with Animated Counters */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Notre impact en chiffres" align="center" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {impactsHome.map((impact) => (
              <div key={impact.id} className="text-center">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Counter end={impact.number} suffix="+" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{impact.title}</h3>
                {impact.subtitle && (
                  <p className="text-gray-600">{impact.subtitle}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Action pillars */}
      <section id="actions" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Nos domaines d'action"
            title="Éducation, santé et solidarité"
            subtitle="Trois piliers qui structurent notre engagement humanitaire au quotidien."
            align="center"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {actionPillars.map((pillar, index) => (
              <ScrollReveal key={pillar.title} delay={index * 0.1}>
                <Card className={`h-full card-lift hover:shadow-xl ${pillar.tint}`}>
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-5">
                      <pillar.icon className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{pillar.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{pillar.description}</p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Sections — horizontal gallery */}
      <section id="sections" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
            <SectionHeading
              eyebrow="Nos sections"
              title="Explorez nos programmes"
              align="left"
              className="mb-0"
            />
            <Button asChild variant="link" className="text-green-600 hover:text-green-700 shrink-0">
              <Link to="/sections">Voir toutes les sections →</Link>
            </Button>
          </div>
          <SectionsGallery sections={sectionsFeatured} />
        </div>
      </section>

      {/* News */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
            <SectionHeading
              eyebrow="Actualités"
              title="Dernières publications"
              subtitle="Découvrez nos dernières nouvelles et notre engagement sur le terrain."
              align="left"
              className="mb-0"
            />
            <Button asChild variant="link" className="text-green-600 hover:text-green-700 shrink-0">
              <Link to="/actualites">Voir toutes les actualités →</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {combinedArticles.map((article, index) => (
              <ScrollReveal key={article.id} delay={index * 0.08}>
                <Link to={`/actualites/${article.slug}`} state={{ focus: 'images' }} className="block h-full">
                  <Card className="overflow-hidden card-lift hover:shadow-xl border-border/60 h-full flex flex-col">
                    <div
                      className="h-48 bg-cover bg-center shrink-0"
                      style={{ backgroundImage: `url(${article.image})` }}
                    />
                    <CardContent className="p-6 flex flex-col flex-1">
                      <p className="text-sm text-gray-500 mb-2">
                        {article.date} — {article.author}
                      </p>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-1">
                        {article.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <Coordonnees />
    </Layout>
  );
};

export default Index;
