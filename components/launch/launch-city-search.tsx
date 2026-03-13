"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Doc } from "@/convex/_generated/dataModel";

interface LaunchCitySearchProps {
  onSelect: (metroId: string) => void;
  onClear: () => void;
  initialValue?: string; // Pre-fill the search input (e.g. "Chicago, IL")
}

export function LaunchCitySearch({ onSelect, onClear, initialValue }: LaunchCitySearchProps) {
  const metros = useQuery(api.metros.listActiveMetros);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (initialValue && !hasInitialized.current) {
      setSearch(initialValue);
      hasInitialized.current = true;
    }
  }, [initialValue]);

  const filtered = useMemo((): Doc<"metros">[] => {
    if (!metros) return [];
    if (!search) return metros;
    const lower = search.toLowerCase();
    return metros.filter(
      (m: Doc<"metros">) =>
        m.displayName.toLowerCase().includes(lower) ||
        m.cities.some((c: string) => c.toLowerCase().includes(lower)),
    );
  }, [metros, search]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(metroId: string, displayName: string) {
    setSearch(displayName);
    setIsOpen(false);
    onSelect(metroId);
  }

  function handleClear() {
    setSearch("");
    setIsOpen(false);
    onClear();
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search cities..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
            if (!e.target.value) onClear();
          }}
          onFocus={() => setIsOpen(true)}
          className="rounded-lg border-border h-11 pl-10 pr-10"
        />
        {search && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {isOpen && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-background shadow-md max-h-60 overflow-y-auto">
          {filtered.map((metro: Doc<"metros">) => (
            <button
              key={metro._id}
              type="button"
              onClick={() => handleSelect(metro._id, metro.displayName)}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors first:rounded-t-xl last:rounded-b-xl"
            >
              {metro.displayName}
            </button>
          ))}
        </div>
      )}
      {isOpen && search && filtered.length === 0 && metros && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-background shadow-md px-4 py-3">
          <p className="text-sm text-muted-foreground">No cities found</p>
        </div>
      )}
    </div>
  );
}
