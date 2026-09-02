import sys
from pathlib import Path


SKILL_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SKILL_ROOT / "scripts"))
SAMPLE_NARRATION = "# 示例\n\n[N001]\n第一段含 2021 年和 2–3 名。\n\n[N002]\n第二段。\n\n### 6.1 Narration Duration Estimate\n保持不变。\n"


