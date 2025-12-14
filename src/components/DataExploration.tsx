import React, { useMemo } from 'react';
import { BarChart3, PieChart, TrendingUp, Activity } from 'lucide-react';
import { database } from '../utils/supabase';

interface DataExplorationProps {
  user: { id: string; email: string; name: string } | null;
}

const DataExploration: React.FC<DataExplorationProps> = ({ user }) => {
  const [analytics, setAnalytics] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  // Move all useMemo hooks to top level before any conditional returns
  const statistics = useMemo(() => {
    if (!analytics) return null;
    return analytics;
  }, [analytics]);

  const diseaseTypeDistribution = useMemo(() => {
    if (!analytics) return [];
    
    return Object.entries(analytics.diseaseTypeDistribution).map(([type, count]) => ({
      type,
      count: count as number,
      percentage: (((count as number) / analytics.totalPatients) * 100).toFixed(1)
    }));
  }, [analytics]);

  const chestPainDistribution = useMemo(() => {
    const cpTypes = ['Typical Angina', 'Atypical Angina', 'Non-Anginal Pain', 'Asymptomatic'];
    const distribution = [2, 3, 2, 3]; // Sample distribution
    
    return cpTypes.map((type, index) => ({
      type,
      count: distribution[index],
      percentage: (distribution[index] / 10 * 100).toFixed(1)
    }));
  }, []);

  const correlationData = useMemo(() => {
    // Sample correlation data
    return [
      { feature: 'Chest Pain Type', correlation: '0.433', absCorrelation: 0.433 },
      { feature: 'Max Heart Rate', correlation: '-0.421', absCorrelation: 0.421 },
      { feature: 'Exercise Angina', correlation: '0.436', absCorrelation: 0.436 },
      { feature: 'ST Depression', correlation: '0.421', absCorrelation: 0.421 },
      { feature: 'Age', correlation: '0.225', absCorrelation: 0.225 }
    ];
  }, []);

  React.useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await database.getAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    // Load analytics immediately and then refresh every 30 seconds
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No data available for analysis</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <BarChart3 className="h-8 w-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Exploratory Data Analysis</h2>
          <p className="text-gray-600">Understanding patterns in heart disease data</p>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalPatients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Heart Disease Rate</p>
              <p className="text-2xl font-bold text-red-600">{statistics.heartDiseaseRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <PieChart className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Age</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.avgAge} years</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Gender Split</p>
              <p className="text-lg font-bold text-gray-900">
                {Math.round((statistics.maleCount / statistics.totalPatients) * 100)}% M / {Math.round((statistics.femaleCount / statistics.totalPatients) * 100)}% F
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Disease Type Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Disease Type Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {diseaseTypeDistribution.map((item, index) => (
            <div key={item.type} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                index === 0 ? 'bg-red-500' : 
                index === 1 ? 'bg-blue-500' : 
                index === 2 ? 'bg-green-500' : 
                index === 3 ? 'bg-yellow-500' :
                index === 4 ? 'bg-purple-500' : 'bg-indigo-500'
              }`}>
                {item.count}
              </div>
              <p className="text-sm font-medium text-gray-700">{item.type}</p>
              <p className="text-xs text-gray-500">{item.percentage}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Age Groups Analysis */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Heart Disease Risk by Age Group</h3>
        <div className="space-y-4">
          {statistics.ageGroupAnalysis.map((group: any) => (
            <div key={group.ageRange} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700 w-16">{group.ageRange}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-6 w-48">
                  <div
                    className="bg-red-500 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                    style={{ width: `${group.riskRate}%` }}
                  >
                    {group.riskRate}%
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {group.withDisease}/{group.total} patients
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chest Pain Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Chest Pain Type Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {chestPainDistribution.map((item, index) => (
            <div key={item.type} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                index === 0 ? 'bg-blue-500' : 
                index === 1 ? 'bg-green-500' : 
                index === 2 ? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                {item.count}
              </div>
              <p className="text-sm font-medium text-gray-700">{item.type}</p>
              <p className="text-xs text-gray-500">{item.percentage}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Correlation */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Correlation with Heart Disease</h3>
        <div className="space-y-3">
          {correlationData.map((item) => (
            <div key={item.feature} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{item.feature}</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full ${
                      parseFloat(item.correlation) > 0 ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${item.absCorrelation * 100}%` }}
                  />
                </div>
                <span className={`text-sm font-medium ${
                  parseFloat(item.correlation) > 0 ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {item.correlation}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-gray-500">
          <p>Positive correlation (red) indicates higher values are associated with heart disease.</p>
          <p>Negative correlation (blue) indicates lower values are associated with heart disease.</p>
        </div>
      </div>

      {/* Risk Factor Analysis */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Factor Prevalence</h3>
        <div className="space-y-3">
          {statistics.riskFactorAnalysis.map((factor: any) => (
            <div key={factor.factor} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 capitalize">
                {factor.factor.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-4">
                  <div className="h-4 rounded-full bg-red-500" style={{ width: `${factor.percentage}%` }} />
                </div>
                <span className="text-sm font-medium text-red-600">{factor.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Quality Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Quality Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">100%</div>
            <p className="text-sm text-gray-600">Data Completeness</p>
            <p className="text-xs text-gray-500">Real-time database</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">13</div>
            <p className="text-sm text-gray-600">Features</p>
            <p className="text-xs text-gray-500">Clinical & lifestyle variables</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">Balanced</div>
            <p className="text-sm text-gray-600">Class Distribution</p>
            <p className="text-xs text-gray-500">Live data updates</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataExploration;