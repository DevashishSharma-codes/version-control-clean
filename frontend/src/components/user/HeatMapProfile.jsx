import { ResponsiveCalendar } from "@nivo/calendar";

const HeatMapProfile = ({ contributions = [] }) => {
  const currentYear = new Date().getFullYear();

  return (
    <div style={{ height: "250px", width: "100%" }}>
      <h4>Recent Contributions</h4>
      <ResponsiveCalendar
        data={contributions}
        from={`${currentYear}-01-01`}
        to={new Date()} // Correctly ends on today's date
        emptyColor="#2d2d2d"
        // Restored the multi-color gradient
        colors={['#ff00f2ff', '#002fffff', '#48ff00ff', '#fbff00ff', '#ff1e00ff']}
        margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
        yearSpacing={40}
        monthBorderColor="#1c1c1c"
        dayBorderWidth={2}
        dayBorderColor="#1c1c1c"
        // Restored the legend
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'row',
            translateY: 36,
            itemCount: 4,
            itemWidth: 42,
            itemHeight: 36,
            itemsSpacing: 14,
            itemDirection: 'right-to-left'
          }
        ]}
        // Restored the theme for tooltips and text
        theme={{
            textColor: '#d1d1d1',
            fontSize: 12,
            tooltip: {
                container: {
                    background: '#333',
                    color: '#fff',
                    fontSize: '14px',
                },
            },
        }}
      />
    </div>
  );
};

export default HeatMapProfile;