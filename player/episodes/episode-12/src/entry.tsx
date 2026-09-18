import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import OpeningCheck from "./chapters/01-opening-check/OpeningCheck";
import { narrations as openingNarrations } from "./chapters/01-opening-check/narrations";
import ExistingSystems from "./chapters/02-existing-systems/ExistingSystems";
import { narrations as existingSystemsNarrations } from "./chapters/02-existing-systems/narrations";
import AssemblyVerification from "./chapters/05-assembly-verification/AssemblyVerification";
import { narrations as assemblyVerificationNarrations } from "./chapters/05-assembly-verification/narrations";
import SupplySideDrift from "./chapters/03-supply-side-drift/SupplySideDrift";
import { narrations as supplySideDriftNarrations } from "./chapters/03-supply-side-drift/narrations";
import InstallArchive from "./chapters/06-install-archive/InstallArchive";
import { narrations as installArchiveNarrations } from "./chapters/06-install-archive/narrations";
import PartsSingleItem from "./chapters/07-parts-single-item/PartsSingleItem";
import { narrations as partsSingleItemNarrations } from "./chapters/07-parts-single-item/narrations";
import RepairTraceback from "./chapters/08-repair-traceback/RepairTraceback";
import { narrations as repairTracebackNarrations } from "./chapters/08-repair-traceback/narrations";
import CaseResults from "./chapters/09-case-results/CaseResults";
import { narrations as caseResultsNarrations } from "./chapters/09-case-results/narrations";
import OneItemOneCode from "./chapters/04-one-item-one-code/OneItemOneCode";
import { narrations as oneItemOneCodeNarrations } from "./chapters/04-one-item-one-code/narrations";
import SummaryAnchor from "./chapters/10-summary-anchor/SummaryAnchor";
import { narrations as summaryAnchorNarrations } from "./chapters/10-summary-anchor/narrations";

export const id = "episode-12";
export const title = "汽车零部件精益管理：一物一码如何减少错装与串货";

export const CHAPTERS: ChapterDef[] = [
  {
    id: "cover",
    title: "封面",
    narrations: coverNarrations,
    stepDurationsMs: [15000],
    Component: Cover,
  },
  {
    id: "opening-check",
    title: "开场情境页",
    narrations: openingNarrations,
    Component: OpeningCheck,
  },
  {
    id: "existing-systems",
    title: "既有系统页",
    narrations: existingSystemsNarrations,
    Component: ExistingSystems,
  },
  {
    id: "supply-side-drift",
    title: "断裂归因页",
    narrations: supplySideDriftNarrations,
    Component: SupplySideDrift,
  },
  {
    id: "assembly-verification",
    title: "装配校验页",
    narrations: assemblyVerificationNarrations,
    Component: AssemblyVerification,
  },
  {
    id: "one-item-one-code",
    title: "平台读图页",
    narrations: oneItemOneCodeNarrations,
    Component: OneItemOneCode,
  },
  {
    id: "install-archive",
    title: "装机档案页",
    narrations: installArchiveNarrations,
    Component: InstallArchive,
  },
  {
    id: "parts-single-item",
    title: "配件流转页",
    narrations: partsSingleItemNarrations,
    Component: PartsSingleItem,
  },
  {
    id: "repair-traceback",
    title: "维修追溯页",
    narrations: repairTracebackNarrations,
    Component: RepairTraceback,
  },
  {
    id: "case-results",
    title: "案例结果页",
    narrations: caseResultsNarrations,
    Component: CaseResults,
  },
  {
    id: "summary-anchor",
    title: "总结页",
    narrations: summaryAnchorNarrations,
    Component: SummaryAnchor,
  },
];
