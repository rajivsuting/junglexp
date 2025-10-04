import { Clock, MapPin, Star, Users, Zap } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

interface ActivityTitleSectionProps {
  name: string;
  rating?: number | null;
  zone?: {
    name: string;
    park?: {
      name: string;
      city?: {
        name: string;
        state?: {
          name: string;
        };
      };
    };
  } | null;
  duration?: string | null;
  difficulty?: string | null;
  maxGroupSize?: number | null;
}

export function ActivityTitleSection({
  name,
  rating,
  zone,
  duration,
  difficulty,
  maxGroupSize,
}: ActivityTitleSectionProps) {
  const location = zone?.park?.city
    ? `${zone.name}, ${zone.park.name}, ${zone.park.city.name}`
    : zone?.name || "Location not specified";

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "moderate":
        return "bg-yellow-100 text-yellow-800";
      case "challenging":
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">{name}</h1>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{rating}</span>
          </div>
        )}

        {/* Location */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
      </div>

      {/* Activity Details */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Duration */}
        {duration && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{duration}</span>
          </div>
        )}

        {/* Difficulty */}
        {difficulty && (
          <Badge variant="secondary" className={getDifficultyColor(difficulty)}>
            <Zap className="w-3 h-3 mr-1" />
            {difficulty}
          </Badge>
        )}

        {/* Group Size */}
        {maxGroupSize && (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              Max {maxGroupSize} people
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
