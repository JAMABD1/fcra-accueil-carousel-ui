import { useEffect, useRef, useState } from "react";
import { slugify } from "@/lib/utils/slug";

// Auto-derives a slug from `sourceValue` until the user edits the slug
// field directly, at which point it stops overwriting their input.
export function useSlugField(sourceValue: string, isEditing: boolean) {
  const [slug, setSlugState] = useState("");
  const touchedRef = useRef(isEditing);

  useEffect(() => {
    touchedRef.current = isEditing;
  }, [isEditing]);

  useEffect(() => {
    if (touchedRef.current) return;
    setSlugState(slugify(sourceValue));
  }, [sourceValue]);

  const setSlug = (value: string) => {
    touchedRef.current = true;
    setSlugState(value);
  };

  const initSlug = (value: string) => {
    setSlugState(value);
  };

  return { slug, setSlug, initSlug };
}
