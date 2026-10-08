import { useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/list";
import { pokemons, typeColorMap } from "../data/pokemon";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "포켓몬 도감 | 6주차 실습" },
    { name: "description", content: "React Router v7과 Tailwind CSS로 구현된 포켓몬 도감" },
  ];
}

const ALL_TYPES = ["전체", "풀", "불꽃", "물", "전기", "독", "노말", "에스퍼"];

export default function List() {
  const [selectedType, setSelectedType] = useState("전체");

  const filteredPokemons = selectedType === "전체"
    ? pokemons
    : pokemons.filter((p) => p.types.includes(selectedType));

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
              // 로컬 dev 환경과 GitHub Pages 배포 환경 모두 대응
              if (window.location.pathname.includes('/build/client')) {
                e.preventDefault();
                window.location.href = '../../../';
              }
            }}
          >
            <svg className="w-4 h-4 text-[#6a6a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>메인 포털</span>
          </a>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#ebebeb] text-[#6a6a6a] rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#ff385c]" />
              총 {pokemons.length}마리 등록
            </span>
          </div>
        </header>

        {/* 타이틀 섹션 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xl">⚡</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff385c]">6주차 실습 과제</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#222222] tracking-tight">
            포켓몬 도감 (Pokédex)
          </h1>
          <p className="text-sm text-[#6a6a6a] mt-1.5">
            React Router v7과 Tailwind CSS로 구현된 반응형 카드 도감입니다. 카드를 클릭하면 상세 정보를 확인할 수 있습니다.
          </p>
        </div>

        {/* 타입 필터 칩 바 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {ALL_TYPES.map((type) => {
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

        {/* 포켓몬 카드 그리드 */}
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
                  <h2 className="text-base font-semibold text-[#222222] group-hover:text-[#ff385c] transition-colors">
                    {pokemon.name}
                  </h2>
                  <span className="text-[11px] text-[#929292] font-normal">
                    {pokemon.category}
                  </span>
                </div>
                <p className="text-xs text-[#929292] mb-3">
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

        {/* 검색 결과 없음 안내 */}
        {filteredPokemons.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#ebebeb]">
            <p className="text-sm text-[#6a6a6a]">선택한 타입의 포켓몬이 없습니다.</p>
          </div>
        )}

      </div>
    </div>
  );
}
