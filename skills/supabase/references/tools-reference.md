# Supabase MCP 도구 전체 레퍼런스

## 조직 (Organization)

### `mcp__supabase__list_organizations`
현재 계정이 속한 모든 조직 목록을 반환한다.
- 파라미터: 없음

### `mcp__supabase__get_organization`
특정 조직의 상세 정보를 반환한다.
- `id` (필수): 조직 ID

---

## 프로젝트 (Project)

### `mcp__supabase__list_projects`
접근 가능한 모든 Supabase 프로젝트 목록을 반환한다.
- 파라미터: 없음

### `mcp__supabase__get_project`
특정 프로젝트의 상세 정보(지역, 상태, 플랜 등)를 반환한다.
- `id` (필수): 프로젝트 ID

### `mcp__supabase__create_project`
새 Supabase 프로젝트를 생성한다. 비용 발생 작업.
- `name` (필수): 프로젝트 이름
- `organization_id` (필수): 조직 ID
- `region` (선택): 배포 지역 (예: `ap-northeast-2`)
- `db_pass` (필수): DB 비밀번호

### `mcp__supabase__pause_project`
프로젝트를 일시 정지한다 (무료 플랜 비활성화 등).
- `project_id` (필수): 프로젝트 ID

### `mcp__supabase__restore_project`
일시 정지된 프로젝트를 복원한다.
- `project_id` (필수): 프로젝트 ID

### `mcp__supabase__get_project_url`
프로젝트의 API URL을 반환한다 (클라이언트 연동에 사용).
- `project_id` (필수): 프로젝트 ID

### `mcp__supabase__get_publishable_keys`
프로젝트의 공개 API 키(anon key 등)를 반환한다.
- `project_id` (필수): 프로젝트 ID

---

## 데이터베이스 (Database)

### `mcp__supabase__list_tables`
지정한 스키마의 테이블 목록을 반환한다. 스키마 변경 전 반드시 호출한다.
- `project_id` (필수): 프로젝트 ID
- `schemas` (선택): 스키마 목록 (기본값: `["public"]`)

### `mcp__supabase__execute_sql`
임의의 SQL을 실행하고 결과를 반환한다.
- `project_id` (필수): 프로젝트 ID
- `query` (필수): 실행할 SQL 쿼리

### `mcp__supabase__list_migrations`
적용된 마이그레이션 목록과 적용 시각을 반환한다.
- `project_id` (필수): 프로젝트 ID

### `mcp__supabase__apply_migration`
새 마이그레이션 SQL을 프로젝트에 적용한다. 되돌리기 어려우므로 확인 필수.
- `project_id` (필수): 프로젝트 ID
- `name` (필수): 마이그레이션 이름 (예: `add_users_table`)
- `query` (필수): 마이그레이션 SQL

### `mcp__supabase__list_extensions`
프로젝트에 설치된 PostgreSQL 확장 기능 목록을 반환한다.
- `project_id` (필수): 프로젝트 ID

### `mcp__supabase__generate_typescript_types`
프로젝트 스키마 기반으로 TypeScript 타입 정의를 생성한다.
- `project_id` (필수): 프로젝트 ID

---

## Edge Functions

### `mcp__supabase__list_edge_functions`
프로젝트의 모든 Edge Function 목록을 반환한다.
- `project_id` (필수): 프로젝트 ID

### `mcp__supabase__get_edge_function`
특정 Edge Function의 상세 정보를 반환한다.
- `project_id` (필수): 프로젝트 ID
- `function_slug` (필수): Function 슬러그(이름)

### `mcp__supabase__deploy_edge_function`
Edge Function을 배포하거나 업데이트한다.
- `project_id` (필수): 프로젝트 ID
- `name` (필수): Function 이름
- `entrypoint_path` (필수): 진입점 파일 경로
- `import_map_path` (선택): import map 경로

---

## 브랜치 (Branch)

### `mcp__supabase__list_branches`
프로젝트의 모든 개발 브랜치를 반환한다.
- `project_id` (필수): 프로젝트 ID

### `mcp__supabase__create_branch`
새 개발 브랜치를 생성한다. 비용 발생 가능.
- `project_id` (필수): 프로젝트 ID
- `branch_name` (필수): 브랜치 이름

### `mcp__supabase__delete_branch`
개발 브랜치를 삭제한다. 되돌릴 수 없음.
- `branch_id` (필수): 브랜치 ID

### `mcp__supabase__merge_branch`
개발 브랜치의 마이그레이션을 main 프로젝트에 병합한다.
- `branch_id` (필수): 브랜치 ID

### `mcp__supabase__rebase_branch`
개발 브랜치를 main 프로젝트의 최신 마이그레이션 기준으로 리베이스한다.
- `branch_id` (필수): 브랜치 ID

### `mcp__supabase__reset_branch`
개발 브랜치의 마이그레이션을 초기화한다. 데이터 손실 가능.
- `branch_id` (필수): 브랜치 ID
- `migration_version` (선택): 특정 버전으로 리셋

---

## 모니터링 & 진단

### `mcp__supabase__get_logs`
프로젝트의 서비스 로그를 조회한다. 문제 진단 첫 단계.
- `project_id` (필수): 프로젝트 ID
- `service` (필수): 서비스 종류 (`api`, `postgres`, `edge-runtime`, `auth`, `storage`, `realtime`)

### `mcp__supabase__get_advisors`
프로젝트의 보안 및 성능 권고사항을 반환한다.
- `project_id` (필수): 프로젝트 ID
- `type` (선택): `security` 또는 `performance`

### `mcp__supabase__get_cost`
특정 작업의 예상 비용을 조회한다.
- `organization_id` (필수): 조직 ID
- `type` (필수): 비용 유형 (`project`, `branch` 등)

### `mcp__supabase__confirm_cost`
비용 발생 작업에 대해 사용자 확인을 처리한다.
- `organization_id` (필수): 조직 ID
- `type` (필수): 비용 유형
- `recurrence` (필수): 과금 주기 (`monthly` 등)
- `amount` (필수): 금액

---

## 문서 검색

### `mcp__supabase__search_docs`
Supabase 공식 문서에서 키워드로 검색한다.
- `query` (필수): 검색어
