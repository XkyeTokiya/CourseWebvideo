import coverData from "../../data/cover.json";
import "./Cover.css";

interface CoverContent {
  course: string;
  module: { no: string; name: string };
  task: { no: string; name: string };
  point: { no: string; title: string };
  lede: string;
  chips: string[];
}

const data = coverData as CoverContent;

export function Cover() {
  return (
    <div className="scene cv">
      <div className="scene-pad cv-pad">
        <div className="cv-plate cv-in cv-d0" aria-hidden>
          07
        </div>

        <header className="cv-top cv-in cv-d0">
          <p className="cv-course">{data.course}</p>
          <hr className="rule" />
        </header>

        <div className="cv-meta cv-in cv-d1">
          <p className="cv-meta-line">
            <span className="cv-meta-no">{data.module.no}</span>
            {data.module.name}
          </p>
          <p className="cv-meta-line">
            <span className="cv-meta-no">{data.task.no}</span>
            {data.task.name}
          </p>
        </div>

        <div className="cv-hero">
          <p className="hero-num cv-point cv-in cv-d2">{data.point.no}</p>
          <h1 className="cv-title cv-in cv-d2">{data.point.title}</h1>
        </div>

        <p className="cv-lede cv-in cv-d3">{data.lede}</p>

        <ul className="cv-chips">
          {data.chips.map((chip, index) => (
            <li className={`cv-chip cv-in cv-d${index + 4}`} key={chip}>
              {chip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
