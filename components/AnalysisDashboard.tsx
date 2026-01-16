import React from 'react';
import { LoanProfile, RiskLevel, Theme } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle, TrendingUp, DollarSign, User, Activity } from 'lucide-react';

interface AnalysisDashboardProps {
  profile: LoanProfile;
  theme: Theme;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ profile, theme }) => {
  const isSpace = theme === 'space';

  // Data for Income vs Debt Chart
  const financialHealthData = [
    { name: 'Income', amount: profile.income.totalMonthlyIncome },
    { name: 'Debt', amount: profile.liabilities.totalMonthlyDebt },
    { name: 'Disposable', amount: profile.metrics.disposableIncome }
  ];

  const getRiskStyles = (level: RiskLevel) => {
    if (isSpace) {
        switch (level) {
        case RiskLevel.LOW: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-900/20';
        case RiskLevel.MEDIUM: return 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-900/20';
        case RiskLevel.HIGH: return 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-orange-900/20';
        case RiskLevel.CRITICAL: return 'bg-red-500/10 text-red-400 border-red-500/20 shadow-red-900/20';
        default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    } else {
        switch (level) {
        case RiskLevel.LOW: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        case RiskLevel.MEDIUM: return 'bg-amber-100 text-amber-800 border-amber-200';
        case RiskLevel.HIGH: return 'bg-orange-100 text-orange-800 border-orange-200';
        case RiskLevel.CRITICAL: return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-gray-100 text-gray-800';
        }
    }
  };

  const getDecisionBadge = (decision: string) => {
    if (isSpace) {
        if (decision === 'APPROVE') return <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/10"><CheckCircle size={16} /> APPROVED</span>;
        if (decision === 'DENY') return <span className="px-4 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 font-bold flex items-center gap-2 shadow-lg shadow-red-500/10"><ShieldAlert size={16} /> DENIED</span>;
        return <span className="px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold flex items-center gap-2 shadow-lg shadow-amber-500/10"><AlertTriangle size={16} /> MANUAL REVIEW</span>;
    } else {
        if (decision === 'APPROVE') return <span className="px-4 py-2 rounded-full bg-green-600 text-white font-bold flex items-center gap-2"><CheckCircle size={18} /> APPROVED</span>;
        if (decision === 'DENY') return <span className="px-4 py-2 rounded-full bg-red-600 text-white font-bold flex items-center gap-2"><ShieldAlert size={18} /> DENIED</span>;
        return <span className="px-4 py-2 rounded-full bg-amber-500 text-white font-bold flex items-center gap-2"><AlertTriangle size={18} /> MANUAL REVIEW</span>;
    }
  };

  // Card classes
  const cardClass = isSpace 
    ? 'bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-lg' 
    : 'bg-white border border-slate-200 shadow-sm';
  
  const textTitle = isSpace ? 'text-white' : 'text-slate-800';
  const textSub = isSpace ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Applicant Card */}
        <div className={`${cardClass} p-5 rounded-xl flex flex-col justify-between hover:border-cyan-500/30 transition-colors`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isSpace ? 'text-cyan-400' : 'text-slate-500'}`}>Applicant Identity</p>
                    <h3 className={`text-lg font-bold ${textTitle} tracking-tight`}>{profile.applicant.fullName}</h3>
                </div>
                <div className={`p-2 rounded-lg ${isSpace ? 'bg-slate-800 text-cyan-400 border border-white/5' : 'bg-blue-50 text-blue-600'}`}>
                    <User size={18} />
                </div>
            </div>
            <p className={`text-xs mt-3 truncate ${textSub}`}>{profile.applicant.currentAddress}</p>
        </div>

        {/* Income Card */}
        <div className={`${cardClass} p-5 rounded-xl flex flex-col justify-between hover:border-emerald-500/30 transition-colors`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isSpace ? 'text-emerald-400' : 'text-slate-500'}`}>Monthly Flow</p>
                    <h3 className={`text-2xl font-bold ${textTitle} tracking-tight`}>${profile.income.totalMonthlyIncome.toLocaleString()}</h3>
                </div>
                <div className={`p-2 rounded-lg ${isSpace ? 'bg-slate-800 text-emerald-400 border border-white/5' : 'bg-emerald-50 text-emerald-600'}`}>
                    <TrendingUp size={18} />
                </div>
            </div>
            <p className={`text-xs mt-2 ${textSub}`}>{profile.income.sources.length} Verified Sources</p>
        </div>

        {/* DTI Card */}
         <div className={`${cardClass} p-5 rounded-xl flex flex-col justify-between hover:border-purple-500/30 transition-colors`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isSpace ? 'text-purple-400' : 'text-slate-500'}`}>DTI Ratio</p>
                    <h3 className={`text-2xl font-bold mt-1 tracking-tight ${profile.metrics.debtToIncomeRatio > 43 ? (isSpace ? 'text-red-400' : 'text-red-600') : textTitle}`}>
                        {profile.metrics.debtToIncomeRatio}%
                    </h3>
                </div>
                <div className={`p-2 rounded-lg ${isSpace ? 'bg-slate-800 text-purple-400 border border-white/5' : 'bg-purple-50 text-purple-600'}`}>
                    <DollarSign size={18} />
                </div>
            </div>
            <div className={`w-full h-1.5 rounded-full mt-3 overflow-hidden ${isSpace ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <div 
                    className={`h-full rounded-full ${
                        profile.metrics.debtToIncomeRatio > 43 
                            ? (isSpace ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-red-500') 
                            : (isSpace ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-green-500')
                    }`} 
                    style={{ width: `${Math.min(profile.metrics.debtToIncomeRatio, 100)}%` }}
                ></div>
            </div>
        </div>

        {/* Risk Card */}
        <div className={`${cardClass} p-5 rounded-xl flex flex-col justify-between hover:border-amber-500/30 transition-colors`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isSpace ? 'text-amber-400' : 'text-slate-500'}`}>Risk Vector</p>
                    <h3 className={`text-lg font-bold mt-1 capitalize ${textTitle}`}>{profile.riskAssessment.overallRisk}</h3>
                </div>
                 <div className={`p-2 rounded-lg ${isSpace ? 'border border-white/5' : ''} ${
                     isSpace 
                        ? (profile.riskAssessment.overallRisk === 'High' || profile.riskAssessment.overallRisk === 'Critical' ? 'text-red-400 bg-red-500/10' : 'text-emerald-400 bg-emerald-500/10')
                        : getRiskStyles(profile.riskAssessment.overallRisk as RiskLevel).split(' ')[0] + ' ' + getRiskStyles(profile.riskAssessment.overallRisk as RiskLevel).split(' ')[1]
                    }`}>
                    <ShieldCheck size={18} />
                </div>
            </div>
             <p className={`text-xs mt-2 ${textSub}`}>{profile.riskAssessment.factors.length} Detected Factors</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Analysis Column */}
        <div className="lg:col-span-2 space-y-6">
            {/* Recommendation Box */}
            <div className={`${cardClass} rounded-xl overflow-hidden relative group`}>
                {isSpace && <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>}
                <div className={`p-6 flex flex-wrap gap-4 justify-between items-center relative z-10 ${isSpace ? 'border-b border-white/5' : 'border-b border-slate-100'}`}>
                    <div className="flex items-center gap-3">
                        <Activity className={isSpace ? "text-cyan-400" : "text-blue-600"} size={20}/>
                        <h3 className={`font-semibold ${textTitle}`}>AI Recommendation</h3>
                    </div>
                    {getDecisionBadge(profile.recommendation.decision)}
                </div>
                <div className="p-6 relative z-10">
                    <p className={`${isSpace ? 'text-slate-300' : 'text-slate-700'} leading-relaxed`}>{profile.recommendation.reasoning}</p>
                     {profile.recommendation.suggestedLoanAmount && (
                         <div className={`mt-4 p-4 rounded-lg inline-block ${isSpace ? 'bg-slate-950/50 border border-white/10' : 'bg-slate-50 border border-slate-200'}`}>
                             <span className={`text-sm font-medium ${textSub}`}>Suggested Max Loan Capacity:</span>
                             <span className={`ml-3 text-lg font-bold font-mono ${isSpace ? 'text-emerald-400' : 'text-slate-900'}`}>${profile.recommendation.suggestedLoanAmount.toLocaleString()}</span>
                         </div>
                     )}
                </div>
            </div>

            {/* Income Breakdown */}
            <div className={`${cardClass} rounded-xl p-6`}>
                <h3 className={`font-semibold mb-4 flex items-center gap-2 ${textTitle}`}>
                    <span className={`w-1 h-5 rounded-full ${isSpace ? 'bg-emerald-500' : 'bg-green-500'}`}></span>
                    Verified Income Sources
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className={`font-medium uppercase text-xs tracking-wider ${isSpace ? 'bg-slate-950/50 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">Source</th>
                                <th className="px-4 py-3">Frequency</th>
                                <th className="px-4 py-3">Validation</th>
                                <th className="px-4 py-3 text-right rounded-r-lg">Monthly Amt</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isSpace ? 'divide-white/5' : 'divide-slate-100'}`}>
                            {profile.income.sources.map((source, idx) => (
                                <tr key={idx} className={isSpace ? 'hover:bg-white/5 transition-colors' : ''}>
                                    <td className={`px-4 py-3 font-medium ${isSpace ? 'text-slate-200' : 'text-slate-800'}`}>{source.source}</td>
                                    <td className={`px-4 py-3 ${isSpace ? 'text-slate-400' : 'text-slate-600'}`}>{source.frequency}</td>
                                    <td className="px-4 py-3">
                                        {source.verified ? (
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${isSpace ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-green-100 text-green-700'}`}>
                                                {isSpace && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_#34d399]"></div>} Verified
                                            </span>
                                        ) : (
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${isSpace ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-amber-100 text-amber-700'}`}>
                                                Unverified
                                            </span>
                                        )}
                                    </td>
                                    <td className={`px-4 py-3 text-right font-mono font-bold ${isSpace ? 'text-emerald-300' : 'text-slate-700'}`}>${source.amount.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Risk Assessment */}
            <div className={`${cardClass} rounded-xl p-6`}>
                <h3 className={`font-semibold mb-4 flex items-center gap-2 ${textTitle}`}>
                    <span className={`w-1 h-5 rounded-full ${isSpace ? 'bg-amber-500' : 'bg-amber-500'}`}></span>
                    Risk Analysis Protocol
                </h3>
                <p className={`text-sm mb-6 p-4 rounded-lg ${isSpace ? 'text-slate-400 bg-slate-950/30 border border-white/5' : 'text-slate-600'}`}>
                    {profile.riskAssessment.summary}
                </p>
                <div className="space-y-3">
                    {profile.riskAssessment.factors.map((factor, idx) => (
                        <div key={idx} className={`p-4 rounded-lg border flex items-start gap-4 ${getRiskStyles(factor.severity as RiskLevel)}`}>
                            <div className="mt-1">
                                {factor.severity === 'Critical' || factor.severity === 'High' ? <AlertTriangle size={18} /> : <ShieldCheck size={18} />}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm flex items-center gap-2">
                                    {factor.factor}
                                    {isSpace && <span className="text-[10px] uppercase border border-current px-1.5 rounded opacity-60">{factor.severity}</span>}
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
            <div className={`${cardClass} rounded-xl p-6 flex flex-col items-center`}>
                <h3 className={`font-semibold mb-6 w-full text-left ${textTitle}`}>Financial Metrics</h3>
                <div className="h-64 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={financialHealthData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <XAxis dataKey="name" stroke={isSpace ? "#64748b" : "#94a3b8"} fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke={isSpace ? "#64748b" : "#94a3b8"} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                            <RechartsTooltip 
                                contentStyle={isSpace 
                                    ? { backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }
                                    : { borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }
                                }
                                cursor={{ fill: isSpace ? 'rgba(255,255,255,0.05)' : '#f1f5f9' }}
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
            
            <div className={`rounded-xl border shadow-lg p-6 text-white relative overflow-hidden group ${isSpace ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-white/10' : 'bg-slate-900 border-slate-900'}`}>
                {isSpace && <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none"></div>}
                <div className="relative z-10">
                    <h3 className={`font-semibold text-white mb-4 border-b pb-2 ${isSpace ? 'border-white/10' : 'border-slate-700'}`}>Liability Summary</h3>
                    <div className="space-y-4">
                        {profile.liabilities.debts.map((debt, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                                <span className={isSpace ? 'text-slate-400' : 'text-slate-300'}>{debt.type} <span className="text-xs text-slate-500 block">{debt.creditor}</span></span>
                                <span className="font-mono text-slate-200">${debt.amount.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                    <div className={`mt-6 pt-4 border-t flex justify-between items-center font-bold ${isSpace ? 'border-white/10' : 'border-slate-700'}`}>
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