export interface Pokemon {
  id: number;
  name: string;
  enName: string;
  types: string[];
  image: string;
  bgColor: string;
  category: string;
  height: string;
  weight: string;
  description?: string;
}

export interface PokemonStat {
  name: string;
  label: string;
  value: number;
}

export interface PokemonDetail extends Pokemon {
  stats: PokemonStat[];
  abilities: string[];
}

export const typeColorMap: Record<string, { bg: string; text: string; border: string }> = {
  풀: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  독: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  불꽃: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  물: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
  전기: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  노말: { bg: "bg-stone-50", text: "text-stone-700", border: "border-stone-200" },
  에스퍼: { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
  벌레: { bg: "bg-lime-50", text: "text-lime-800", border: "border-lime-200" },
  비행: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
  땅: { bg: "bg-amber-100/60", text: "text-amber-900", border: "border-amber-300" },
  바위: { bg: "bg-stone-100", text: "text-stone-800", border: "border-stone-300" },
  격투: { bg: "bg-orange-50", text: "text-orange-800", border: "border-orange-200" },
  고스트: { bg: "bg-indigo-50", text: "text-indigo-800", border: "border-indigo-200" },
  드래곤: { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
  강철: { bg: "bg-slate-100", text: "text-slate-800", border: "border-slate-300" },
  얼음: { bg: "bg-cyan-50", text: "text-cyan-800", border: "border-cyan-200" },
  악: { bg: "bg-neutral-100", text: "text-neutral-800", border: "border-neutral-300" },
  페어리: { bg: "bg-fuchsia-50", text: "text-fuchsia-700", border: "border-fuchsia-200" },
};

const TYPE_KO_MAP: Record<string, string> = {
  normal: "노말",
  fire: "불꽃",
  water: "물",
  electric: "전기",
  grass: "풀",
  ice: "얼음",
  fighting: "격투",
  poison: "독",
  ground: "땅",
  flying: "비행",
  psychic: "에스퍼",
  bug: "벌레",
  rock: "바위",
  ghost: "고스트",
  dragon: "드래곤",
  steel: "강철",
  dark: "악",
  fairy: "페어리",
};

const BG_COLOR_MAP: Record<string, string> = {
  grass: "#f0fdf4",
  fire: "#fff1f2",
  water: "#f0f9ff",
  electric: "#fefce8",
  poison: "#faf5ff",
  normal: "#fafaf9",
  psychic: "#fdf2f8",
  bug: "#f7fee7",
  flying: "#f0fdfa",
  ground: "#fef3c7",
  rock: "#f5f5f4",
  fighting: "#fff7ed",
  ghost: "#f5f3ff",
  steel: "#f8fafc",
  ice: "#ecfeff",
  dragon: "#eef2ff",
  dark: "#f4f4f5",
  fairy: "#fdf4ff",
};

const STAT_KO_MAP: Record<string, string> = {
  hp: "HP",
  attack: "공격",
  defense: "방어",
  "special-attack": "특수공격",
  "special-defense": "특수방어",
  speed: "스피드",
};

// 중복 네트워크 요청 방지용 캐시
const pokemonCache = new Map<number | string, Pokemon>();
const pokemonDetailCache = new Map<number | string, PokemonDetail>();

/**
 * 단일 포켓몬 상세 비동기 페칭 (REST API)
 */
export async function fetchPokemonById(idOrName: number | string): Promise<PokemonDetail | null> {
  const cacheKey = String(idOrName).toLowerCase();
  if (pokemonDetailCache.has(cacheKey)) {
    return pokemonDetailCache.get(cacheKey)!;
  }

  try {
    const [pRes, sRes] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${idOrName}`)
    ]);

    if (!pRes.ok) return null;
    const p = await pRes.json();
    const s = sRes.ok ? await sRes.json() : null;

    const koName = s?.names?.find((n: any) => n.language.name === "ko")?.name || p.name;
    const enName = s?.names?.find((n: any) => n.language.name === "en")?.name || p.name;
    const genus = s?.genera?.find((g: any) => g.language.name === "ko")?.genus || "포켓몬";

    const koFlavor = s?.flavor_text_entries?.filter((f: any) => f.language.name === "ko").pop();
    const description = koFlavor
      ? koFlavor.flavor_text.replace(/[\n\f\r]/g, " ").trim()
      : `${koName}의 상세 정보입니다.`;

    const primaryType = p.types[0]?.type?.name || "normal";
    const types = p.types.map((t: any) => TYPE_KO_MAP[t.type.name] || t.type.name);
    const bgColor = BG_COLOR_MAP[primaryType] || "#f7f7f7";

    const height = (p.height / 10).toFixed(1) + " m";
    const weight = (p.weight / 10).toFixed(1) + " kg";
    const image = p.sprites.other?.["official-artwork"]?.front_default || p.sprites.front_default;

    const stats: PokemonStat[] = p.stats.map((st: any) => ({
      name: st.stat.name,
      label: STAT_KO_MAP[st.stat.name] || st.stat.name,
      value: st.base_stat
    }));

    const abilities: string[] = p.abilities.map((a: any) => a.ability.name);

    const detail: PokemonDetail = {
      id: p.id,
      name: koName,
      enName,
      types,
      image,
      bgColor,
      category: genus,
      height,
      weight,
      description,
      stats,
      abilities
    };

    pokemonCache.set(p.id, detail);
    pokemonDetailCache.set(String(p.id), detail);
    pokemonDetailCache.set(p.name.toLowerCase(), detail);

    return detail;
  } catch (err) {
    console.error(`Error fetching pokemon ${idOrName}:`, err);
    return null;
  }
}

/**
 * 포켓몬 목록 페칭 (REST API Pagination)
 */
export async function fetchPokemonList(
  offset = 0,
  limit = 20
): Promise<{ pokemons: Pokemon[]; totalCount: number; hasMore: boolean }> {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    if (!res.ok) throw new Error("Failed to fetch list");
    const data = await res.json();

    const items: Pokemon[] = await Promise.all(
      data.results.map(async (item: { name: string; url: string }) => {
        const idStr = item.url.split("/").filter(Boolean).pop();
        const id = parseInt(idStr || "0", 10);

        if (pokemonCache.has(id)) {
          return pokemonCache.get(id)!;
        }

        const detail = await fetchPokemonById(id);
        return detail || {
          id,
          name: item.name,
          enName: item.name,
          types: ["노말"],
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
          bgColor: "#f7f7f7",
          category: "포켓몬",
          height: "- m",
          weight: "- kg",
        };
      })
    );

    return {
      pokemons: items,
      totalCount: data.count || 1302,
      hasMore: Boolean(data.next)
    };
  } catch (err) {
    console.error("Error in fetchPokemonList:", err);
    return { pokemons: [], totalCount: 0, hasMore: false };
  }
}
