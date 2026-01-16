import React from 'react';
import { LoanProfile, RiskLevel } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle, TrendingUp, DollarSign, User, Activity } from 'lucide-react';

interface AnalysisDashboardProps {
  profile: LoanProfile;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ profile }) => {
  // Data for Income vs Debt Chart
  const financialHealthData = [
    { name: 'Income', amount: profile.income.totalMonthlyIncome },
    { name: 'Debt', amount: profile.liabilities.totalMonthlyDebt },
    { name: 'Disposable', amount: profile.metrics.disposableIncome }
  ];

  const getRiskStyles = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.LOW: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-900/20';
      case RiskLevel.MEDIUM: return 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-900/20';
      case RiskLevel.HIGH: return 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-orange-900/20';
      case RiskLevel.CRITICAL: return 'bg-red-500/10 text-red-400 border-red-500/20 shadow-red-900/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getDecisionBadge = (decision: string) => {
    if (decision === 'APPROVE') return <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/10"><CheckCircle size={16} /> APPROVED</span>;
    if (decision === 'DENY') return <span className="px-4 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 font-bold flex items-center gap-2 shadow-lg shadow-red-500/10"><ShieldAlert size={16} /> DENIED</span>;
    return <span className="px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold flex items-center gap-2 shadow-lg shadow-amber-500/10"><AlertTriangle size={16} /> MANUAL REVIEW</span>;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* Top Stats Cards - Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 backdrop-blur-md p-5 rounded-xl border border-white/10 shadow-lg flex flex-col justify-between hover:border-cyan-500/30 transition-colors">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">Applicant Identity</p>
                    <h3 className="text-lg font-bold text-white tracking-tight">{profile.applicant.fullName}</h3>
                </div>
                <div className="p-2 bg-slate-800 rounded-lg text-cyan-400 border border-white/5">
                    <User size={18} />
                </div>
            </div>
            <p className="text-xs text-slate-400 mt-3 truncate">{profile.applicant.currentAddress}</p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-md p-5 rounded-xl border border-white/10 shadow-lg flex flex-col justify-between hover:border-emerald-500/30 transition-colors">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Monthly Flow</p>
                    <h3 className="text-2xl font-bold text-white tracking-tight">${profile.income.totalMonthlyIncome.toLocaleString()}</h3>
                </div>
                <div className="p-2 bg-slate-800 rounded-lg text-emerald-400 border border-white/5">
                    <TrendingUp size={18} />
                </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">{profile.income.sources.length} Verified Sources</p>
        </div>

         <div className="bg-slate-900/40 backdrop-blur-md p-5 rounded-xl border border-white/10 shadow-lg flex flex-col justify-between hover:border-purple-500/30 transition-colors">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">DTI Ratio</p>
                    <h3 className={`text-2xl font-bold mt-1 tracking-tight ${profile.metrics.debtToIncomeRatio > 43 ? 'text-red-400' : 'text-white'}`}>
                        {profile.metrics.debtToIncomeRatio}%
                    </h3>
                </div>
                <div className="p-2 bg-slate-800 rounded-lg text-purple-400 border border-white/5">
                    <DollarSign size={18} />
                </div>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div 
                    className={`h-full rounded-full ${profile.metrics.debtToIncomeRatio > 43 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`} 
                    style={{ width: `${Math.min(profile.metrics.debtToIncomeRatio, 100)}%` }}
                ></div>
            </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-md p-5 rounded-xl border border-white/10 shadow-lg flex flex-col justify-between hover:border-amber-500/30 transition-colors">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">Risk Vector</p>
                    <h3 className="text-lg font-bold text-white mt-1 capitalize">{profile.riskAssessment.overallRisk}</h3>
                </div>
                 <div className={`p-2 rounded-lg border border-white/5 ${profile.riskAssessment.overallRisk === 'High' || profile.riskAssessment.overallRisk === 'Critical' ? 'text-red-400 bg-red-500/10' : 'text-emerald-400 bg-emerald-500/10'}`}>
                    <ShieldCheck size={18} />
                </div>
            </div>
             <p className="text-xs text-slate-500 mt-2">{profile.riskAssessment.factors.length} Detected Factors</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Analysis Column */}
        <div className="lg:col-span-2 space-y-6">
            {/* Recommendation Box */}
            <div className="bg-slate-900/40 backdrop-blur-md rounded-xl border border-white/10 shadow-lg overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 justify-between items-center relative z-10">
                    <div className="flex items-center gap-3">
                        <Activity className="text-cyan-400" size={20}/>
                        <h3 className="font-semibold text-slate-100">AI Recommendation</h3>
                    </div>
                    {getDecisionBadge(profile.recommendation.decision)}
                </div>
                <div className="p-6 relative z-10">
                    <p className="text-slate-300 leading-relaxed">{profile.recommendation.reasoning}</p>
                     {profile.recommendation.suggestedLoanAmount && (
                         <div className="mt-4 p-4 bg-slate-950/50 rounded-lg border border-white/10 inline-block">
                             <span className="text-sm text-slate-400 font-medium">Suggested Max Loan Capacity:</span>
                             <span className="ml-3 text-lg font-bold text-emerald-400 font-mono">${profile.recommendation.suggestedLoanAmount.toLocaleString()}</span>
                         </div>
                     )}
                </div>
            </div>

            {/* Income Breakdown */}
            <div className="bg-slate-900/40 backdrop-blur-md rounded-xl border border-white/10 shadow-lg p-6">
                <h3 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-emerald-500 rounded-full"></span>
                    Verified Income Sources
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-950/50 text-slate-400 font-medium uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">Source</th>
                                <th className="px-4 py-3">Frequency</th>
                                <th className="px-4 py-3">Validation</th>
                                <th className="px-4 py-3 text-right rounded-r-lg">Monthly Amt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {profile.income.sources.map((source, idx) => (
                                <tr key={idx} className="hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-3 font-medium text-slate-200">{source.source}</td>
                                    <td className="px-4 py-3 text-slate-400">{source.frequency}</td>
                                    <td className="px-4 py-3">
                                        {source.verified ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_#34d399]"></div> Verified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                Unverified
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono text-emerald-300 font-bold">${source.amount.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Risk Assessment */}
            <div className="bg-slate-900/40 backdrop-blur-md rounded-xl border border-white/10 shadow-lg p-6">
                <h3 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-amber-500 rounded-full"></span>
                    Risk Analysis Protocol
                </h3>
                <p className="text-sm text-slate-400 mb-6 bg-slate-950/30 p-4 rounded-lg border border-white/5">{profile.riskAssessment.summary}</p>
                <div className="space-y-3">
                    {profile.riskAssessment.factors.map((factor, idx) => (
                        <div key={idx} className={`p-4 rounded-lg border flex items-start gap-4 ${getRiskStyles(factor.severity as RiskLevel)}`}>
                            <div className="mt-1">
                                {factor.severity === 'Critical' || factor.severity === 'High' ? <AlertTriangle size={18} /> : <ShieldCheck size={18} />}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm flex items-center gap-2">
                                    {factor.factor}
                                    <span className="text-[10px] uppercase border border-current px-1.5 rounded opacity-60">{factor.severity}</span>
                                </h4>
                                <p className="text-sm opacity-90 mt-1">{factor.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Sidebar Visualization */}
        <div className="space-y-6">
            <div className="bg-slate-900/40 backdrop-blur-md rounded-xl border border-white/10 shadow-lg p-6 flex flex-col items-center">
                <h3 className="font-semibold text-slate-100 mb-6 w-full text-left">Financial Metrics</h3>
                <div className="h-64 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={financialHealthData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                            <RechartsTooltip 
                                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                                {financialHealthData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#34d399' : index === 1 ? '#f87171' : '#60a5fa'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl border border-white/10 shadow-lg p-6 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="relative z-10">
                    <h3 className="font-semibold text-white mb-4 border-b border-white/10 pb-2">Liability Summary</h3>
                    <div className="space-y-4">
                        {profile.liabilities.debts.map((debt, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">{debt.type} <span className="text-xs text-slate-500 block">{debt.creditor}</span></span>
                                <span className="font-mono text-slate-200">${debt.amount.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center font-bold">
                        <span className="text-sm uppercase tracking-wider text-slate-400">Total Obligation</span>
                        <span className="text-red-400 font-mono text-lg">${profile.liabilities.totalMonthlyDebt.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;