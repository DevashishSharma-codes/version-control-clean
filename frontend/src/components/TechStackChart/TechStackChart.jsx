import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { ArrowRight } from "lucide-react";
import "./TechStackChart.css"; 

ChartJS.register(ArcElement, Tooltip, Legend);

const TECH_DATA = {
  js: { name: 'JavaScript', color: 'rgba(240, 219, 79, 0.8)', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
  jsx: { name: 'React', color: 'rgba(97, 218, 251, 0.8)', url: 'https://react.dev/' },
  py: { name: 'Python', color: 'rgba(48, 105, 152, 0.8)', url: 'https://www.python.org/' },
  go: { name: 'Go', color: 'rgba(0, 173, 216, 0.8)', url: 'https://go.dev/' },
  java: { name: 'Java', color: 'rgba(176, 114, 25, 0.8)', url: 'https://www.java.com/' },
  ts: { name: 'TypeScript', color: 'rgba(0, 122, 204, 0.8)', url: 'https://www.typescriptlang.org/' },
  css: { name: 'CSS', color: 'rgba(41, 101, 241, 0.8)', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
  html: { name: 'HTML', color: 'rgba(227, 76, 38, 0.8)', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
  other: { name: 'Other', color: 'rgba(110, 84, 148, 0.8)', url: 'https://github.com/' },
};

export default function TechStackChart({ repos, title }) {
  const processedData = useMemo(() => {
    if (!repos || repos.length === 0) {
      return { labels: [], datasets: [] };
    }

    const langCounts = repos.flatMap(repo => repo.files || [])
      .reduce((acc, file) => {
        const extension = file.name.split('.').pop()?.toLowerCase() || 'other';
        const tech = TECH_DATA[extension] ? extension : 'other';
        acc[tech] = (acc[tech] || 0) + 1;
        return acc;
      }, {});

    const sortedTech = Object.entries(langCounts)
      .map(([key, value]) => ({
        ...TECH_DATA[key],
        value,
      }))
      .sort((a, b) => b.value - a.value);

    return {
      sortedTech,
      chartData: {
        labels: sortedTech.map(tech => tech.name),
        datasets: [{
          label: 'Files',
          data: sortedTech.map(tech => tech.value),
          backgroundColor: sortedTech.map(tech => tech.color),
          borderColor: '#1c1c1c',
          borderWidth: 2,
        }],
      }
    };
  }, [repos]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(30, 30, 30, 0.9)",
        titleColor: "#fff",
        bodyColor: "#ccc",
        cornerRadius: 6,
        displayColors: false,
      },
    },
  };
  
  if (!processedData.sortedTech || processedData.sortedTech.length === 0) {
      return (
          <div className="panel-sub tech-stack-panel">
              <div className="panel-head tight">
                  <h4 className="panel-title">{title || 'Tech Distribution'}</h4>
              </div>
              <p className="muted-small">No file data available to generate a chart.</p>
          </div>
      );
  }

  return (
    <div className="panel-sub tech-stack-panel">
        <div className="panel-head tight">
            <h4 className="panel-title">{title || 'Tech Distribution'}</h4>
        </div>
        <div className="tech-chart-container">
            <Doughnut data={processedData.chartData} options={options} />
        </div>
        <div className="tech-resources-list">
            {processedData.sortedTech.slice(0, 4).map(tech => (
                <div key={tech.name} className="tech-item">
                    <div className="tech-color-dot" style={{ backgroundColor: tech.color }}></div>
                    <span className="tech-name">{tech.name}</span>
                    <a href={tech.url} target="_blank" rel="noopener noreferrer" className="tech-resource-link">
                        <span>Get Started</span>
                        <ArrowRight size={16} />
                    </a>
                </div>
            ))}
        </div>
    </div>
  );
}