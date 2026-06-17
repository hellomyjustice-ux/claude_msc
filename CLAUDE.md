# CLAUDE.md

Claude Code가 이 프로젝트에서 작업할 때 따라야 할 지침입니다.

## 프로젝트 정보

- **저장소**: https://github.com/hellomyjustice-ux/claude_msc
- **로컬 경로**: `C:\Users\SBS\Desktop\claude_msc`
- **사용 언어**: 한국어로 응답

## 작업 완료 후 GitHub 업로드 규칙

**모든 작업이 끝날 때마다** 아래 흐름으로 변경 사항을 GitHub에 업로드한다.

### 1단계 — 변경 파일 확인 및 스테이징

```bash
git status
git add <변경된 파일>   # git add -A 는 node_modules 등 불필요한 파일 포함 가능하므로 주의
```

### 2단계 — 커밋

```bash
git commit -m "작업 내용을 한 줄로 요약"
```

### 3단계 — GitHub 푸시 (`/gh-cli` 스킬 활용)

`/gh-cli` 스킬을 사용해 GitHub 관련 작업을 처리한다.

```bash
# 최초 푸시 (upstream 설정 포함)
git push -u origin main

# 이후 푸시
git push
```

> 인증 오류가 발생하면 `gh auth status` → `gh auth login` 순서로 해결한다.

### 업로드 제외 항목

`node_modules/`, `.env`, `*.log`, `dist/`, `.DS_Store` 등 민감하거나 빌드 산출물은 커밋하지 않는다.
`.gitignore`가 없으면 먼저 생성한다.

---

## `/gh-cli` 스킬 활용 시점

| 상황 | 명령 |
|------|------|
| 저장소 상태 확인 | `gh repo view` |
| PR 생성 | `gh pr create` |
| 이슈 생성 | `gh issue create` |
| 릴리즈 배포 | `gh release create` |
| 인증 확인 | `gh auth status` |

---

## 일반 작업 원칙

- 작업 전 현재 브랜치와 git 상태를 확인한다.
- 파괴적인 작업(강제 푸시, 브랜치 삭제 등)은 반드시 사용자 확인 후 실행한다.
- 커밋 메시지는 변경 내용을 명확하게 한 줄로 작성한다.
