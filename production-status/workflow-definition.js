(function () {
  const root = 'D:\\00-workspace\\005-coursewebvideo';

  const stages = [
    {
      id: 'freeze-task-package', number: '01', group: '上游内容', label: '冻结任务包', short: '确认事实源与内容边界',
      purpose: '确认任务包是本集唯一只读事实源，并识别事实冲突、内容义务和静默护栏。',
      checklist: ['任务包文件存在且可读取', '标题与 episode ID 匹配', '事实冲突和职责边界已明确'],
      artifacts: [{ key: 'taskPackage', label: '冻结任务包', source: 'observation', observation: 'taskPackage' }],
      prompt: '请在 narration-pipeline 中处理 {{episodeId}}（{{title}}）。读取冻结任务包并启动连续口播生产。任务包保持只读；过程文件写入 .tmp/narration-pipeline/；先完成 Brief 提炼，再按 rewrite-course-narration 的当前工作流生成连续口播候选。遇到事实冲突或职责不清时停止并向用户确认。'
    },
    {
      id: 'continuous-narration', number: '02', group: '上游内容', label: '连续口播', short: '生成自然连续稿',
      purpose: '基于 Brief 隔离生成连续口播候选，完成红线、内容和语言审读。',
      checklist: ['口播覆盖任务包内容义务', '不存在新增事实或越界承诺', '语言自然、连续且适合讲述'],
      artifacts: [{ key: 'approvedNarration', label: '批准口播文件', source: 'observation', observation: 'approvedNarration', note: '只有人工批准后才应正式落盘' }],
      prompt: '请审核 {{episodeId}}（{{title}}）的连续口播候选。以冻结任务包和 Brief 为边界，依次检查红线、内容覆盖和语言质量。不要生成或覆盖 approved-spoken-text.txt；先把完整候选稿与问题清单交给用户，等待明确批准。'
    },
    {
      id: 'approve-narration', number: '03', group: '上游内容', label: '批准口播', short: '人工门禁：确认实际说什么', gateKey: 'narration',
      purpose: '用户明确确认连续稿后，才允许形成批准口播并进入 A-page。',
      checklist: ['已完整预览连续口播', '关键事实和措辞已确认', '用户明确同意作为整集口播权威'],
      artifacts: [{ key: 'approvedNarration', label: 'approved-spoken-text.txt', source: 'observation', observation: 'approvedNarration' }],
      prompt: '请在 narration-pipeline 中继续 {{episodeId}}（{{title}}）的 A-page v6 编译。唯一口播来源是 player/episodes/{{episodeId}}/inputs/approved-spoken-text.txt。切分 Nx，生成 screen guidance、evidence、protected relations 与 silent constraints；同时生成 compile trace，并执行当前 A-page validator。任何验证失败或 unresolved 不得发布。'
    },
    {
      id: 'a-page', number: '04', group: '上游内容', label: 'A-page v6', short: '编译页面语义契约',
      purpose: '把批准口播切分为 Nx，并形成页面级语义、证据、关系和静默约束。',
      checklist: ['Nx 与批准口播无损一致', 'must_visible 与证据来源清晰', 'protected relations 和 silent constraints 完整'],
      artifacts: [{ key: 'aPage', label: 'A-page JSON', source: 'observation', observation: 'aPage' }],
      prompt: '请检查 {{episodeId}}（{{title}}）的 A-page v6 编译追踪。证明任务包中的每个语义原子进入了哪个 A/S，或记录可接受的省略原因。compile trace 只写入 .tmp/narration-pipeline/，不得发布到 player inputs；存在 unresolved 或无理由遗漏时停止。'
    },
    {
      id: 'compile-trace', number: '05', group: '上游内容', label: '编译追踪', short: '证明语义原子去向',
      purpose: '追踪任务包语义原子进入哪个 A/S，或者为什么允许省略。',
      checklist: ['每个语义原子都有去向', '省略项包含明确理由', '不存在 unresolved'],
      artifacts: [{ key: 'aPage', label: 'A-page JSON', source: 'observation', observation: 'aPage' }],
      prompt: '请对 {{episodeId}}（{{title}}）执行 A-page v6 完整验证。检查 schema、Nx 无损、覆盖率、证据、关系、screen guidance 与 compile trace。要求 coverage_passed=true、unresolved=[]、failures=[]；输出验证报告，失败时不要继续 visual rough。'
    },
    {
      id: 'validate-a-page', number: '06', group: '上游内容', label: 'A-page 验证', short: '机器验证与语义验收',
      purpose: '确认 A-page 满足 schema、覆盖、证据、关系和追踪要求。',
      checklist: ['validation failures 为空', 'coverage_passed 为 true', 'unresolved 为空'],
      artifacts: [
        { key: 'aPage', label: 'A-page JSON', source: 'observation', observation: 'aPage' },
        { key: 'aPageValidation', label: 'A-page 验证报告', source: 'derived', path: 'player/episodes/{{episodeId}}/inputs/{{episodeId}}-a-page-validation.json' }
      ],
      prompt: '请在 narration-pipeline 中使用 design-course-visual-rough，为 {{episodeId}}（{{title}}）生成 visual rough v3 候选。只读取已验证的 A-page 正式输入；规划页面配方、G/R/M 结构、媒体需求和关系载体。候选保持 draft，完成验证后交给用户审阅，不得自动改为 approved。'
    },
    {
      id: 'visual-rough', number: '07', group: '上游内容', label: 'Visual rough v3', short: '人工门禁：批准视觉粗设', gateKey: 'visualRough',
      purpose: '确认页面配方、视觉关系、媒体需求和整体视觉节奏。',
      checklist: ['逐页配方与内容关系匹配', '媒体需求真实且不承担虚假证据', '验证通过并由用户明确批准'],
      artifacts: [
        { key: 'visualRough', label: 'Visual rough', source: 'observation', observation: 'visualRough' },
        { key: 'visualValidation', label: 'Visual rough 验证报告', source: 'derived', path: 'player/episodes/{{episodeId}}/inputs/{{episodeId}}-visual-rough-validation.json' }
      ],
      prompt: '请在 player 中启动 {{episodeId}}（{{title}}）的下游 Phase 1。只读取 player/episodes/{{episodeId}}/inputs/ 中已批准和验证的三份正式输入，生成 script.md、outline.md 和 project.json。保持批准口播逐字与顺序不变，不得回读任务包或 .tmp 补齐语义。'
    },
    {
      id: 'player-phase-1', number: '08', group: '下游制作', label: '下游 Phase 1', short: '生成稿子与生产计划',
      purpose: '从正式 inputs 无损派生口播 beats、Outline 和生产计划。',
      checklist: ['script 与批准口播无损一致', 'outline 覆盖全部 A-page', '主题、素材和开发模式已明确'],
      artifacts: [
        { key: 'script', label: 'script.md', source: 'derived', path: 'player/episodes/{{episodeId}}/script.md' },
        { key: 'outline', label: 'outline.md', source: 'derived', path: 'player/episodes/{{episodeId}}/outline.md' },
        { key: 'project', label: 'project.json', source: 'player' }
      ],
      prompt: '请对 {{episodeId}}（{{title}}）执行 Checkpoint Plan。集中展示并核对 script、outline、主题、素材方案和开发模式五项内容，列出未决问题；在用户明确确认五项全部对齐前，不得进入网页开发。'
    },
    {
      id: 'checkpoint-plan', number: '09', group: '下游制作', label: 'Checkpoint Plan', short: '人工门禁：确认生产计划', gateKey: 'checkpointPlan',
      purpose: '一次确认稿子、Outline、主题、素材和开发模式，控制网页开发返工风险。',
      checklist: ['script 已确认', 'Outline 与章节结构已确认', '主题、素材、开发模式均已确认'],
      artifacts: [
        { key: 'script', label: 'script.md', source: 'derived', path: 'player/episodes/{{episodeId}}/script.md' },
        { key: 'outline', label: 'outline.md', source: 'derived', path: 'player/episodes/{{episodeId}}/outline.md' },
        { key: 'project', label: 'project.json', source: 'player' }
      ],
      prompt: '请在 player 中为 {{episodeId}}（{{title}}）生成单章 compact handoff v3。先运行 pnpm courseplay:handoff -- --episode {{episodeId}} --a-page <Axxx> --check，确保 freshness 和输入契约通过；handoff 写入 episode 的 .handoffs/，不得提交 Git。'
    },
    {
      id: 'chapter-handoff', number: '10', group: '下游制作', label: '单章交接', short: '生成隔离的章节输入包',
      purpose: '从正式 inputs 机械生成单 A compact handoff，控制章节 Agent 的上下文边界。',
      checklist: ['handoff 来源仅为正式 inputs', '--check 与 freshness 通过', 'A-page 与目标章节对应'],
      artifacts: [{ key: 'handoffs', label: '.handoffs/', source: 'derived', path: 'player/episodes/{{episodeId}}/.handoffs/' }],
      prompt: '请在 player 中开始 {{episodeId}}（{{title}}）的第 1 章完整制作。综合 guidance、当前 A beats 和 presentation 三源重新设计完整上屏内容；不得先交骨架。完成 Chapter.tsx、CSS、narrations.ts 和所需媒体，并运行 episode:check、typecheck 与 lint，随后交给用户验收。'
    },
    {
      id: 'chapter-production', number: '11', group: '下游制作', label: '章节制作', short: '制作可验收的完整章节',
      purpose: '按三源输入创作完整上屏内容，并保持口播、画面状态和媒体严格对应。',
      checklist: ['章节不是骨架或占位实现', '口播 beats 与 steps 一致', 'episode:check、typecheck、lint 通过'],
      artifacts: [
        { key: 'entry', label: '播放器入口', source: 'derived', path: 'player/episodes/{{episodeId}}/src/entry.tsx' },
        { key: 'project', label: 'project.json', source: 'player' }
      ],
      prompt: '请对 {{episodeId}}（{{title}}）的第 1 章进行完整验收。检查内容准确性、视觉结构、交互状态、口播同步、媒体和响应式表现；给出通过或明确修改清单。用户通过前不得继续第 2 章及后续批量制作。'
    },
    {
      id: 'chapter-acceptance', number: '12', group: '下游制作', label: '后续章节与验收', short: '人工门禁：首章放行与批量制作', gateKey: 'firstChapter',
      purpose: '验收第 1 章完整版本，并按选定模式推进第 2 至 N 章。',
      checklist: ['第 1 章内容与视觉已通过', '批量制作模式已经确认', '后续章节审查和结清方式明确'],
      artifacts: [
        { key: 'entry', label: '播放器入口', source: 'derived', path: 'player/episodes/{{episodeId}}/src/entry.tsx' },
        { key: 'project', label: '章节进度', source: 'player' }
      ],
      prompt: '请在 player 中继续 {{episodeId}}（{{title}}）第 2 至 N 章的制作、审查、修复和结清。继承已通过首章的主题与开发模式，逐章保持输入边界和口播无损；完成后运行 episode:check、typecheck、lint 和 build，并汇总缺素材与未结问题。'
    },
    {
      id: 'audio', number: '13', group: '下游制作', label: '音频', short: '人工门禁：确认分段与是否合成', gateKey: 'checkpointAudio',
      purpose: '从 narrations.ts 提取分段，并在用户确认文本和是否合成后生成音频。',
      checklist: ['audio-segments 与 narrations.ts 一致', '用户已确认分段文本', '用户已明确决定是否合成'],
      artifacts: [{ key: 'audioSegments', label: 'audio-segments.json', source: 'audio' }],
      prompt: '请在 player 中处理 {{episodeId}}（{{title}}）的音频。先运行 pnpm audio:extract -- --episode {{episodeId}} 并展示 audio-segments.json 供用户确认；只有用户明确同意合成后，才运行 audio:synthesize。完成后核对分段数量、文件数量和缺失数量。'
    },
    {
      id: 'recording-delivery', number: '14', group: '下游制作', label: '录屏与后期', short: '录屏、成片和最终验收', gateKey: 'finalDelivery',
      purpose: '完成播放器预览、录屏、后期成片及最终交付验收。',
      checklist: ['播放器构建与完整流程通过', '录屏或成片证据已登记', '最终视觉和成片由用户明确验收'],
      artifacts: [
        { key: 'recording', label: '录屏', source: 'delivery', observation: 'recording' },
        { key: 'finalVideo', label: '最终成片', source: 'delivery', observation: 'finalVideo' }
      ],
      prompt: '请完成 {{episodeId}}（{{title}}）的录屏与后期交付。先验证播放器构建和全流程播放，再完成录屏、后期和成片检查；登记真实文件或外部证据，并把最终视觉与成片交给用户验收。未获得明确批准前不得标记为已交付。'
    }
  ];

  const approvalLabels = {
    narration: '批准连续口播', visualRough: '批准 Visual rough', checkpointPlan: 'Checkpoint Plan',
    firstChapter: '第 1 章验收', checkpointAudio: 'Checkpoint Audio', finalDelivery: '最终交付验收'
  };

  function interpolate(value, doc) {
    return String(value || '')
      .replaceAll('{{episodeId}}', doc.episodeId)
      .replaceAll('{{title}}', doc.title)
      .replaceAll('{{root}}', root);
  }

  window.CourseWorkflow = { root, stages, approvalLabels, interpolate };
}());
