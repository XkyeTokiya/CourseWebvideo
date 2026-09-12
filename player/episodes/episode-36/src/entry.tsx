import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import A001OpeningLimitedSpace from "./chapters/01-a001-opening-limited-space/A001OpeningLimitedSpace";
import { narrations as a001Narrations } from "./chapters/01-a001-opening-limited-space/narrations";
import A002IntegratedDefinition from "./chapters/02-a002-integrated-definition/A002IntegratedDefinition";
import { narrations as a002Narrations } from "./chapters/02-a002-integrated-definition/narrations";
import A003CarrierAndAttached from "./chapters/03-a003-carrier-and-attached/A003CarrierAndAttached";
import { narrations as a003Narrations } from "./chapters/03-a003-carrier-and-attached/narrations";
import A004DesignOrder from "./chapters/04-a004-design-order/A004DesignOrder";
import { narrations as a004Narrations } from "./chapters/04-a004-design-order/narrations";
import A005MaterialPosition from "./chapters/05-a005-material-position/A005MaterialPosition";
import { narrations as a005Narrations } from "./chapters/05-a005-material-position/narrations";
import A006FunctionBeauty from "./chapters/06-a006-function-beauty/A006FunctionBeauty";
import { narrations as a006Narrations } from "./chapters/06-a006-function-beauty/narrations";
import A007InfoHierarchy from "./chapters/07-a007-info-hierarchy/A007InfoHierarchy";
import { narrations as a007Narrations } from "./chapters/07-a007-info-hierarchy/narrations";
import A008RoundRectLayouts from "./chapters/08-a008-round-rect-layouts/A008RoundRectLayouts";
import { narrations as a008Narrations } from "./chapters/08-a008-round-rect-layouts/narrations";
import A009ThreeLayerReview from "./chapters/09-a009-three-layer-review/A009ThreeLayerReview";
import { narrations as a009Narrations } from "./chapters/09-a009-three-layer-review/narrations";
import A010ReviewSequence from "./chapters/10-a010-review-sequence/A010ReviewSequence";
import { narrations as a010Narrations } from "./chapters/10-a010-review-sequence/narrations";
import A011UseEnvironment from "./chapters/11-a011-use-environment/A011UseEnvironment";
import { narrations as a011Narrations } from "./chapters/11-a011-use-environment/narrations";
import A012ToolBoundary from "./chapters/12-a012-tool-boundary/A012ToolBoundary";
import { narrations as a012Narrations } from "./chapters/12-a012-tool-boundary/narrations";
import A013DesignRecap from "./chapters/13-a013-design-recap/A013DesignRecap";
import { narrations as a013Narrations } from "./chapters/13-a013-design-recap/narrations";

export const id = "episode-36";
export const title = "标识载体设计：尺寸、位置、耐久与信息层级";

export const CHAPTERS: ChapterDef[] = [
  {
    id: "cover",
    title: "封面",
    narrations: coverNarrations,
    stepDurationsMs: [15000],
    Component: Cover,
  },
  {
    id: "a001-opening-limited-space",
    title: "片头与开场问题",
    narrations: a001Narrations,
    Component: A001OpeningLimitedSpace,
  },
  {
    id: "a002-integrated-definition",
    title: "一体化定义与四类维度",
    narrations: a002Narrations,
    Component: A002IntegratedDefinition,
  },
  {
    id: "a003-carrier-and-attached",
    title: "载体与附着物",
    narrations: a003Narrations,
    Component: A003CarrierAndAttached,
  },
  {
    id: "a004-design-order",
    title: "先看附着物，再定版面",
    narrations: a004Narrations,
    Component: A004DesignOrder,
  },
  {
    id: "a005-material-position",
    title: "材质与张贴位置",
    narrations: a005Narrations,
    Component: A005MaterialPosition,
  },
  {
    id: "a006-function-beauty",
    title: "功能与美观并列",
    narrations: a006Narrations,
    Component: A006FunctionBeauty,
  },
  {
    id: "a007-info-hierarchy",
    title: "关键信息层级",
    narrations: a007Narrations,
    Component: A007InfoHierarchy,
  },
  {
    id: "a008-round-rect-layouts",
    title: "圆形与长方形示例",
    narrations: a008Narrations,
    Component: A008RoundRectLayouts,
  },
  {
    id: "a009-three-layer-review",
    title: "三层关系复核",
    narrations: a009Narrations,
    Component: A009ThreeLayerReview,
  },
  {
    id: "a010-review-sequence",
    title: "复核顺序",
    narrations: a010Narrations,
    Component: A010ReviewSequence,
  },
  {
    id: "a011-use-environment",
    title: "回到使用环境",
    narrations: a011Narrations,
    Component: A011UseEnvironment,
  },
  {
    id: "a012-tool-boundary",
    title: "工具边界",
    narrations: a012Narrations,
    Component: A012ToolBoundary,
  },
  {
    id: "a013-design-recap",
    title: "设计收束",
    narrations: a013Narrations,
    Component: A013DesignRecap,
  },
];
