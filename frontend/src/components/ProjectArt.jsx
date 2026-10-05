import ProjectScreenshot from "./ProjectScreenshot";

export default function ProjectArt({ project, large = false }) {
  if (project.image && project.kind === "book")
    return (
      <div
        className={`project-art book sand book-image-preview ${large ? "large" : ""}`}
      >
        <img
          src={project.image}
          alt={project.imageAlt || project.name + " cover"}
          width={736}
          height={1104}
          loading="lazy"
        />
      </div>
    );
  if (project.image && project.animatedPreview)
    return <ProjectScreenshot project={project} />;
  if (project.image)
    return (
      <img
        className="project-image"
        src={project.image}
        alt={project.imageAlt || project.name + " preview"}
        style={{ objectFit: project.imageFit || "cover" }}
        loading="lazy"
      />
    );
  return (
    <div
      className={`project-art ${project.kind} ${project.color} ${large ? "large" : ""}`}
      aria-label={project.name + " illustrative concept preview"}
    >
      {project.kind === "dashboard" ? (
        <div className="mock-dashboard">
          <aside>
            <b>
              ✳ socialgen<span>AI</span>
            </b>
            <small>WORKSPACE</small>
            <p>◈ Overview</p>
            <p>✧ AI Studio</p>
            <p>▦ Campaigns</p>
            <p>◷ Schedule</p>
            <p>↗ Analytics</p>
            <div className="mock-avatar">
              M <span>Moiz's workspace</span>
            </div>
          </aside>
          <div className="mock-main">
            <div className="mock-top">
              Workspace overview <span>⌕　♧　 M</span>
            </div>
            <h4>Big ideas. Effortless content.</h4>
            <p>Your next great campaign starts here.</p>
            <div className="mock-banner">
              <span>
                YOUR CREATIVE CO-PILOT<h4>What will you create today?</h4>
              </span>
              <b>✳</b>
            </div>
            <div className="mock-stats">
              <div>
                Total impressions
                <strong>
                  24.8K <small>↗ 18.2%</small>
                </strong>
              </div>
              <div>
                Content generated
                <strong>
                  148 <small>↗ 12.4%</small>
                </strong>
              </div>
              <div>
                Scheduled posts
                <strong>
                  32 <small>This month</small>
                </strong>
              </div>
            </div>
            <div className="mock-chart">
              <span>Audience growth</span>
              <div className="bars">
                {[23, 36, 29, 45, 38, 57, 48, 66, 58, 78, 70, 90, 82, 100].map(
                  (n, i) => (
                    <i key={i} style={{ height: n + "%" }} />
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      ) : project.kind === "finance" ? (
        <div className="finance-ui">
          <span>
            ◉ orbit <small>YOUR MONEY, IN PERSPECTIVE</small>
          </span>
          <p>Total balance</p>
          <h3>
            $24,680<span>.00</span>
          </h3>
          <div className="finance-graph">
            {[23, 34, 25, 42, 33, 51, 48, 65, 58, 78, 73, 98].map((n, i) => (
              <i key={i} style={{ height: n + "%" }} />
            ))}
          </div>
          <div className="finance-bottom">
            ↗ +12.8% this month <span>•• 4281</span>
          </div>
        </div>
      ) : project.kind === "app" ? (
        <div className="phone">
          <span>9:41　 　　 ▰</span>
          <h4>
            forma<span>●</span>
          </h4>
          <p>
            A little better,
            <br />
            every day.
          </p>
          <div className="habit-ring">
            76<small>DAILY SCORE</small>
          </div>
          <div className="habit">
            ↗ Move your body <b>✓</b>
          </div>
          <div className="habit">◉ Make space to breathe</div>
        </div>
      ) : project.kind === "brand" ? (
        <div className="brand-art">
          <small>AN EXPLORATION IN IDENTITY</small>
          <strong>
            mono<span>gram.</span>
          </strong>
          <span>LESS, BUT WITH MEANING.　↗</span>
        </div>
      ) : (
        <div className="book-art">
          <small>NOTES ON A CREATIVE LIFE</small>
          <strong>
            Beyond
            <br />
            the
            <br />
            <em>ordinary.</em>
          </strong>
          <span>AN EDITORIAL EXPLORATION</span>
        </div>
      )}
    </div>
  );
}
