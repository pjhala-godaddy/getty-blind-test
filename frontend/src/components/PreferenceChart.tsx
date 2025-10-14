import '../styles/PreferenceChart.css';

interface PreferenceChartProps {
  optionACount: number;
  optionBCount: number;
  optionAPercentage: number;
  optionBPercentage: number;
}

function PreferenceChart({
  optionACount,
  optionBCount,
  optionAPercentage,
  optionBPercentage,
}: PreferenceChartProps) {
  return (
    <div className="preference-chart">
      <div className="chart-bars">
        <div className="bar-container">
          <div className="bar-label">Option A</div>
          <div className="bar-wrapper">
            <div
              className="bar bar-a"
              style={{ width: `${optionAPercentage}%` }}
            >
              <span className="bar-text">
                {optionACount} ({optionAPercentage.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>

        <div className="bar-container">
          <div className="bar-label">Option B</div>
          <div className="bar-wrapper">
            <div
              className="bar bar-b"
              style={{ width: `${optionBPercentage}%` }}
            >
              <span className="bar-text">
                {optionBCount} ({optionBPercentage.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreferenceChart;

