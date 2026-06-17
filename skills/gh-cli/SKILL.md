---
name: gh-cli
description: |
  GitHub CLI(gh) 명령어를 실행하여 PR, 이슈, 릴리즈, 저장소, 워크플로우 등 GitHub의 모든 작업을 처리하는 스킬.
  사용자가 PR 생성/리뷰/병합, 이슈 조회/생성/닫기, 릴리즈 배포, 저장소 클론, 워크플로우 실행 확인 등
  GitHub 관련 작업을 요청할 때 반드시 이 스킬을 사용하세요.
  "PR 만들어줘", "이슈 닫아줘", "GitHub에 올려줘", "릴리즈 만들어줘", "워크플로우 확인해줘",
  "저장소 클론해줘", "브랜치 PR 열어줘" 같은 모든 GitHub 작업 요청에 적극적으로 활용하세요.
---

# GitHub CLI (gh) 스킬

`gh` 명령어로 GitHub의 거의 모든 기능을 터미널에서 직접 실행할 수 있다.
작업 전에 `gh auth status`로 인증 상태를 확인하고, 필요하면 `gh auth login`을 안내하라.

## 핵심 원칙

- 명령어 실행 전 **무엇을 할지** 한 줄로 설명한다.
- 파괴적인 작업(삭제, 강제 병합 등)은 실행 전 사용자에게 확인을 받는다.
- 출력이 길면 핵심 정보만 요약해서 전달한다.
- 오류 발생 시 원인을 분석하고 해결 방법을 제시한다.

---

## PR (Pull Request) 관리

```bash
# PR 목록 조회
gh pr list
gh pr list --state all          # 닫힌 PR 포함
gh pr list --author @me         # 내 PR만
gh pr list --label "bug"        # 특정 라벨

# PR 생성
gh pr create --title "제목" --body "내용"
gh pr create --title "제목" --body "내용" --base main --head feature-branch
gh pr create --draft            # 드래프트 PR
gh pr create --reviewer user1,user2  # 리뷰어 지정

# PR 조회
gh pr view 123                  # PR 번호로 조회
gh pr view --web                # 브라우저에서 열기

# PR 체크아웃
gh pr checkout 123              # 로컬로 PR 브랜치 체크아웃

# PR 리뷰
gh pr review 123 --approve
gh pr review 123 --request-changes --body "수정 필요한 부분..."
gh pr review 123 --comment --body "의견..."

# PR 병합
gh pr merge 123                 # 기본 병합
gh pr merge 123 --squash        # 스쿼시 병합
gh pr merge 123 --rebase        # 리베이스 병합
gh pr merge 123 --auto          # 조건 충족 시 자동 병합

# PR 닫기 / 재열기
gh pr close 123
gh pr reopen 123

# PR 상태 확인 (CI/체크)
gh pr checks 123
```

---

## Issue (이슈) 관리

```bash
# 이슈 목록 조회
gh issue list
gh issue list --state closed    # 닫힌 이슈 포함
gh issue list --assignee @me    # 내게 할당된 이슈
gh issue list --label "bug,enhancement"

# 이슈 생성
gh issue create --title "제목" --body "내용"
gh issue create --title "제목" --label "bug" --assignee user1

# 이슈 조회
gh issue view 42
gh issue view 42 --web

# 이슈 닫기 / 재열기
gh issue close 42
gh issue close 42 --comment "해결 이유..."
gh issue reopen 42

# 이슈 수정
gh issue edit 42 --title "새 제목"
gh issue edit 42 --add-label "priority:high"
gh issue edit 42 --add-assignee user1
```

---

## Repository (저장소) 관리

```bash
# 저장소 클론
gh repo clone owner/repo
gh repo clone owner/repo -- --depth 1  # 얕은 클론

# 저장소 조회
gh repo view
gh repo view owner/repo
gh repo view --web

# 저장소 생성
gh repo create my-repo --public
gh repo create my-repo --private --clone
gh repo create my-repo --template owner/template-repo

# 저장소 포크
gh repo fork owner/repo
gh repo fork owner/repo --clone

# 저장소 목록
gh repo list                    # 내 저장소
gh repo list --limit 30
```

---

## Workflow / Actions 관리

```bash
# 워크플로우 실행 목록
gh run list
gh run list --workflow "CI"
gh run list --branch main

# 실행 상태 조회
gh run view 12345
gh run view 12345 --log         # 로그 보기
gh run view 12345 --log-failed  # 실패 로그만

# 워크플로우 수동 실행
gh workflow run workflow.yml
gh workflow run workflow.yml --field environment=production

# 실행 재시작
gh run rerun 12345
gh run rerun 12345 --failed-only  # 실패한 job만 재실행

# 워크플로우 목록
gh workflow list
gh workflow enable "CI"
gh workflow disable "Stale Bot"
```

---

## Release (릴리즈) 관리

```bash
# 릴리즈 목록
gh release list

# 릴리즈 조회
gh release view v1.0.0

# 릴리즈 생성
gh release create v1.0.0
gh release create v1.0.0 --title "버전 1.0.0" --notes "변경 내용..."
gh release create v1.0.0 --generate-notes   # 자동 릴리즈 노트
gh release create v1.0.0 ./dist/*.zip       # 파일 첨부
gh release create v1.0.0 --draft            # 드래프트
gh release create v1.0.0 --prerelease       # 프리릴리즈

# 릴리즈 삭제
gh release delete v1.0.0
```

---

## Gist 관리

```bash
# Gist 생성
gh gist create file.txt
gh gist create file.txt --public --desc "설명"
gh gist create file1.txt file2.txt

# Gist 목록 / 조회
gh gist list
gh gist view <gist-id>
```

---

## API 직접 호출

`gh api`로 GitHub REST/GraphQL API를 직접 호출할 수 있다.

```bash
# REST API
gh api repos/owner/repo
gh api repos/owner/repo/issues --method POST \
  --field title="제목" --field body="내용"

# GraphQL
gh api graphql -f query='
  query {
    viewer { login }
  }
'

# 페이지네이션
gh api repos/owner/repo/issues --paginate
```

---

## 알림 관리

```bash
gh notification list
gh notification mark-read
```

---

## 자주 쓰는 패턴

### 현재 저장소 PR 빠르게 생성
```bash
# 현재 브랜치 기준으로 main으로 PR 생성
gh pr create --title "$(git log -1 --pretty=%s)" --body "" --base main
```

### PR + CI 상태 한 번에 확인
```bash
gh pr view && gh pr checks
```

### 이슈를 PR로 연결
```bash
# PR body에 "Closes #42" 포함
gh pr create --title "Fix bug" --body "Closes #42"
```

### 특정 라벨 이슈 일괄 조회
```bash
gh issue list --label "bug" --state open --json number,title,assignees
```

---

## 인증 관련

```bash
gh auth status          # 현재 인증 상태 확인
gh auth login           # 로그인 (브라우저 or 토큰)
gh auth logout          # 로그아웃
gh auth refresh         # 권한 갱신
```

인증이 안 된 경우 `gh auth login`을 실행하도록 안내하고, 브라우저 인증 또는 토큰 입력 방법을 설명한다.
