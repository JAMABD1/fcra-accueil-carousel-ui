import { cn } from "@/lib/utils";
import { Briefcase } from "lucide-react";

export interface OrgPerson {
  id: string;
  name: string;
  title: string;
  image: string;
  responsibility?: string | null;
  variant?: "director" | "staff" | "founder";
  highlighted?: boolean;
}

interface OrgChartNodeProps {
  person: OrgPerson;
  compact?: boolean;
}

export const OrgChartNode = ({ person, compact = false }: OrgChartNodeProps) => {
  const isDirector = person.variant === "director";
  const isFounder = person.variant === "founder";

  return (
    <div
      className={cn(
        "flex flex-col items-center text-center transition-all duration-200",
        person.highlighted === false && "opacity-30 scale-95",
        person.highlighted === true && "scale-105",
        compact ? "w-[120px] sm:w-[140px]" : "w-[140px] sm:w-[160px]"
      )}
    >
      <div
        className={cn(
          "relative rounded-full overflow-hidden ring-4 shadow-md bg-white transition-all",
          isDirector && "ring-green-600 w-20 h-20 sm:w-24 sm:h-24",
          isFounder && "ring-green-500/80 w-[4.5rem] h-[4.5rem] sm:w-[5.5rem] sm:h-[5.5rem]",
          !isDirector && !isFounder && "ring-green-200 w-16 h-16 sm:w-20 sm:h-20"
        )}
      >
        <img
          src={person.image}
          alt={person.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <p
        className={cn(
          "mt-2 font-bold text-gray-900 leading-tight",
          isDirector ? "text-sm sm:text-base" : "text-xs sm:text-sm"
        )}
      >
        {person.name}
      </p>
      <p className="flex items-center justify-center gap-1 text-[10px] sm:text-xs font-medium text-green-700 mt-0.5 line-clamp-2">
        <Briefcase className="h-3 w-3 shrink-0 hidden sm:block" />
        {person.title}
      </p>
      {person.responsibility && !compact && (
        <p className="text-[10px] text-gray-500 mt-1 line-clamp-2 max-w-[140px]">
          {person.responsibility}
        </p>
      )}
    </div>
  );
};

interface OrgChartProps {
  directors: OrgPerson[];
  staff: OrgPerson[];
  founders?: OrgPerson[];
  showFounders?: boolean;
}

const ConnectorDown = () => (
  <div className="flex flex-col items-center w-full" aria-hidden>
    <div className="w-0.5 h-8 bg-green-500" />
  </div>
);

const StaffRow = ({ people }: { people: OrgPerson[] }) => {
  if (people.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto">
      {people.length > 1 && (
        <div className="flex justify-center px-4 mb-0" aria-hidden>
          <div className="relative w-full max-w-4xl h-6">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-0.5 h-3 bg-green-500" />
            <div className="absolute top-3 left-[8%] right-[8%] h-0.5 bg-green-500" />
            <div
              className="absolute top-3 flex justify-between w-full px-[8%]"
              style={{ left: 0, right: 0 }}
            >
              {people.map((p) => (
                <div key={p.id} className="flex flex-col items-center flex-1">
                  <div className="w-0.5 h-3 bg-green-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {people.length === 1 && (
        <div className="flex justify-center" aria-hidden>
          <div className="w-0.5 h-6 bg-green-500" />
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-6 sm:gap-8 px-2">
        {people.map((person) => (
          <div key={person.id} className="flex flex-col items-center">
            {people.length > 1 && <div className="w-0.5 h-0 bg-transparent sm:hidden" />}
            <OrgChartNode person={person} />
          </div>
        ))}
      </div>
    </div>
  );
};

const FoundersBranch = ({ founders }: { founders: OrgPerson[] }) => {
  if (founders.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-16 pt-10 border-t border-dashed border-green-200">
      <p className="eyebrow-label text-center mb-6">Héritage — Fondateurs</p>

      <div className="flex flex-col items-center">
        <div className="w-0.5 h-6 bg-green-400" aria-hidden />
        {founders.length > 1 && (
          <div className="relative w-full max-w-md h-6" aria-hidden>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-green-400" />
            <div className="absolute top-3 left-[15%] right-[15%] h-0.5 bg-green-400" />
            <div className="absolute top-3 left-[15%] w-0.5 h-3 bg-green-400" />
            <div className="absolute top-3 right-[15%] w-0.5 h-3 bg-green-400" />
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-10 sm:gap-16">
          {founders.map((founder) => (
            <OrgChartNode key={founder.id} person={founder} />
          ))}
        </div>
      </div>
    </div>
  );
};

const OrgChart = ({ directors, staff, founders = [], showFounders = true }: OrgChartProps) => {
  const hasDirectors = directors.length > 0;
  const hasStaff = staff.length > 0;

  return (
    <div className="org-chart w-full py-4">
      {hasDirectors && (
        <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
          {directors.map((director) => (
            <OrgChartNode key={director.id} person={director} />
          ))}
        </div>
      )}

      {hasDirectors && hasStaff && <ConnectorDown />}

      {!hasDirectors && hasStaff && (
        <p className="eyebrow-label text-center mb-6">Équipe administrative</p>
      )}

      {hasStaff && <StaffRow people={staff} />}

      {showFounders && founders.length > 0 && (
        <FoundersBranch founders={founders} />
      )}
    </div>
  );
};

export default OrgChart;
