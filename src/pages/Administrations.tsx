
import { useQuery } from "@tanstack/react-query";
import { getDirectors } from "@/lib/db/queries";
import { getPublicUrl } from "@/lib/storage/r2";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import ScrollReveal from "@/components/ScrollReveal";
import OrgChart, { type OrgPerson } from "@/components/OrgChart";
import { Shield } from "lucide-react";

const foundersData = [
  {
    id: "founder-1",
    name: "Sheick Roshan Jamil",
    title: "Co-fondateur et Ex-Président",
    image: "/image/founder1.jpg",
  },
  {
    id: "founder-2",
    name: "Abdoul Moumin",
    title: "Co-fondateur",
    image: "/image/founder2.jpg",
  },
];

const resolveImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl) return "/placeholder.svg";
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  return getPublicUrl(imageUrl);
};

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

  const toOrgPerson = (d: (typeof directors)[number], variant: "director" | "staff"): OrgPerson => ({
    id: d.id,
    name: d.name,
    title: d.job || (variant === "director" ? "Directeur" : "Membre de l'équipe"),
    responsibility: d.responsibility,
    image: resolveImageUrl(d.image_url || d.imageUrl),
    variant,
  });

  const orgDirectors = mainDirectors.map((d) => toOrgPerson(d, "director"));
  const orgStaff = staff.map((d) => toOrgPerson(d, "staff"));
  const founders: OrgPerson[] = foundersData.map((f) => ({ ...f, variant: "founder" as const }));


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
      <PageHero
        eyebrow="Gouvernance"
        title="Les Administrateurs de FCRA"
        subtitle="Découvrez notre équipe dirigeante et la structure administrative au service de la communauté."
        icon={<Shield className="h-8 w-8 text-green-600 shrink-0" />}
      />

      <section className="py-12 lg:py-16 bg-gray-50 min-h-[40vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="rounded-2xl bg-white border border-gray-200/80 shadow-sm p-6 sm:p-10 overflow-x-auto">
              <OrgChart
                directors={orgDirectors}
                staff={orgStaff}
                founders={founders}
                showFounders
              />
            </div>
          </ScrollReveal>

          {mainDirectors.length === 0 && staff.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <p>Aucun directeur enregistré pour le moment.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Administrations;
