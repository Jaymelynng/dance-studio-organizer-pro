interface DashboardHeaderProps {
  loading?: boolean;
  isEmpty?: boolean;
}

export const DashboardHeader = ({ loading = false, isEmpty = false }: DashboardHeaderProps) => {
  return (
    <div className="text-center space-y-4 py-8">
      <h1 className={`text-4xl font-bold text-white mb-2 ${!loading ? 'animate-float' : ''}`}>
        Dégagé Classical Conservatory
      </h1>
      <p className="text-white/90 text-lg">
        {isEmpty ? 'Management Dashboard' : 'Management Hub'}
      </p>
    </div>
  );
};