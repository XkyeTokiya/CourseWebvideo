import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import WhatResolutionDoes from "./chapters/01-ep06-what-resolution-does/WhatResolutionDoes";
import { narrations as resolutionNarrations } from "./chapters/01-ep06-what-resolution-does/narrations";
import IdentityKey from "./chapters/02-ep06-identity-key/IdentityKey";
import { narrations as identityNarrations } from "./chapters/02-ep06-identity-key/narrations";
import RouteValidation from "./chapters/03-ep35-route-validation/RouteValidation";
import { narrations as routeNarrations } from "./chapters/03-ep35-route-validation/narrations";
import DecisionLedger from "./chapters/04-ep35-decision-ledger/DecisionLedger";
import { narrations as ledgerNarrations } from "./chapters/04-ep35-decision-ledger/narrations";
import SelectionConclusion from "./chapters/05-ep35-selection-conclusion/SelectionConclusion";
import { narrations as conclusionNarrations } from "./chapters/05-ep35-selection-conclusion/narrations";

export const id = "episode-design-reference";
export const title = "精品设计参考";

export const CHAPTERS: ChapterDef[] = [
  { id: "ep06-what-resolution-does", title: "解析到底做什么", narrations: resolutionNarrations, Component: WhatResolutionDoes },
  { id: "ep06-identity-key", title: "身份键与挂载的信息", narrations: identityNarrations, Component: IdentityKey },
  { id: "ep35-route-validation", title: "真实路线验证", narrations: routeNarrations, Component: RouteValidation },
  { id: "ep35-decision-ledger", title: "现场决策顺序", narrations: ledgerNarrations, Component: DecisionLedger },
  { id: "ep35-selection-conclusion", title: "选型收束", narrations: conclusionNarrations, Component: SelectionConclusion },
];
