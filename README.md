# dap-plugins — DAP 플러그인 레지스트리

DAP(Desk AI Pet)의 **커뮤니티 플러그인 카탈로그**입니다. DAP 앱이 이 레포의
[`plugin_catalog.json`](plugin_catalog.json)을 받아 설정 → 플러그인에서 **원클릭 설치** 목록으로
보여줍니다.

> 이 레포는 **목록(포인터)만** 담습니다. 플러그인 코드는 각 작성자의 레포에 있고, DAP는 설치 시
> 그 레포에서 파일을 직접 내려받습니다. 여기에 코드를 올리지 마세요.

## 플러그인 등록하기 (작성자)

1. **플러그인을 public GitHub 레포로** 만든다. 구조:
   ```
   your-plugin/
     plugin.yaml                 # 매니페스트 (id/name/version/entry/permissions)
     <module>/plugin.mjs         # 자기완결 ESM (외부 import 없이 번들)
     palette/index.html          # (팔레트를 쓴다면) 자기완결 단일 HTML
     icon.png                    # (선택) 래디얼 메뉴 아이콘 — 아래 방침 참고
   ```
   작성 가이드: DAP 레포의 [`docs/PLUGIN_API.md`](https://github.com/Project-Undonghae/mydeskpet/blob/main/docs/PLUGIN_API.md).
   > **아이콘 방침:** DAP는 자기 앱 아이콘을 플러그인 항목에 **주지 않는다.** 래디얼 아이콘이 필요하면
   > 레포에 아이콘 파일을 포함하고 `ctx.radialMenu.addItem({ …, icon: "icon.png" })`로 지정하라(없으면
   > 라벨 첫 글자 아바타). 트레이 항목은 텍스트 전용. 자세히는 PLUGIN_API §5.4.
2. **버전 태그** — `git tag v1.0.0 && git push --tags`. (카탈로그 `ref`가 이걸 가리켜 고정 버전 설치.)
3. **이 레포에 항목 추가 PR** — `plugin_catalog.json`의 `plugins`에 한 항목 추가:
   ```json
   {
     "id": "io.github.you.my_plugin",
     "name": "My Plugin",
     "description": "한 줄 설명",
     "category": "utility",
     "repo": "you/my-plugin",
     "ref": "v1.0.0"
   }
   ```
   - `id`(필수) — **`plugin.yaml`의 id와 반드시 일치**. 역-도메인 네임스페이스 권장(`io.github.<user>.<name>`).
   - `repo`(필수) — `owner/name` 또는 github URL.
   - `category`(선택) — 웹 카탈로그 분류. `productivity`, `utility`, `developer` 중 하나.
   - `name`·`description`·`ref`(선택). `ref` 생략 시 기본 브랜치(움직이는 타깃)라 태그 권장.
4. **리뷰 → 머지** — 메인테이너가 리뷰(플러그인은 in-process 전체 권한 → 안전성 확인이 게이트)한 뒤 머지하면 **즉시 라이브**. 앱 재배포 불필요.

## 검증

`plugin_catalog.json` 변경 PR은 [`scripts/validate.mjs`](scripts/validate.mjs)로 자동 검사됩니다
(유효 JSON · `id`/`repo` 필수 · `id` 중복 없음 · `repo` 형식 · `category` 허용값). 로컬 확인: `node scripts/validate.mjs`.

## 업데이트 / 제거

- **업데이트**: 새 버전 태그 후 `ref` 갱신 PR.
- **제거**: 항목 삭제 PR.

## 등록된 플러그인

| 이름 | 분류 | 설명 | 레포 |
|---|---|---|---|
| Super Clipboard | utility | 복사한 텍스트·이미지·파일을 팔레트로 | [o-min222/dap-super-clipboard](https://github.com/o-min222/dap-super-clipboard) |
| Lecture Tools | productivity | 강사용 커서 강조, 판서, spotlight 오버레이 컨트롤 | [o-min222/dap-lecture-tools](https://github.com/o-min222/dap-lecture-tools) |
