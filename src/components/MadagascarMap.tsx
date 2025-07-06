import { Circle } from "lucide-react";

interface Center {
  id: string;
  name: string;
  location: string;
  coordinates: {
    x: number;
    y: number;
  };
}

interface MadagascarMapProps {
  centers: Center[];
  onCenterClick: (centerId: string) => void;
}

const MadagascarMap = ({ centers, onCenterClick }: MadagascarMapProps) => {
  return (
    <div className="relative w-full h-full">
      <svg
        viewBox="0 0 744 1052"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main Madagascar outline */}
        <path
          d="M430.5 205.5L438 189L443 176.5L450.5 167L459 158.5L467 153L476.5 149L487 146.5L496 145.5L505.5 146L514 148L521.5 151.5L528 156.5L533.5 163L537.5 170.5L540 179L541 188L540.5 197.5L538.5 206.5L535 215L530.5 223L525 230.5L519 237.5L512.5 244L505.5 250L498 255.5L490 260.5L482 265L474 269L466 272.5L458 275.5L450 278L442 280L434 281.5L426 282.5L418 283L410 283L402 282.5L394 281.5L386 280L378 278L370 275.5L362 272.5L354 269L346 265L338 260.5L330 255.5L322.5 250L315.5 244L309 237.5L303 230.5L297.5 223L293 215L289.5 206.5L287.5 197.5L287 188L288 179L290.5 170.5L294.5 163L300 156.5L306.5 151.5L314 148L322.5 146L332 145.5L341 146.5L351.5 149L361 153L369 158.5L377.5 167L385 176.5L390 189L397.5 205.5L430.5 205.5Z"
          fill="#E5E7EB"
          stroke="#374151"
          strokeWidth="2"
        />

        {/* Antananarivo region */}
        <path
          d="M430.5 205.5L438 189L443 176.5L450.5 167L459 158.5L467 153L476.5 149L487 146.5L496 145.5L505.5 146L514 148L521.5 151.5L528 156.5L533.5 163L537.5 170.5L540 179L541 188L540.5 197.5L538.5 206.5L535 215L530.5 223L525 230.5L519 237.5L512.5 244L505.5 250L498 255.5L490 260.5L482 265L474 269L466 272.5L458 275.5L450 278L442 280L434 281.5L426 282.5L418 283L410 283L402 282.5L394 281.5L386 280L378 278L370 275.5L362 272.5L354 269L346 265L338 260.5L330 255.5L322.5 250L315.5 244L309 237.5L303 230.5L297.5 223L293 215L289.5 206.5L287.5 197.5L287 188L288 179L290.5 170.5L294.5 163L300 156.5L306.5 151.5L314 148L322.5 146L332 145.5L341 146.5L351.5 149L361 153L369 158.5L377.5 167L385 176.5L390 189L397.5 205.5L430.5 205.5Z"
          fill="#E5E7EB"
          stroke="#374151"
          strokeWidth="2"
        />

        {/* Center markers */}
        {centers.map((center) => (
          <g
            key={center.id}
            transform={`translate(${center.coordinates.x}, ${center.coordinates.y})`}
            onClick={() => onCenterClick(center.id)}
            className="cursor-pointer transition-transform hover:scale-110"
          >
            <circle r="8" fill="#059669" />
            <circle r="4" fill="#ffffff" />
          </g>
        ))}
      </svg>
    </div>
  );
};

export default MadagascarMap; 