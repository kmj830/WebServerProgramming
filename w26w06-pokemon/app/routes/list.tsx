import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/list";
import {
  type Pokemon,
  fetchPokemonList,
  typeColorMap,
} from "../services/pokemonApi";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "포켓몬 도감 | PokeAPI REST API" },
    { name: "description", content: "PokeAPI REST API를 통해 실시간으로 데이터를 불러오는 포켓몬 도감" },
  ];
}

const PAGE_SIZE = 20;

export default function List() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedType, setSelectedType] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");

  // 최초 20마리 실시간 REST API 로드
  useEffect(() => {
    let ignore = false;
    async function loadInitial() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPokemonList(0, PAGE_SIZE);
        if (!ignore) {
          setPokemons(data.pokemons);
          setTotalCount(data.totalCount);
          setHasMore(data.hasMore);
          setOffset(PAGE_SIZE);
        }
      } catch (err) {
        if (!ignore) {
          setError("PokeAPI 서버로부터 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    loadInitial();
    return () => {
      ignore = true;
    };
  }, []);

  // 더보기 클릭 시 다음 20마리 비동기 페칭
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const data = await fetchPokemonList(offset, PAGE_SIZE);
      setPokemons((prev) => [...prev, ...data.pokemons]);
      setOffset((prev) => prev + PAGE_SIZE);
      setHasMore(data.hasMore);
    } catch (err) {
      console.error("Failed to load more pokemons:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // 등록된 포켓몬들의 고유 타입 추출
  const availableTypes = useMemo(() => {
    const set = new Set<string>();
    pokemons.forEach((p) => p.types.forEach((t) => set.add(t)));
    return ["전체", ...Array.from(set)];
  }, [pokemons]);

  // 검색어 및 타입 복합 필터링
  const filteredPokemons = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return pokemons.filter((p) => {
      const matchesType = selectedType === "전체" || p.types.includes(selectedType);
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.enName.toLowerCase().includes(q) ||
        String(p.id) === q ||
        String(p.id).padStart(3, "0") === q;
      return matchesType && matchesQuery;
    });
  }, [pokemons, selectedType, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f7f7f7] py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* 상단 네비게이션 바 */}
        <header className="flex items-center justify-between mb-8 pb-5 border-b border-[#ebebeb]">
          <a
            href="../../"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-100 text-[#222222] text-sm font-medium rounded-full border border-[#ebebeb] shadow-xs transition-colors"
            title="메인 포털 페이지로 돌아가기"
            onClick={(e) => {
              if (window.location.hostname.includes("vercel.app")) {
                e.preventDefault();
                window.location.href = "https://kmj830.github.io/WebServerProgramming/";
              } else if (window.location.pathname.includes("/build/client")) {
                e.preventDefault();
                window.location.href = "../../../";
              }
            }}
          >
            <svg className="w-4 h-4 text-[#6a6a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>메인 포털</span>
          </a>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#ebebeb] text-[#6a6a6a] rounded-full text-xs font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              REST API 실시간 연동 ({pokemons.length}마리 로드됨 / 전체 {totalCount || "1,300+"})
            </span>
          </div>
        </header>

        {/* 타이틀 & 검색창 섹션 */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl">🌐</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#ff385c]">PokeAPI Live REST API</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#222222] tracking-tight">
              포켓몬 도감 (Pokédex)
            </h1>
            <p className="text-sm text-[#6a6a6a] mt-1.5">
              별도의 파일 저장 없이 pokeapi.co에서 실시간 REST API로 데이터를 가져옵니다. 카드를 클릭하면 상세 스탯을 확인할 수 있습니다.
            </p>
          </div>

          {/* 검색 입력창 */}
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-[#929292]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="로드된 포켓몬 이름/번호 검색..."
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#dddddd] rounded-full text-sm text-[#222222] placeholder-[#929292] focus:outline-hidden focus:border-[#222222] focus:ring-1 focus:ring-[#222222] shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#929292] hover:text-[#222222]"
                title="검색어 지우기"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 타입 필터 칩 바 */}
        {availableTypes.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
            {availableTypes.map((type) => {
              const isActive = selectedType === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-[#222222] text-white shadow-xs"
                      : "bg-white text-[#6a6a6a] border border-[#ebebeb] hover:border-[#c1c1c1] hover:text-[#222222]"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        )}

        {/* 에러 상태 안내 */}
        {error && (
          <div className="p-4 mb-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm">
            {error}
          </div>
        )}

        {/* 결과 카운터 */}
        {!loading && (
          <div className="flex items-center justify-between mb-4 px-1">
            <span className="text-xs font-medium text-[#6a6a6a]">
              {searchQuery || selectedType !== "전체" ? (
                <>
                  검색 결과 <strong className="text-[#222222]">{filteredPokemons.length}</strong>개
                </>
              ) : (
                <>
                  현재 로드됨: <strong className="text-[#222222]">{pokemons.length}</strong>마리
                </>
              )}
            </span>
          </div>
        )}

        {/* 최초 로딩 스켈레톤 그리드 */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#ebebeb] p-3.5 flex flex-col justify-between animate-pulse"
              >
                <div className="w-full aspect-square bg-gray-100 rounded-xl mb-3" />
                <div className="h-4 bg-gray-100 rounded-md w-2/3 mb-2" />
                <div className="h-3 bg-gray-100 rounded-md w-1/2 mb-3" />
                <div className="flex gap-1">
                  <div className="h-4 bg-gray-100 rounded-full w-10" />
                  <div className="h-4 bg-gray-100 rounded-full w-10" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 포켓몬 카드 그리드 */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {filteredPokemons.map((pokemon) => (
              <Link
                key={pokemon.id}
                to={`/detail?id=${pokemon.id}`}
                className="group bg-white rounded-2xl border border-[#ebebeb] p-3.5 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
              >
                {/* 이미지 썸네일 박스 */}
                <div
                  className="w-full aspect-square rounded-xl flex items-center justify-center p-3 mb-3 relative overflow-hidden"
                  style={{ backgroundColor: pokemon.bgColor }}
                >
                  <span className="absolute top-2 left-2 text-[10px] font-mono font-bold text-[#929292]">
                    #{String(pokemon.id).padStart(3, "0")}
                  </span>
                  <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    loading="lazy"
                    className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300 drop-shadow-xs"
                  />
                </div>

                {/* 텍스트 메타 정보 */}
                <div>
                  <div className="flex items-baseline justify-between mb-0.5">
                    <h2
                      className="text-base font-semibold text-[#222222] group-hover:text-[#ff385c] transition-colors truncate"
                      title={pokemon.name}
                    >
                      {pokemon.name}
                    </h2>
                    <span
                      className="text-[11px] text-[#929292] font-normal truncate max-w-[50%]"
                      title={pokemon.category}
                    >
                      {pokemon.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#929292] mb-3 truncate" title={pokemon.enName}>
                    {pokemon.enName}
                  </p>

                  {/* 타입 뱃지 */}
                  <div className="flex flex-wrap gap-1">
                    {pokemon.types.map((type) => {
                      const style = typeColorMap[type] || {
                        bg: "bg-gray-100",
                        text: "text-gray-700",
                        border: "border-gray-200",
                      };
                      return (
                        <span
                          key={type}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${style.bg} ${style.text} ${style.border}`}
                        >
                          {type}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 검색 결과 없음 안내 */}
        {!loading && filteredPokemons.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#ebebeb] p-8">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-base font-bold text-[#222222] mb-1">검색 결과가 없습니다</h3>
            <p className="text-xs text-[#6a6a6a] mb-4">
              현재 로드된 목록에서 일치하는 포켓몬을 찾을 수 없습니다. 아래의 "포켓몬 더보기"를 클릭하여 더 많은 포켓몬을 로드하거나 검색어를 확인해 보세요.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedType("전체");
              }}
              className="px-4 py-2 bg-[#222222] hover:bg-black text-white text-xs font-semibold rounded-full transition-colors cursor-pointer"
            >
              필터 및 검색어 초기화
            </button>
          </div>
        )}

        {/* 더보기 (Pagination) 버튼 */}
        {!loading && hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 border border-[#dddddd] hover:border-[#222222] text-[#222222] text-sm font-semibold rounded-full shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {loadingMore ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#ff385c]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>PokeAPI에서 다음 포켓몬 불러오는 중...</span>
                </>
              ) : (
                <>
                  <span>포켓몬 더 불러오기 (+20)</span>
                  <svg className="w-4 h-4 text-[#6a6a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
