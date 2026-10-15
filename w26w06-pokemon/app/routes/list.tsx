import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/list";
import {
  type Pokemon,
  fetchPokemonList,
  fetchPokemonByType,
  searchPokemonLive,
  ALL_POKEMON_TYPES,
  typeColorMap,
} from "../services/pokemonApi";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "포켓몬 도감 | PokeAPI 무한 스크롤 & 라이브 검색" },
    { name: "description", content: "PokeAPI REST API 무한 스크롤 및 실시간 직접 검색 포켓몬 도감" },
  ];
}

const PAGE_SIZE = 50;

export default function List() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedType, setSelectedType] = useState<string>("전체");
  const [typePokemons, setTypePokemons] = useState<Pokemon[] | null>(null);
  const [loadingType, setLoadingType] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  // 실시간 PokeAPI 검색 결과 및 상태
  const [apiSearchResults, setApiSearchResults] = useState<Pokemon[] | null>(null);
  const [isSearchingApi, setIsSearchingApi] = useState(false);

  // 무한 스크롤 감지용 ref (하단 백업 센티넬 및 절반 지점 프리페치 센티넬)
  const observerTarget = useRef<HTMLDivElement>(null);
  const prefetchSentinelRef = useRef<HTMLAnchorElement | null>(null);

  // 최초 50마리 실시간 REST API 로드
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
      } catch {
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

  // 특정 타입 선택 시 PokeAPI /type/{name}에서 즉시 해당 속성 포켓몬 로드
  useEffect(() => {
    if (selectedType === "전체") {
      setTypePokemons(null);
      setLoadingType(false);
      return;
    }

    let ignore = false;
    setLoadingType(true);
    fetchPokemonByType(selectedType, 50)
      .then((data) => {
        if (!ignore) {
          setTypePokemons(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load pokemons for type:", err);
      })
      .finally(() => {
        if (!ignore) {
          setLoadingType(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [selectedType]);

  // 스크롤 시 다음 50마리 비동기 페칭 (무한 스크롤 핸들러)
  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore || loading || searchQuery || selectedType !== "전체") return;
    setLoadingMore(true);
    try {
      const data = await fetchPokemonList(offset, PAGE_SIZE);
      setPokemons((prev) => {
        // ID 중복 방지
        const existingIds = new Set(prev.map((p) => p.id));
        const newOnes = data.pokemons.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newOnes];
      });
      setOffset((prev) => prev + PAGE_SIZE);
      setHasMore(data.hasMore);
    } catch (err) {
      console.error("Failed to load more pokemons:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, loading, searchQuery, selectedType, offset]);

  // 1. 절반 지점 도달 시 다음 50마리 백그라운드 프리페치 (중간 스크롤 통과 시 무음 로딩)
  useEffect(() => {
    const target = prefetchSentinelRef.current;
    if (!target || !hasMore || loadingMore || loading || searchQuery || selectedType !== "전체") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [handleLoadMore, hasMore, loadingMore, loading, searchQuery, selectedType, pokemons.length]);

  // 2. 최하단 도달 시 백업 무한 스크롤 트리거
  useEffect(() => {
    const target = observerTarget.current;
    if (!target || !hasMore || loadingMore || loading || searchQuery || selectedType !== "전체") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: "400px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [handleLoadMore, hasMore, loadingMore, loading, searchQuery, selectedType]);

  // 검색어 입력 시 로컬 확인 + PokeAPI 실시간 직접 조회 디바운스
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setApiSearchResults(null);
      setIsSearchingApi(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingApi(true);
      try {
        const liveResults = await searchPokemonLive(q, 50);
        setApiSearchResults(liveResults);
      } catch (err) {
        console.error("Live API search error:", err);
        setApiSearchResults([]);
      } finally {
        setIsSearchingApi(false);
      }
    }, 300); // 300ms 디바운스

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 표시할 포켓몬 목록 (검색 시 로컬 + 실시간 API 결과 병합 및 부분 일치 지원)
  const displayedPokemons = useMemo(() => {
    let baseList = selectedType === "전체" ? pokemons : (typePokemons || []);

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const pool = selectedType === "전체" ? pokemons : (typePokemons || []);
      const localMatches = pool.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.enName.toLowerCase().includes(q) ||
          String(p.id).includes(q) ||
          String(p.id).padStart(3, "0").includes(q)
      );

      // PokeAPI 실시간 검색 결과와 로컬 매칭 병합 (ID 중복 제거)
      const mergedMap = new Map<number, Pokemon>();
      localMatches.forEach((p) => mergedMap.set(p.id, p));
      if (apiSearchResults) {
        apiSearchResults.forEach((p) => {
          if (selectedType === "전체" || p.types.includes(selectedType)) {
            mergedMap.set(p.id, p);
          }
        });
      }
      baseList = Array.from(mergedMap.values()).sort((a, b) => a.id - b.id);
    }

    return baseList;
  }, [pokemons, typePokemons, searchQuery, apiSearchResults, selectedType]);

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
              PokeAPI 실시간 연동 ({pokemons.length}마리 로드됨 / 전체 {totalCount || "1,025+"})
            </span>
          </div>
        </header>

        {/* 타이틀 & 실시간 검색창 섹션 */}
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
              스크롤을 내리면 절반 지점에서 자동으로 다음 50마리를 미리 불러오며, 아직 로드되지 않은 포켓몬도 도감 번호나 이름으로 실시간 검색할 수 있습니다.
            </p>
          </div>

          {/* 검색 입력창 */}
          <div className="relative w-full md:w-88">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              {isSearchingApi ? (
                <svg className="animate-spin h-4 w-4 text-[#ff385c]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-[#929292]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="이름 또는 도감 번호 검색 (예: 10, 뮤츠, 피카츄)..."
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#dddddd] rounded-full text-sm text-[#222222] placeholder-[#929292] focus:outline-hidden focus:border-[#222222] focus:ring-1 focus:ring-[#222222] shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#929292] hover:text-[#222222] cursor-pointer"
                title="검색어 지우기"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 18개 전체 타입 필터 칩 바 (고정 표시) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {ALL_POKEMON_TYPES.map((type) => {
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

        {/* 에러 상태 안내 */}
        {error && (
          <div className="p-4 mb-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm">
            {error}
          </div>
        )}

        {/* 결과 카운터 및 실시간 검색 상태 */}
        {!loading && (
          <div className="flex items-center justify-between mb-4 px-1">
            <span className="text-xs font-medium text-[#6a6a6a] flex items-center gap-2">
              {searchQuery ? (
                <>
                  검색 결과 <strong className="text-[#222222]">{displayedPokemons.length}</strong>마리
                  {isSearchingApi && (
                    <span className="text-xs text-[#ff385c] inline-flex items-center gap-1 font-normal">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff385c] animate-ping" />
                      PokeAPI 실시간 조회 중...
                    </span>
                  )}
                </>
              ) : selectedType !== "전체" ? (
                <>
                  {selectedType} 속성 <strong className="text-[#222222]">{displayedPokemons.length}</strong>마리
                  {loadingType && (
                    <span className="text-xs text-[#ff385c] inline-flex items-center gap-1 font-normal">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff385c] animate-ping" />
                      속성 포켓몬 로딩 중...
                    </span>
                  )}
                </>
              ) : (
                <>
                  현재 로드됨: <strong className="text-[#222222]">{pokemons.length}</strong>마리 (절반 스크롤 시 자동 프리페치)
                </>
              )}
            </span>
          </div>
        )}

        {/* 최초 로딩 스켈레톤 그리드 */}
        {(loading || loadingType) && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {Array.from({ length: 30 }).map((_, i) => (
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
        {!loading && !loadingType && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {displayedPokemons.map((pokemon, idx) => {
              // 50개 배치 중 절반(25번째 전) 통과 시 백그라운드 프리페치 트리거
              const isHalfwaySentinel =
                selectedType === "전체" &&
                !searchQuery &&
                idx === Math.max(0, pokemons.length - 25);

              return (
                <Link
                  key={pokemon.id}
                  ref={isHalfwaySentinel ? prefetchSentinelRef : undefined}
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
              );
            })}
          </div>
        )}

        {/* 검색 결과 없음 안내 (실시간 API 조회까지 끝난 후) */}
        {!loading && !loadingType && !isSearchingApi && searchQuery && displayedPokemons.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#ebebeb] p-8 mt-6">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-base font-bold text-[#222222] mb-1">PokeAPI 조회 결과가 없습니다</h3>
            <p className="text-xs text-[#6a6a6a] mb-4">
              PokeAPI에 "{searchQuery}"와 일치하는 포켓몬이 존재하지 않습니다. 다른 한글 이름이나 정확한 도감 번호(1~1025)로 검색해 보세요.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedType("전체");
              }}
              className="px-4 py-2 bg-[#222222] hover:bg-black text-white text-xs font-semibold rounded-full transition-colors cursor-pointer"
            >
              검색어 초기화
            </button>
          </div>
        )}

        {/* 무한 스크롤 백업 관측 타겟 및 하단 로딩 스피너 */}
        {!searchQuery && selectedType === "전체" && hasMore && (
          <div ref={observerTarget} className="py-12 flex justify-center items-center">
            {loadingMore && (
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white border border-[#ebebeb] rounded-full shadow-xs text-xs font-medium text-[#6a6a6a]">
                <svg className="animate-spin h-4 w-4 text-[#ff385c]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>다음 50마리 자동 로딩 중...</span>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
