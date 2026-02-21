import { PerformanceTelemetry } from '@/components/telemetry';

export const metadata = {
  title: 'Performance Telemetry | FuelUp F1',
  description: 'F1 telemetry dashboard showing fuel efficiency and performance metrics',
};

export default function TelemetryPage() {
  return <PerformanceTelemetry />;
}
