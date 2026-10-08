import { Link, useSearchParams } from "react-router";
import type { Route } from "./+types/detail";
import { pokemons, typeColorMap } from "../data/pokemon";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "포켓몬 상세 정보 | 6주차 실습" },
    { name: "description", content: "포켓몬 도감 상세 카드" },
  ];
}

export default function Detail() {
  const [searchParams] = useSearchParams();
  const idParam = searchParams.get("id");
  const pokemonId = idParam ? parseInt(idParam, 10) : 25;

  const currentPokemon = pokemons.find((p) => p.id === pokemonId) || pokemons.find((p) => p.id === 25)!;

  // 이전/다음 포켓몬 찾기
  const currentIndex = pokemons.findIndex((p) => p.id === currentPokemon.id);
  const prevPokemon = currentIndex > 0 ? pokemons[currentIndex - 1] : null;
  const nextPokemon = currentIndex < pokemons.length - 1 ? pokemons[currentIndex + 1] : null;

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
            {prevPokemon ? (
              <Link
                to={`/detail?id=${prevPokemon.id}`}
                className="px-3 py-1.5 bg-white hover:bg-gray-100 text-[#6a6a6a] hover:text-[#222222] border border-[#ebebeb] rounded-full text-xs font-medium transition-colors"
              >
                ← #{String(prevPokemon.id).padStart(3, "0")} {prevPokemon.name}
              </Link>
            ) : <span />}
            {nextPokemon && (
              <Link
                to={`/detail?id=${nextPokemon.id}`}
                className="px-3 py-1.5 bg-white hover:bg-gray-100 text-[#6a6a6a] hover:text-[#222222] border border-[#ebebeb] rounded-full text-xs font-medium transition-colors"
              >
                #{String(nextPokemon.id).padStart(3, "0")} {nextPokemon.name} →
              </Link>
            )}
          </div>
        </div>

        {/* 상세 메인 카드 */}
        <div className="bg-white rounded-3xl border border-[#ebebeb] shadow-sm overflow-hidden">
          
          {/* 상단 비주얼 영역 */}
          <div
            className="w-full p-8 sm:p-12 flex flex-col items-center justify-center relative"
            style={{ backgroundColor: currentPokemon.bgColor }}
          >
            <span className="absolute top-6 left-6 font-mono text-sm font-bold text-[#929292] bg-white/70 backdrop-blur-xs px-3 py-1 rounded-full border border-black/5">
              No. {String(currentPokemon.id).padStart(3, "0")}
            </span>

            <div className="w-48 h-48 sm:w-60 sm:h-60 flex items-center justify-center my-2">
              <img
                src={currentPokemon.image}
                alt={currentPokemon.name}
                className="w-full h-full object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* 하단 상세 정보 영역 */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#222222]">
                  {currentPokemon.name}
                </h1>
                <p className="text-sm text-[#929292]">
                  {currentPokemon.enName} · {currentPokemon.category}
                </p>
              </div>

              {/* 타입 뱃지 */}
              <div className="flex gap-1.5">
                {currentPokemon.types.map((type) => {
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
            <div className="bg-[#f7f7f7] rounded-2xl p-4 my-6 border border-[#ebebeb]">
              <p className="text-sm text-[#3f3f3f] leading-relaxed">
                "{currentPokemon.description}"
              </p>
            </div>

            {/* 기본 스펙 그리드 */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-white rounded-xl border border-[#ebebeb]">
                <span className="block text-[11px] text-[#929292] font-medium mb-0.5">키</span>
                <span className="text-sm font-bold text-[#222222]">{currentPokemon.height}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#ebebeb]">
                <span className="block text-[11px] text-[#929292] font-medium mb-0.5">몸무게</span>
                <span className="text-sm font-bold text-[#222222]">{currentPokemon.weight}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#ebebeb]">
                <span className="block text-[11px] text-[#929292] font-medium mb-0.5">분류</span>
                <span className="text-sm font-bold text-[#222222]">{currentPokemon.category}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
