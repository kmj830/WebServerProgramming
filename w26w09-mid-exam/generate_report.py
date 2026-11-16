import os
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), fill_hex)
    tcPr.append(shd)

def create_report():
    doc = Document()

    # Page Margins
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Title
    title_p = doc.add_paragraph()
    title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_title = title_p.add_run("웹서버프로그래밍 중간고사 풀이 보고서")
    run_title.font.name = "Malgun Gothic"
    run_title.font.size = Pt(22)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(46, 26, 71)

    # Subtitle
    sub_p = doc.add_paragraph()
    sub_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_sub = sub_p.add_run("Homework #1 - 예제 변경: 종강 후 떠나고 싶은 국내외 힐링 여행지 위시리스트")
    run_sub.font.name = "Malgun Gothic"
    run_sub.font.size = Pt(13)
    run_sub.font.color.rgb = RGBColor(100, 100, 100)

    # Info Box
    info_table = doc.add_table(rows=4, cols=2)
    info_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    info_data = [
        ("교과목명", "웹서버프로그래밍-02 (담당교수: 오병우)"),
        ("학번 / 성명", "20230176 / 김민중"),
        ("제출일자", "2026년 11월 6일"),
        ("사용 기술 스택", "React Router v7, Supabase (RLS), Zustand, TanStack Query, Tailwind CSS")
    ]
    for i, (k, v) in enumerate(info_data):
        row = info_table.rows[i]
        c0 = row.cells[0]
        c1 = row.cells[1]
        c0.width = Inches(1.8)
        c1.width = Inches(4.7)
        c0.paragraphs[0].text = k
        c0.paragraphs[0].runs[0].font.bold = True
        c0.paragraphs[0].runs[0].font.name = "Malgun Gothic"
        c0.paragraphs[0].runs[0].font.size = Pt(10)
        c1.paragraphs[0].text = v
        c1.paragraphs[0].runs[0].font.name = "Malgun Gothic"
        c1.paragraphs[0].runs[0].font.size = Pt(10)
        set_cell_background(c0, "F3F4F6")

    doc.add_paragraph()

    # Section 1
    h1 = doc.add_heading(level=1)
    r1 = h1.add_run("1. 중간고사 문제 빈칸 20개 정답 및 기술 분석")
    r1.font.name = "Malgun Gothic"
    r1.font.bold = True

    p_intro = doc.add_paragraph()
    r = p_intro.add_run("중간고사 시험 문제에 출제된 빈칸 (1)번부터 (20)번까지의 정답과 각 항목의 역할 및 라이브러리 스펙은 다음과 같습니다.")
    r.font.name = "Malgun Gothic"

    answers = [
        ("1", "layout", "app/routes.ts", "@react-router/dev/routes의 중첩 레이아웃 라우트 정의 함수"),
        ("2", "getState()", "app/routes/header.tsx", "React 컴포넌트 외부(clientLoader)에서 Zustand 스토어 상태에 직접 접근"),
        ("3", "signIn", "app/routes/header.tsx", "useAuthStore에 정의된 이메일/비밀번호 비동기 로그인 액션 함수 호출"),
        ("4", "useAuthStore", "app/routes/header.tsx, list.tsx", "Zustand 커스텀 훅으로 현재 로그인한 user 상태를 컴포넌트에서 구독"),
        ("5", "AuthState", "app/lib/auth-store.ts", "Zustand 스토어의 상태와 액션을 정의하는 TypeScript 인터페이스 명칭"),
        ("6", "create", "app/lib/auth-store.ts", "Zustand 라이브러리의 스토어 생성 함수 (create<AuthState>)"),
        ("7", "meta.env", "app/lib/supabase.ts", "Vite 번들러의 클라이언트 환경 변수 접근 문법 (import.meta.env.VITE_...)"),
        ("8", "myList", "app/routes/list.tsx", "useQuery의 data 프로퍼티를 템플릿에서 참조하기 위해 지정한 별칭(alias)"),
        ("9", "useQuery", "app/routes/list.tsx", "TanStack Query의 서버 데이터 비동기 조회 및 캐싱 훅"),
        ("10", "'escape-to-do'", "app/routes/list.tsx", "TanStack Query 캐시 관리용 키 (본 과제에서는 'travel-wishlist'로 변경)"),
        ("11", "queryFn", "app/routes/list.tsx", "useQuery에서 서버로부터 데이터를 비동기로 패치해오는 함수 프로퍼티"),
        ("12", "plans", "app/routes/list.tsx", "Supabase 데이터베이스 테이블명 (본 과제에서는 travel_plans로 변경)"),
        ("13", "staleTime", "app/routes/list.tsx", "TanStack Query에서 캐시 데이터가 신선하다고 간주되는 시간(밀리초) 옵션"),
        ("14", "useMutation", "app/routes/list.tsx", "TanStack Query의 데이터 추가/수정/삭제 등 CUD 비동기 처리 훅"),
        ("15", "mutationFn", "app/routes/list.tsx", "useMutation에서 실제 비동기 데이터 쓰기 작업을 수행하는 함수 프로퍼티"),
        ("16", "invalidateQueries", "app/routes/list.tsx", "데이터 추가 성공 후 캐시를 무효화하여 최신 목록으로 자동 갱신(refetch)"),
        ("17", "preventDefault", "app/routes/list.tsx", "HTML Form 제출 시 브라우저가 새로고침되는 기본 동작을 방지하는 이벤트 메서드"),
        ("18", "mutate", "app/routes/list.tsx", "useMutation이 반환한 객체에서 비동기 작업을 트리거하는 실행 메서드"),
        ("19", "map", "app/routes/list.tsx", "조회된 배열의 각 원소를 순회하며 JSX 요소로 매핑하는 JavaScript 배열 메서드"),
        ("20", "QueryClientProvider", "app/root.tsx", "TanStack Query Context를 하위 React 컴포넌트 트리에 공급하는 최상위 프로바이더")
    ]

    ans_table = doc.add_table(rows=len(answers)+1, cols=4)
    ans_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers = ["번호", "빈칸 정답", "대상 파일", "역할 및 기술 설명"]
    for j, h in enumerate(headers):
        cell = ans_table.rows[0].cells[j]
        cell.paragraphs[0].text = h
        cell.paragraphs[0].runs[0].font.bold = True
        cell.paragraphs[0].runs[0].font.name = "Malgun Gothic"
        cell.paragraphs[0].runs[0].font.size = Pt(9.5)
        set_cell_background(cell, "EDE9FE")

    for i, (num, ans, file_name, desc) in enumerate(answers):
        row = ans_table.rows[i+1]
        col_data = [num, ans, file_name, desc]
        widths = [Inches(0.6), Inches(1.5), Inches(1.8), Inches(2.8)]
        for j, text in enumerate(col_data):
            cell = row.cells[j]
            cell.width = widths[j]
            p = cell.paragraphs[0]
            p.text = text
            p.runs[0].font.name = "Malgun Gothic"
            p.runs[0].font.size = Pt(8.5)
            if j == 1:
                p.runs[0].font.bold = True
                p.runs[0].font.color.rgb = RGBColor(91, 33, 182)

    doc.add_page_break()

    # Section 2
    h2 = doc.add_heading(level=1)
    r2 = h2.add_run("2. 예제 변경 및 데이터베이스 (Supabase RLS) 설계")
    r2.font.name = "Malgun Gothic"
    r2.font.bold = True

    p2 = doc.add_paragraph()
    r = p2.add_run("과제 지침(예제는 변경할 것!)에 따라 기존 '시험 끝나고 하고 싶은 일(plans)' 예제를 '종강 후 떠나고 싶은 국내외 힐링 여행지 위시리스트(travel_plans)'로 변경하여 구현하였습니다.\nSupabase PostgreSQL에 RLS(Row Level Security)를 적용하여 사용자가 자신이 등록한 여행지만 조회, 추가, 수정, 삭제할 수 있도록 엄격한 보안 정책을 구축하였습니다.")
    r.font.name = "Malgun Gothic"

    doc.add_heading(level=2, text="2.1 Supabase Schema 및 RLS 정책 SQL")
    sql_text = """-- 1. 여행 위시리스트 테이블 생성
CREATE TABLE public.travel_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID DEFAULT auth.uid() NOT NULL,
    title TEXT NOT NULL,

    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 2. RLS(Row Level Security) 활성화
ALTER TABLE public.travel_plans ENABLE ROW LEVEL SECURITY;

-- 3. RLS 정책 설정 (CRUD 보안)
-- (1) 조회: 인증된 사용자는 자신의 여행 계획만 조회(SELECT) 가능
CREATE POLICY "사용자는 자신의 여행 계획만 조회할 수 있다."
ON public.travel_plans FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- (2) 추가: 인증된 사용자는 자신의 user_id로 새로운 여행지를 등록(INSERT) 가능
CREATE POLICY "사용자는 새로운 여행 계획을 등록할 수 있다."
ON public.travel_plans FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- (3) 삭제: 인증된 사용자는 자신의 여행 계획만 삭제(DELETE) 가능
CREATE POLICY "사용자는 자신의 여행 계획만 삭제할 수 있다."
ON public.travel_plans FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- (4) 수정: 인증된 사용자는 자신의 여행 계획만 수정(UPDATE) 가능
CREATE POLICY "사용자는 자신의 여행 계획만 수정할 수 있다."
ON public.travel_plans FOR UPDATE TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);"""
    
    p_sql = doc.add_paragraph()
    r_sql = p_sql.add_run(sql_text)
    r_sql.font.name = "Consolas"
    r_sql.font.size = Pt(8.5)

    doc.add_heading(level=1, text="3. 주요 구현 소스 코드 전문")

    code_files = [
        ("3.1 app/routes.ts (React Router v7 레이아웃 라우트)", "app/routes.ts"),
        ("3.2 app/lib/supabase.ts (Supabase 클라이언트 초기화)", "app/lib/supabase.ts"),
        ("3.3 app/lib/auth-store.ts (Zustand 전역 인증 스토어)", "app/lib/auth-store.ts"),
        ("3.4 app/root.tsx (TanStack Query Provider 적용)", "app/root.tsx"),
        ("3.5 app/routes/header.tsx (사용자 계정 표시 레이아웃 헤더)", "app/routes/header.tsx"),
        ("3.6 app/routes/list.tsx (useQuery / useMutation 여행지 위시리스트 컴포넌트)", "app/routes/list.tsx"),
    ]

    for title, filepath in code_files:
        doc.add_heading(level=2, text=title)
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                code_content = f.read()
        else:
            code_content = f"// File not found: {filepath}"
        
        p_c = doc.add_paragraph()
        r_c = p_c.add_run(code_content)
        r_c.font.name = "Consolas"
        r_c.font.size = Pt(8.5)

    doc.add_page_break()

    # Section 4
    h4 = doc.add_heading(level=1)
    r4 = h4.add_run("4. 실제 실행 결과 및 모든 케이스별 캡처 화면")
    r4.font.name = "Malgun Gothic"
    r4.font.bold = True

    p4_intro = doc.add_paragraph()
    r4_intro = p4_intro.add_run("과제 요구사항에 명시된 대로 실제 로컬 개발 서버를 구동하여 브라우저에서 모든 케이스별(초기 목록 조회, 텍스트 입력 상태, 항목 추가 완료 후 갱신, 빈 목록 Empty State)로 캡처한 화면과 상세 설명입니다.")
    r4_intro.font.name = "Malgun Gothic"

    cases = [
        ("케이스 1: 초기 여행지 위시리스트 조회 및 로그인 계정 표시 화면",
         "screenshots/case1_initial_list.png",
         "헤더에 Zustand 전역 상태에서 관리하는 로그인 계정(gdhong@test.com)이 정상적으로 바인딩되어 있으며, TanStack Query의 useQuery를 통해 서버에서 가져온 4곳의 여행지 위시리스트가 깔끔하게 렌더링된 화면입니다."),
        
        ("케이스 2: 새로운 여행지 등록 폼 입력 상태 화면",
         "screenshots/case2_typing_input.png",
         "상단 입력 폼('가고 싶은 여행지 (*)')에 새로운 여행지 항목('오사카 유니버셜 스튜디오 & 도톤보리 맛집 탐방')을 타이핑하고 있는 상태 화면입니다. useState를 통해 실시간 양방향 바인딩이 이루어집니다."),
        
        ("케이스 3: 신규 여행지 등록 완료 및 캐시 무효화(invalidateQueries) 자동 갱신 화면",
         "screenshots/case3_item_added.png",
         "[추가] 버튼 클릭 시 e.preventDefault()가 폼의 기본 새로고침을 방지하고 mutate.mutate()가 실행되어 Supabase DB에 저장됩니다. mutation 성공 후 queryClient.invalidateQueries가 호출되어 목록 상단에 '오사카 유니버셜 스튜디오...'가 즉시 추가되고 총 개수가 5곳으로 자동 갱신되었습니다."),
        
        ("케이스 4: 등록된 여행지가 없는 경우의 빈 목록(Empty State) 안내 화면",
         "screenshots/case4_empty_list.png",
         "myList.length === 0일 때 '가고 싶은 여행지가 없습니다. 새로운 여행지를 등록해 보세요!'라는 직관적인 빈 목록 안내 메시지가 화면에 출력되어 사용자 편의성을 높인 케이스입니다.")
    ]

    for title, img_path, desc in cases:
        doc.add_heading(level=2, text=title)
        p_desc = doc.add_paragraph()
        r_desc = p_desc.add_run(desc)
        r_desc.font.name = "Malgun Gothic"
        r_desc.font.size = Pt(9.5)
        r_desc.font.color.rgb = RGBColor(60, 60, 60)

        if os.path.exists(img_path):
            doc.add_picture(img_path, width=Inches(6.2))
            doc.add_paragraph()
        else:
            doc.add_paragraph(f"[Image not found: {img_path}]")

    output_filename = "HW1_중간고사풀이_20230176_김민중.docx"
    doc.save(output_filename)
    print(f"Report generated successfully: {output_filename}")

if __name__ == "__main__":
    create_report()
