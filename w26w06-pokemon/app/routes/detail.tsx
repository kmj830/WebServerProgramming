import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import type { Route } from "./+types/detail";
import {
  type PokemonDetail,
  fetchPokemonById,
  typeColorMap,
} from "../services/pokemonApi";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "포켓몬 상세 정보 | PokeAPI REST API" },
    { name: "description", content: "PokeAPI REST API로 실시간 조회한 포켓몬 상세 정보" },
  ];
}

export default function Detail() {
  const [searchParams] = useSearchParams();
  const idParam = searchParams.get("id");
  const pokemonId = idParam ? parseInt(idParam, 10) : 25;

  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function loadDetail() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPokemonById(pokemonId);
        if (!ignore) {
          if (data) {
            setPokemon(data);
          } else {
            setError(`도감 번호 #${pokemonId}에 해당하는 포켓몬을 찾을 수 없습니다.`);
          }
        }
      } catch (err) {
        if (!ignore) {
          setError("PokeAPI 서버로부터 상세 정보를 불러오지 못했습니다.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadDetail();
    return () => {
      ignore = true;
    };
  }, [pokemonId]);

  const prevId = pokemonId > 1 ? pokemonId - 1 : null;
  const nextId = pokemonId + 1;

  return (
    <div className="min-h-screen bg-[#f7f7f7] py-6 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* 상단 네비게이션 */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-[#222222] text-sm font-medium rounded-full border border-[#ebebeb] shadow-xs transition-colors"
          >
            <svg className="w-4 h-4 text-[#6a6a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>도감 목록으로</span>
          </Link>

          {/* 이전 / 다음 포켓몬 이동 */}
          <div className="flex items-center gap-2">
            {prevId && (
              <Link
                to={`/detail?id=${prevId}`}
                className="px-3 py-1.5 bg-white hover:bg-gray-100 text-[#6a6a6a] hover:text-[#222222] border border-[#ebebeb] rounded-full text-xs font-medium transition-colors"
              >
                ← 이전 포켓몬 (#{prevId})
              </Link>
            )}
            <Link
              to={`/detail?id=${nextId}`}
              className="px-3 py-1.5 bg-white hover:bg-gray-100 text-[#6a6a6a] hover:text-[#222222] border border-[#ebebeb] rounded-full text-xs font-medium transition-colors"
            >
              다음 포켓몬 (#{nextId}) →
            </Link>
          </div>
        </div>

        {/* 에러 상태 안내 */}
        {error && (
          <div className="bg-white rounded-3xl p-8 border border-rose-200 text-center shadow-sm">
            <div className="text-4xl mb-3">⚠️</div>
            <h2 className="text-lg font-bold text-[#222222] mb-2">{error}</h2>
            <p className="text-xs text-[#6a6a6a] mb-6">PokeAPI 서버 상태나 입력 번호를 다시 확인해 주세요.</p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-2.5 bg-[#222222] text-white text-xs font-semibold rounded-full"
            >
              목록으로 돌아가기
            </Link>
          </div>
        )}

        {/* 로딩 스켈레톤 */}
        {loading && (
          <div className="bg-white rounded-3xl border border-[#ebebeb] shadow-sm overflow-hidden animate-pulse">
            <div className="w-full h-72 sm:h-80 bg-gray-100 flex items-center justify-center" />
            <div className="p-6 sm:p-8">
              <div className="h-6 bg-gray-100 rounded-md w-1/3 mb-2" />
              <div className="h-4 bg-gray-100 rounded-md w-1/4 mb-6" />
              <div className="h-16 bg-gray-100 rounded-2xl mb-6" />
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="h-14 bg-gray-100 rounded-xl" />
                <div className="h-14 bg-gray-100 rounded-xl" />
                <div className="h-14 bg-gray-100 rounded-xl" />
              </div>
            </div>
          </div>
        )}

        {/* 상세 메인 카드 */}
        {!loading && pokemon && (
          <div className="bg-white rounded-3xl border border-[#ebebeb] shadow-sm overflow-hidden">
            
            {/* 상단 비주얼 영역 */}
            <div
              className="w-full p-8 sm:p-12 flex flex-col items-center justify-center relative transition-colors duration-300"
              style={{ backgroundColor: pokemon.bgColor }}
            >
              <span className="absolute top-6 left-6 font-mono text-sm font-bold text-[#929292] bg-white/70 backdrop-blur-xs px-3 py-1 rounded-full border border-black/5">
                No. {String(pokemon.id).padStart(3, "0")}
              </span>

              <div className="w-48 h-48 sm:w-60 sm:h-60 flex items-center justify-center my-2">
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="w-full h-full object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            {/* 하단 상세 정보 영역 */}
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#222222]">
                    {pokemon.name}
                  </h1>
                  <p className="text-sm text-[#929292]">
                    {pokemon.enName} · {pokemon.category}
                  </p>
                </div>

                {/* 타입 뱃지 */}
                <div className="flex gap-1.5">
                  {pokemon.types.map((type) => {
                    const style = typeColorMap[type] || {
                      bg: "bg-gray-100",
                      text: "text-gray-700",
                      border: "border-gray-200",
                    };
                    return (
                      <span
                        key={type}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${style.bg} ${style.text} ${style.border}`}
                      >
                        {type}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* 도감 설명 박스 */}
              {pokemon.description && (
                <div className="bg-[#f7f7f7] rounded-2xl p-4 my-6 border border-[#ebebeb]">
                  <p className="text-sm text-[#3f3f3f] leading-relaxed">
                    "{pokemon.description}"
                  </p>
                </div>
              )}

              {/* 기본 스펙 그리드 */}
              <div className="grid grid-cols-3 gap-3 text-center mb-8">
                <div className="p-3 bg-[#f7f7f7] rounded-xl border border-[#ebebeb]">
                  <span className="block text-[11px] text-[#929292] font-medium mb-0.5">키</span>
                  <span className="text-sm font-bold text-[#222222]">{pokemon.height}</span>
                </div>
                <div className="p-3 bg-[#f7f7f7] rounded-xl border border-[#ebebeb]">
                  <span className="block text-[11px] text-[#929292] font-medium mb-0.5">몸무게</span>
                  <span className="text-sm font-bold text-[#222222]">{pokemon.weight}</span>
                </div>
                <div className="p-3 bg-[#f7f7f7] rounded-xl border border-[#ebebeb]">
                  <span className="block text-[11px] text-[#929292] font-medium mb-0.5">분류</span>
                  <span className="text-sm font-bold text-[#222222]">{pokemon.category}</span>
                </div>
              </div>

              {/* 종족값 (Base Stats) 게이지 바 */}
              {pokemon.stats && pokemon.stats.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-[#222222] mb-3">종족값 (Base Stats)</h3>
                  <div className="space-y-2.5">
                    {pokemon.stats.map((stat) => {
                      // 최대 종족값 255 기준 비율
                      const percent = Math.min(100, Math.round((stat.value / 200) * 100));
                      return (
                        <div key={stat.name} className="flex items-center text-xs">
                          <span className="w-20 font-medium text-[#6a6a6a]">{stat.label}</span>
                          <span className="w-10 font-bold text-[#222222] text-right pr-3 font-mono">
                            {stat.value}
                          </span>
                          <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-[#222222] h-full rounded-full transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
