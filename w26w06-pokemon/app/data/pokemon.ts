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
  description: string;
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

export const pokemons: Pokemon[] = [
  {
    "id": 1,
    "name": "이상해씨",
    "enName": "Bulbasaur",
    "types": [
      "풀",
      "독"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
    "bgColor": "#f0fdf4",
    "category": "씨앗포켓몬",
    "height": "0.7 m",
    "weight": "6.9 kg",
    "description": "태어나서 얼마 동안 등의 씨앗에 담긴 영양을 섭취하며 자란다."
  },
  {
    "id": 2,
    "name": "이상해풀",
    "enName": "Ivysaur",
    "types": [
      "풀",
      "독"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png",
    "bgColor": "#f0fdf4",
    "category": "씨앗포켓몬",
    "height": "1.0 m",
    "weight": "13.0 kg",
    "description": "햇빛을 받을수록 몸에 힘이 솟아나 등의 꽃봉오리가 자라난다."
  },
  {
    "id": 3,
    "name": "이상해꽃",
    "enName": "Venusaur",
    "types": [
      "풀",
      "독"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png",
    "bgColor": "#f0fdf4",
    "category": "씨앗포켓몬",
    "height": "2.0 m",
    "weight": "100.0 kg",
    "description": "꽃에서 황홀한 향기가 퍼져 나와 싸우는 자의 기분을 달래준다."
  },
  {
    "id": 4,
    "name": "파이리",
    "enName": "Charmander",
    "types": [
      "불꽃"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
    "bgColor": "#fff1f2",
    "category": "도롱뇽포켓몬",
    "height": "0.6 m",
    "weight": "8.5 kg",
    "description": "태어날 때부터 꼬리에 불꽃이 타오르고 있다. 불꽃이 꺼지면 생명도 다하고 만다."
  },
  {
    "id": 5,
    "name": "리자드",
    "enName": "Charmeleon",
    "types": [
      "불꽃"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/5.png",
    "bgColor": "#fff1f2",
    "category": "화염포켓몬",
    "height": "1.1 m",
    "weight": "19.0 kg",
    "description": "싸움으로 기분이 고조되면 작열하는 불꽃을 뿜으며 주변을 태워버린다."
  },
  {
    "id": 6,
    "name": "리자몽",
    "enName": "Charizard",
    "types": [
      "불꽃",
      "비행"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
    "bgColor": "#fff1f2",
    "category": "화염포켓몬",
    "height": "1.7 m",
    "weight": "90.5 kg",
    "description": "지상 1400m까지 날개를 사용해 날 수 있다. 고열의 불꽃을 내뿜는다."
  },
  {
    "id": 7,
    "name": "꼬부기",
    "enName": "Squirtle",
    "types": [
      "물"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",
    "bgColor": "#f0f9ff",
    "category": "꼬마거북포켓몬",
    "height": "0.5 m",
    "weight": "9.0 kg",
    "description": "위험해지면 등껍질에 손발을 감추고 몸을 지키면서 입에서 물을 내뿜는다."
  },
  {
    "id": 8,
    "name": "어니부기",
    "enName": "Wartortle",
    "types": [
      "물"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/8.png",
    "bgColor": "#f0f9ff",
    "category": "거북포켓몬",
    "height": "1.0 m",
    "weight": "22.5 kg",
    "description": "탐스러운 귀와 꼬리를 능숙하게 다뤄서 수중에서의 밸런스를 유지한다."
  },
  {
    "id": 9,
    "name": "거북왕",
    "enName": "Blastoise",
    "types": [
      "물"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png",
    "bgColor": "#f0f9ff",
    "category": "껍질포켓몬",
    "height": "1.6 m",
    "weight": "85.5 kg",
    "description": "등껍질의 로켓포에서 뿜어져 나오는 제트 수류는 두꺼운 철판도 뚫는다."
  },
  {
    "id": 25,
    "name": "피카츄",
    "enName": "Pikachu",
    "types": [
      "전기"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
    "bgColor": "#fefce8",
    "category": "쥐포켓몬",
    "height": "0.4 m",
    "weight": "6.0 kg",
    "description": "서로의 꼬리를 붙여서 전기를 흐르게 하는 게 피카츄 사이의 인사법이다."
  },
  {
    "id": 26,
    "name": "라이츄",
    "enName": "Raichu",
    "types": [
      "전기"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png",
    "bgColor": "#fefce8",
    "category": "쥐포켓몬",
    "height": "0.8 m",
    "weight": "30.0 kg",
    "description": "전기 주머니가 텅 비면 꼬리를 똑바로 세워서 공기 중의 전기를 모은다."
  },
  {
    "id": 35,
    "name": "삐삐",
    "enName": "Clefairy",
    "types": [
      "페어리"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/35.png",
    "bgColor": "#fdf4ff",
    "category": "요정포켓몬",
    "height": "0.6 m",
    "weight": "7.5 kg",
    "description": "애교 있는 몸동작과 울음소리로 귀엽다고 많은 인기를 누리는 포켓몬. 그러나 좀처럼 눈에 띄지 않는다."
  },
  {
    "id": 36,
    "name": "픽시",
    "enName": "Clefable",
    "types": [
      "페어리"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/36.png",
    "bgColor": "#fdf4ff",
    "category": "요정포켓몬",
    "height": "1.3 m",
    "weight": "40.0 kg",
    "description": "1km 앞에 떨어진 바늘 소리가 들릴 정도로 귀가 좋아 평소에는 조용한 곳에서 지낸다."
  },
  {
    "id": 37,
    "name": "식스테일",
    "enName": "Vulpix",
    "types": [
      "불꽃"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/37.png",
    "bgColor": "#fff1f2",
    "category": "여우포켓몬",
    "height": "0.6 m",
    "weight": "9.9 kg",
    "description": "6개의 꼬리는 자라면서 털의 결이 좋아지며 아름다워진다. 안으면 살짝 따듯하다."
  },
  {
    "id": 38,
    "name": "나인테일",
    "enName": "Ninetales",
    "types": [
      "불꽃"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/38.png",
    "bgColor": "#fff1f2",
    "category": "여우포켓몬",
    "height": "1.1 m",
    "weight": "19.9 kg",
    "description": "머리가 좋고 집념이 강하다. 장난으로 꼬리를 잡으면 1000년 동안 화를 입는다고 한다."
  },
  {
    "id": 39,
    "name": "푸린",
    "enName": "Jigglypuff",
    "types": [
      "노말",
      "페어리"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png",
    "bgColor": "#fafaf9",
    "category": "풍선포켓몬",
    "height": "0.5 m",
    "weight": "5.5 kg",
    "description": "목소리 파장을 자유자재로 바꾸어 들으면 반드시 잠드는 신비한 멜로디를 노래한다."
  },
  {
    "id": 40,
    "name": "푸크린",
    "enName": "Wigglytuff",
    "types": [
      "노말",
      "페어리"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/40.png",
    "bgColor": "#fafaf9",
    "category": "풍선포켓몬",
    "height": "1.0 m",
    "weight": "12.0 kg",
    "description": "얇고 고운 털을 가졌다. 특히 이마에 동그랗게 말린 털은 하늘을 날 듯한 최고의 감촉을 지녔다."
  },
  {
    "id": 52,
    "name": "나옹",
    "enName": "Meowth",
    "types": [
      "노말"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png",
    "bgColor": "#fafaf9",
    "category": "요괴고양이포켓몬",
    "height": "0.4 m",
    "weight": "4.2 kg",
    "description": "이마의 금화가 더러워지지 않도록 바지런히 얼굴을 씻는다. 가라르의 나옹과는 사이가 나쁘다."
  },
  {
    "id": 53,
    "name": "페르시온",
    "enName": "Persian",
    "types": [
      "노말"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/53.png",
    "bgColor": "#fafaf9",
    "category": "샴고양이포켓몬",
    "height": "1.0 m",
    "weight": "32.0 kg",
    "description": "움직임은 우아하고 품위 있다. 야만스러운 나이킹과는 잘 맞지 않아 서로를 멸시한다."
  },
  {
    "id": 54,
    "name": "고라파덕",
    "enName": "Psyduck",
    "types": [
      "물"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png",
    "bgColor": "#f0f9ff",
    "category": "오리포켓몬",
    "height": "0.8 m",
    "weight": "19.6 kg",
    "description": "스트레스가 쌓이면 두통이 심해진다. 강력한 염동력으로 주위를 압도한다."
  },
  {
    "id": 55,
    "name": "골덕",
    "enName": "Golduck",
    "types": [
      "물"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/55.png",
    "bgColor": "#f0f9ff",
    "category": "오리포켓몬",
    "height": "1.7 m",
    "weight": "76.6 kg",
    "description": "강을 더럽힌 사람을 물속으로 끌어들여 데려간다는 옛날이야기가 전해져 오고 있다."
  },
  {
    "id": 58,
    "name": "가디",
    "enName": "Growlithe",
    "types": [
      "불꽃"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/58.png",
    "bgColor": "#fff1f2",
    "category": "강아지포켓몬",
    "height": "0.7 m",
    "weight": "19.0 kg",
    "description": "충직한 성격으로 자신의 트레이너를 지키기 위해 필사적으로 상대방에게 짖어댄다."
  },
  {
    "id": 59,
    "name": "윈디",
    "enName": "Arcanine",
    "types": [
      "불꽃"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/59.png",
    "bgColor": "#fff1f2",
    "category": "전설포켓몬",
    "height": "1.9 m",
    "weight": "155.0 kg",
    "description": "옛날부터 많은 사람의 마음을 사로잡은 아름다운 포켓몬이다. 마치 나는 것처럼 경쾌하게 달린다."
  },
  {
    "id": 63,
    "name": "캐이시",
    "enName": "Abra",
    "types": [
      "에스퍼"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/63.png",
    "bgColor": "#fdf2f8",
    "category": "초능력포켓몬",
    "height": "0.9 m",
    "weight": "19.5 kg",
    "description": "잠이 든 상태에서 순간이동이 가능하다. 깊이 잠들수록 먼 곳으로 이동한다고 한다."
  },
  {
    "id": 64,
    "name": "윤겔라",
    "enName": "Kadabra",
    "types": [
      "에스퍼"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/64.png",
    "bgColor": "#fdf2f8",
    "category": "초능력포켓몬",
    "height": "1.3 m",
    "weight": "56.5 kg",
    "description": "염동력의 위력은 절대적이다. 진화에 대비하여 이마에 있는 별에 사이코 파워를 비축하고 있다."
  },
  {
    "id": 65,
    "name": "후딘",
    "enName": "Alakazam",
    "types": [
      "에스퍼"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/65.png",
    "bgColor": "#fdf2f8",
    "category": "초능력포켓몬",
    "height": "1.5 m",
    "weight": "48.0 kg",
    "description": "강력한 초능력을 구사한다. 양손에 든 숟가락은 그 힘으로 만들어낸 것이라고 한다."
  },
  {
    "id": 92,
    "name": "고오스",
    "enName": "Gastly",
    "types": [
      "고스트",
      "독"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/92.png",
    "bgColor": "#f5f3ff",
    "category": "가스포켓몬",
    "height": "1.3 m",
    "weight": "0.1 kg",
    "description": "몸은 옅은 가스로 되어 있어 어디든지 숨어들어 가지만 바람이 불면 날아가 버린다."
  },
  {
    "id": 93,
    "name": "고우스트",
    "enName": "Haunter",
    "types": [
      "고스트",
      "독"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/93.png",
    "bgColor": "#f5f3ff",
    "category": "가스포켓몬",
    "height": "1.6 m",
    "weight": "0.1 kg",
    "description": "어둠 속에서 아무도 없는데도 누군가가 보고 있다는 느낌이 들면 그곳에 고우스트가 있는 것이다."
  },
  {
    "id": 94,
    "name": "팬텀",
    "enName": "Gengar",
    "types": [
      "고스트",
      "독"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png",
    "bgColor": "#f5f3ff",
    "category": "그림자포켓몬",
    "height": "1.5 m",
    "weight": "40.5 kg",
    "description": "산에서 조난하면 목숨을 빼앗기 위해 어둠 속에서 나타난다고 한다."
  },
  {
    "id": 129,
    "name": "잉어킹",
    "enName": "Magikarp",
    "types": [
      "물"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/129.png",
    "bgColor": "#f0f9ff",
    "category": "물고기포켓몬",
    "height": "0.9 m",
    "weight": "10.0 kg",
    "description": "유속이 빠른 곳에서는 그저 떠내려갈 뿐인 약하고 한심한 포켓몬이다."
  },
  {
    "id": 130,
    "name": "갸라도스",
    "enName": "Gyarados",
    "types": [
      "물",
      "비행"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/130.png",
    "bgColor": "#f0f9ff",
    "category": "흉악포켓몬",
    "height": "6.5 m",
    "weight": "235.0 kg",
    "description": "한번 난동부리기 시작한 갸라도스는 태풍이 사납게 휘몰아쳐도 모든 것을 다 태워버린다."
  },
  {
    "id": 131,
    "name": "라프라스",
    "enName": "Lapras",
    "types": [
      "물",
      "얼음"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/131.png",
    "bgColor": "#f0f9ff",
    "category": "탈것포켓몬",
    "height": "2.5 m",
    "weight": "220.0 kg",
    "description": "추위에 강해서 얼음 바다에서도 끄떡없다. 피부는 매끈매끈하고 조금 차갑다."
  },
  {
    "id": 132,
    "name": "메타몽",
    "enName": "Ditto",
    "types": [
      "노말"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png",
    "bgColor": "#fafaf9",
    "category": "변신포켓몬",
    "height": "0.3 m",
    "weight": "4.0 kg",
    "description": "메타몽끼리 만나게 되면 상대와 똑같은 모습이 되기 위해 평소보다 격렬하게 움직인다."
  },
  {
    "id": 133,
    "name": "이브이",
    "enName": "Eevee",
    "types": [
      "노말"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png",
    "bgColor": "#fafaf9",
    "category": "진화포켓몬",
    "height": "0.3 m",
    "weight": "6.5 kg",
    "description": "불안정한 유전자 덕분에 여러 가지 진화의 가능성을 가지고 있는 특수한 포켓몬."
  },
  {
    "id": 134,
    "name": "샤미드",
    "enName": "Vaporeon",
    "types": [
      "물"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/134.png",
    "bgColor": "#f0f9ff",
    "category": "거품뿜기포켓몬",
    "height": "1.0 m",
    "weight": "29.0 kg",
    "description": "몸의 세포 구조가 물 분자와 닮았다. 물에 녹으면 보이지 않는다."
  },
  {
    "id": 135,
    "name": "쥬피썬더",
    "enName": "Jolteon",
    "types": [
      "전기"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/135.png",
    "bgColor": "#fefce8",
    "category": "번개포켓몬",
    "height": "0.8 m",
    "weight": "24.5 kg",
    "description": "공기 중의 마이너스 이온을 빨아들여 약 10000볼트의 전기를 내뱉을 수 있다."
  },
  {
    "id": 136,
    "name": "부스터",
    "enName": "Flareon",
    "types": [
      "불꽃"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/136.png",
    "bgColor": "#fff1f2",
    "category": "불꽃포켓몬",
    "height": "0.9 m",
    "weight": "25.0 kg",
    "description": "들이마신 공기 중 일부는 체내의 불꽃 주머니로 보내져 1700도의 불꽃이 된다."
  },
  {
    "id": 143,
    "name": "잠만보",
    "enName": "Snorlax",
    "types": [
      "노말"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png",
    "bgColor": "#fafaf9",
    "category": "졸음포켓몬",
    "height": "2.1 m",
    "weight": "460.0 kg",
    "description": "위장이 튼튼해서 곰팡이가 피거나 썩은 것을 먹어도 배탈이 나지 않는다."
  },
  {
    "id": 144,
    "name": "프리져",
    "enName": "Articuno",
    "types": [
      "얼음",
      "비행"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/144.png",
    "bgColor": "#ecfeff",
    "category": "냉동포켓몬",
    "height": "1.7 m",
    "weight": "55.4 kg",
    "description": "얼음을 자유자재로 조종하는 힘을 가졌다. 영구 동토의 설산에 살고 있다고 한다."
  },
  {
    "id": 145,
    "name": "썬더",
    "enName": "Zapdos",
    "types": [
      "전기",
      "비행"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/145.png",
    "bgColor": "#fefce8",
    "category": "전기포켓몬",
    "height": "1.6 m",
    "weight": "52.6 kg",
    "description": "날개를 비비대면 바로 천둥이 친다고 전해지는 전설의 새포켓몬이다."
  },
  {
    "id": 146,
    "name": "파이어",
    "enName": "Moltres",
    "types": [
      "불꽃",
      "비행"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/146.png",
    "bgColor": "#fff1f2",
    "category": "화염포켓몬",
    "height": "2.0 m",
    "weight": "60.0 kg",
    "description": "아름답게 타오르는 날개로 산길을 비춰 조난자를 도왔다고 전해져 오고 있다."
  },
  {
    "id": 147,
    "name": "미뇽",
    "enName": "Dratini",
    "types": [
      "드래곤"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/147.png",
    "bgColor": "#eef2ff",
    "category": "드래곤포켓몬",
    "height": "1.8 m",
    "weight": "3.3 kg",
    "description": "오랫동안 환상이라고 불렸다. 이마에 있는 작은 돌기는 성장하고 있는 뿔이다."
  },
  {
    "id": 148,
    "name": "신뇽",
    "enName": "Dragonair",
    "types": [
      "드래곤"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/148.png",
    "bgColor": "#eef2ff",
    "category": "드래곤포켓몬",
    "height": "4.0 m",
    "weight": "16.5 kg",
    "description": "꼬리의 구슬에 힘을 모아 날씨를 조종한다. 오라에 둘러싸인 모습은 신비롭다."
  },
  {
    "id": 149,
    "name": "망나뇽",
    "enName": "Dragonite",
    "types": [
      "드래곤",
      "비행"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png",
    "bgColor": "#eef2ff",
    "category": "드래곤포켓몬",
    "height": "2.2 m",
    "weight": "210.0 kg",
    "description": "바다의 화신이라고 불린다. 망나뇽 형태의 조각상을 뱃머리에 두는 배도 많다."
  },
  {
    "id": 150,
    "name": "뮤츠",
    "enName": "Mewtwo",
    "types": [
      "에스퍼"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png",
    "bgColor": "#fdf2f8",
    "category": "유전포켓몬",
    "height": "2.0 m",
    "weight": "122.0 kg",
    "description": "뮤의 유전자와 거의 같다. 하지만 크기도 성격도 무서울 정도로 다르다."
  },
  {
    "id": 151,
    "name": "뮤",
    "enName": "Mew",
    "types": [
      "에스퍼"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png",
    "bgColor": "#fdf2f8",
    "category": "신종포켓몬",
    "height": "0.4 m",
    "weight": "4.0 kg",
    "description": "현미경으로 관찰하면 매우 짧고 가는 털이 촘촘하게 나 있다."
  },
  {
    "id": 152,
    "name": "치코리타",
    "enName": "Chikorita",
    "types": [
      "풀"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/152.png",
    "bgColor": "#f0fdf4",
    "category": "잎사귀포켓몬",
    "height": "0.9 m",
    "weight": "6.4 kg",
    "description": "잎사귀를 휘둘러 상대를 위협하지만 잎사귀에서 달콤한 향기가 풍겨 나와 서로 온화한 분위기가 된다."
  },
  {
    "id": 153,
    "name": "베이리프",
    "enName": "Bayleef",
    "types": [
      "풀"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/153.png",
    "bgColor": "#f0fdf4",
    "category": "잎사귀포켓몬",
    "height": "1.2 m",
    "weight": "15.8 kg",
    "description": "목 주변의 둥그렇게 말린 잎사귀 안에는 작은 새싹 한 개가 나 있다. 그 향기는 사람을 기운 나게 한다."
  },
  {
    "id": 154,
    "name": "메가니움",
    "enName": "Meganium",
    "types": [
      "풀"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/154.png",
    "bgColor": "#f0fdf4",
    "category": "허브포켓몬",
    "height": "1.8 m",
    "weight": "100.5 kg",
    "description": "꽃의 향기는 기분을 평안하게 만든다. 싸울 때는 향기를 발산하여 상대의 전의를 떨어뜨린다."
  },
  {
    "id": 155,
    "name": "브케인",
    "enName": "Cyndaquil",
    "types": [
      "불꽃"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/155.png",
    "bgColor": "#fff1f2",
    "category": "불쥐포켓몬",
    "height": "0.5 m",
    "weight": "7.9 kg",
    "description": "등에서 불꽃을 내뿜어 몸을 지킨다. 화났을 때의 불꽃은 기운차지만 지쳤을 때는 불완전연소한다."
  },
  {
    "id": 156,
    "name": "마그케인",
    "enName": "Quilava",
    "types": [
      "불꽃"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/156.png",
    "bgColor": "#fff1f2",
    "category": "화산포켓몬",
    "height": "0.9 m",
    "weight": "19.0 kg",
    "description": "불꽃의 기세와 열풍으로 위협한다. 재빠른 몸동작으로 상대의 공격을 피하면서 동시에 불꽃으로 태운다."
  },
  {
    "id": 157,
    "name": "블레이범",
    "enName": "Typhlosion",
    "types": [
      "불꽃"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/157.png",
    "bgColor": "#fff1f2",
    "category": "화산포켓몬",
    "height": "1.7 m",
    "weight": "79.5 kg",
    "description": "작열하는 불꽃으로 주변에 아지랑이를 만들어내서 모습을 숨길 수 있다. 불타오르며 폭발하는 바람은 모든 것을 태운다."
  },
  {
    "id": 158,
    "name": "리아코",
    "enName": "Totodile",
    "types": [
      "물"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/158.png",
    "bgColor": "#f0f9ff",
    "category": "큰턱포켓몬",
    "height": "0.6 m",
    "weight": "9.5 kg",
    "description": "몸은 작지만 턱의 힘은 강하다. 리아코 나름은 살포시 물려고 하지만 큰 상처를 입힐 정도의 힘이 있다."
  },
  {
    "id": 159,
    "name": "엘리게이",
    "enName": "Croconaw",
    "types": [
      "물"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/159.png",
    "bgColor": "#f0f9ff",
    "category": "큰턱포켓몬",
    "height": "1.1 m",
    "weight": "25.0 kg",
    "description": "한 번 물고 늘어지면 절대로 놓지 않는다. 이빨 끝이 낚싯바늘처럼 휘어져 있어서 한 번 들어가면 빠지지 않는다."
  },
  {
    "id": 160,
    "name": "장크로다일",
    "enName": "Feraligatr",
    "types": [
      "물"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/160.png",
    "bgColor": "#f0f9ff",
    "category": "큰턱포켓몬",
    "height": "2.3 m",
    "weight": "88.8 kg",
    "description": "큰 입을 열고 상대를 위협한다. 강인한 뒷다리로 땅을 차고 굉장한 스피드로 돌진해온다."
  },
  {
    "id": 175,
    "name": "토게피",
    "enName": "Togepi",
    "types": [
      "페어리"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/175.png",
    "bgColor": "#fdf4ff",
    "category": "바늘알포켓몬",
    "height": "0.3 m",
    "weight": "1.5 kg",
    "description": "행운의 상징이다. 껍질 안에는 행복이 가득 담겨 있다고 한다."
  },
  {
    "id": 249,
    "name": "루기아",
    "enName": "Lugia",
    "types": [
      "에스퍼",
      "비행"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/249.png",
    "bgColor": "#fdf2f8",
    "category": "잠수포켓몬",
    "height": "5.2 m",
    "weight": "216.0 kg",
    "description": "가벼운 날갯짓만으로도 민가를 날려버릴 만한 파괴력을 지니고 있어서 해저에서 사람들 몰래 살게 됐다."
  },
  {
    "id": 250,
    "name": "칠색조",
    "enName": "Ho-Oh",
    "types": [
      "불꽃",
      "비행"
    ],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/250.png",
    "bgColor": "#fff1f2",
    "category": "무지개색포켓몬",
    "height": "3.8 m",
    "weight": "199.0 kg",
    "description": "빛이 닿는 각도에 따라 일곱 빛깔로 반짝이는 깃털은 행복을 가져다준다고 한다. 무지개 끝에 산다고 전해진다."
  }
];
