---
name: supabase
description: |
  Supabase MCP 도구를 사용해 프로젝트 관리, DB 쿼리/마이그레이션, Edge Function 배포,
  브랜치 관리, 비용 확인 등 Supabase의 모든 작업을 처리하는 스킬.
  사용자가 "Supabase", "DB 테이블 조회", "마이그레이션 적용", "Edge Function 배포",
  "프로젝트 생성", "SQL 실행", "타입 생성", "로그 확인", "브랜치 만들어줘" 등
  Supabase 관련 작업을 요청하면 반드시 이 스킬을 사용하세요.
  mcp__supabase__ 접두어가 붙은 모든 MCP 도구를 적극 활용하세요.
compatibility:
  tools:
    - mcp__supabase__*
---

# Supabase MCP 스킬

Supabase MCP 도구(`mcp__supabase__*`)를 사용해 Supabase 플랫폼의 모든 기능을 Claude Code에서 직접 실행한다.

## 핵심 원칙

- 작업 전 **무엇을 할지** 한 줄로 설명한 뒤 실행한다.
- 파괴적 작업(프로젝트 삭제, 브랜치 리셋, 마이그레이션 적용 등)은 실행 전 사용자 확인을 받는다.
- 비용이 발생하는 작업은 `mcp__supabase__get_cost` → `mcp__supabase__confirm_cost` 순서로 진행한다.
- 스키마 변경 전 `mcp__supabase__list_tables`로 현황을 파악한다.
- 문제 발생 시 `mcp__supabase__get_logs` → `mcp__supabase__get_advisors` 순서로 진단한다.

---

## 도구 분류 및 사용법

전체 도구 상세 설명은 `references/tools-reference.md`를 참고한다.

### 조직 & 프로젝트

| 작업 | 도구 |
|------|------|
| 조직 목록 조회 | `mcp__supabase__list_organizations` |
| 조직 정보 조회 | `mcp__supabase__get_organization` |
| 프로젝트 목록 조회 | `mcp__supabase__list_projects` |
| 프로젝트 정보 조회 | `mcp__supabase__get_project` |
| 프로젝트 생성 | `mcp__supabase__create_project` |
| 프로젝트 일시정지 | `mcp__supabase__pause_project` |
| 프로젝트 복원 | `mcp__supabase__restore_project` |
| 프로젝트 URL 조회 | `mcp__supabase__get_project_url` |
| 공개 API 키 조회 | `mcp__supabase__get_publishable_keys` |

### 데이터베이스

| 작업 | 도구 |
|------|------|
| 테이블 목록 조회 | `mcp__supabase__list_tables` |
| SQL 실행 | `mcp__supabase__execute_sql` |
| 마이그레이션 목록 | `mcp__supabase__list_migrations` |
| 마이그레이션 적용 | `mcp__supabase__apply_migration` |
| 확장 기능 목록 | `mcp__supabase__list_extensions` |
| TypeScript 타입 생성 | `mcp__supabase__generate_typescript_types` |

### Edge Functions

| 작업 | 도구 |
|------|------|
| Function 목록 조회 | `mcp__supabase__list_edge_functions` |
| Function 정보 조회 | `mcp__supabase__get_edge_function` |
| Function 배포 | `mcp__supabase__deploy_edge_function` |

### 브랜치 관리

| 작업 | 도구 |
|------|------|
| 브랜치 목록 조회 | `mcp__supabase__list_branches` |
| 브랜치 생성 | `mcp__supabase__create_branch` |
| 브랜치 삭제 | `mcp__supabase__delete_branch` |
| 브랜치 병합 | `mcp__supabase__merge_branch` |
| 브랜치 리베이스 | `mcp__supabase__rebase_branch` |
| 브랜치 리셋 | `mcp__supabase__reset_branch` |

### 모니터링 & 진단

| 작업 | 도구 |
|------|------|
| 로그 조회 | `mcp__supabase__get_logs` |
| 어드바이저 조회 | `mcp__supabase__get_advisors` |
| 비용 조회 | `mcp__supabase__get_cost` |
| 비용 확인 | `mcp__supabase__confirm_cost` |

### 문서 검색

| 작업 | 도구 |
|------|------|
| Supabase 공식 문서 검색 | `mcp__supabase__search_docs` |

---

## 자주 쓰는 워크플로우

### 1. 프로젝트 현황 파악
```
1. mcp__supabase__list_organizations  → 조직 확인
2. mcp__supabase__list_projects       → 프로젝트 목록
3. mcp__supabase__get_project         → 특정 프로젝트 상세
4. mcp__supabase__list_tables         → 테이블 구조 파악
```

### 2. DB 스키마 변경
```
1. mcp__supabase__list_tables         → 현재 스키마 확인
2. mcp__supabase__list_migrations     → 기존 마이그레이션 확인
3. mcp__supabase__apply_migration     → 마이그레이션 적용 (사용자 확인 후)
4. mcp__supabase__generate_typescript_types → 타입 재생성
```

### 3. 클라이언트 연동 설정
```
1. mcp__supabase__get_project_url     → API URL 확인
2. mcp__supabase__get_publishable_keys → anon/service role 키 확인
```

### 4. 문제 진단
```
1. mcp__supabase__get_logs            → 최근 로그 확인
2. mcp__supabase__get_advisors        → 보안/성능 권고 확인
3. mcp__supabase__execute_sql         → 직접 쿼리로 상태 점검
```

### 5. Edge Function 배포
```
1. mcp__supabase__list_edge_functions → 기존 Function 목록
2. mcp__supabase__deploy_edge_function → 배포
3. mcp__supabase__get_edge_function   → 배포 결과 확인
```

### 6. 개발 브랜치 워크플로우
```
1. mcp__supabase__list_branches       → 브랜치 현황
2. mcp__supabase__create_branch       → 개발 브랜치 생성
   (개발 작업 진행)
3. mcp__supabase__merge_branch        → main에 병합 (확인 후)
```

---

## 비용 발생 작업 처리 패턴

프로젝트 생성, 브랜치 생성 등 비용이 발생하는 작업:

```
1. mcp__supabase__get_cost      → 예상 비용 확인
2. 사용자에게 비용 안내
3. 사용자 승인 후
4. mcp__supabase__confirm_cost  → 비용 확인 처리
5. 실제 작업 실행
```

---

## SQL 실행 주의사항

`mcp__supabase__execute_sql` 사용 시:
- SELECT는 바로 실행 가능
- INSERT/UPDATE/DELETE/DROP은 사용자 확인 후 실행
- 트랜잭션이 필요한 작업은 마이그레이션으로 처리 권장
