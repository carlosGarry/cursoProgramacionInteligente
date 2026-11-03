import { useLaunches } from '../hooks/useLaunches';
import { AsyncView, StatusMessage } from '../components/StatusMessage';
import { LaunchCard } from '../components/LaunchCard';

export function LaunchListPage() {
  const { state, retry } = useLaunches();

  return (
    <section>
      <h1>Próximos lanzamientos</h1>
      <AsyncView state={state} onRetry={retry}>
        {(launches) =>
          launches.length === 0 ? (
            <StatusMessage>No hay lanzamientos disponibles.</StatusMessage>
          ) : (
            <div className="launch-grid">
              {launches.map((launch) => (
                <LaunchCard key={launch.id} launch={launch} />
              ))}
            </div>
          )
        }
      </AsyncView>
    </section>
  );
}
