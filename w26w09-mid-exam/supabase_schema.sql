-- ========================================================
-- 중간고사 문제 풀이 (예제 변경: ✈️ 종강 여행 위시리스트)
-- Supabase Table 및 RLS (Row Level Security) 설정 SQL
-- ========================================================

-- 1. 여행 위시리스트 테이블 생성 (기존 plans -> travel_plans 변경)
CREATE TABLE public.travel_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID DEFAULT auth.uid() NOT NULL,
    title TEXT NOT NULL,

    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 2. RLS(Row Level Security, 행 단위 보안) 활성화
ALTER TABLE public.travel_plans ENABLE ROW LEVEL SECURITY;

-- 3. RLS 정책 설정

-- (1) 조회 정책: 인증된 사용자는 자신이 등록한 여행지만 조회(SELECT) 가능
CREATE POLICY "사용자는 자신의 여행 계획만 조회할 수 있다."
ON public.travel_plans
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- (2) 추가 정책: 인증된 사용자는 자신의 user_id를 담아서 새로운 여행지를 등록(INSERT) 가능
CREATE POLICY "사용자는 새로운 여행 계획을 등록할 수 있다."
ON public.travel_plans
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- (3) 삭제 정책: 인증된 사용자는 자신이 등록한 여행지만 삭제(DELETE) 가능
CREATE POLICY "사용자는 자신의 여행 계획만 삭제할 수 있다."
ON public.travel_plans
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- (4) 수정 정책: 인증된 사용자는 자신이 등록한 여행지만 수정(UPDATE) 가능
CREATE POLICY "사용자는 자신의 여행 계획만 수정할 수 있다."
ON public.travel_plans
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. 초기 샘플 데이터 삽입 예시 (user_id는 auth.users 테이블의 실제 생성된 UUID 입력)
-- INSERT INTO public.travel_plans (user_id, title) VALUES
-- ('[본인의 user_id]', '겨울 홋카이도 삿포로 눈꽃 축제 & 료칸 온천'),
-- ('[본인의 user_id]', '제주도 올레길 트레킹 & 해녀의 집 해물라면 먹기'),
-- ('[본인의 user_id]', '부산 광안리 드론쇼 & 해운대 포장마차 거리'),
-- ('[본인의 user_id]', '스위스 인터라켄 패러글라이딩 도전하기');
