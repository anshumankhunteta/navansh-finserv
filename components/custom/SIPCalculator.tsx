"use client";

import { useState, useMemo } from "react";
import { Calculator } from "lucide-react";

function formatIndianCurrency(num: number): string {
    const formatted = num.toLocaleString("en-IN", {
        maximumFractionDigits: 0,
    });
    return `₹ ${formatted}`;
}

export function SIPCalculator() {
    const [monthlyAmount, setMonthlyAmount] = useState(10000);
    const [returnRate, setReturnRate] = useState(12);
    const [timePeriod, setTimePeriod] = useState(10);

    const calculations = useMemo(() => {
        const monthlyRate = returnRate / 12 / 100;
        const months = timePeriod * 12;
        const investedAmount = monthlyAmount * months;

        // SIP Future Value formula: P × ({[1 + r]^n – 1} / r) × (1 + r)
        const futureValue =
            monthlyAmount *
            ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
            (1 + monthlyRate);

        const estimatedReturns = futureValue - investedAmount;

        return {
            investedAmount: Math.round(investedAmount),
            estimatedReturns: Math.round(estimatedReturns),
            totalValue: Math.round(futureValue),
        };
    }, [monthlyAmount, returnRate, timePeriod]);

    // Calculate percentages for the donut chart
    const investedPercentage =
        (calculations.investedAmount / calculations.totalValue) * 100;

    return (
        <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 sticky top-24">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Calculator className="h-6 w-6" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold">SIP Calculator</h2>
            </div>

            {/* Enter Amount */}
            <div className="mb-6">
                <label className="block text-sm text-muted-foreground mb-2">
                    Enter Amount
                </label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        ₹
                    </span>
                    <input
                        type="number"
                        value={monthlyAmount}
                        onChange={(e) =>
                            setMonthlyAmount(Math.max(500, Number(e.target.value)))
                        }
                        className="w-full pl-8 pr-4 py-3 rounded-lg border border-border bg-background text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50"
                        min="500"
                        max="1000000"
                    />
                </div>
            </div>

            {/* Expected Return Rate Slider */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-muted-foreground">
                        Expected Return Rate (p.a)
                    </label>
                    <div className="px-3 py-1 rounded border border-border bg-muted/50 text-sm font-semibold">
                        {returnRate}%
                    </div>
                </div>
                <input
                    type="range"
                    min="1"
                    max="30"
                    value={returnRate}
                    onChange={(e) => setReturnRate(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1%</span>
                    <span>30%</span>
                </div>
            </div>

            {/* SIP Time Period Slider */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-muted-foreground">
                        SIP time period
                    </label>
                    <div className="px-3 py-1 rounded border border-border bg-muted/50 text-sm font-semibold">
                        {timePeriod} Years
                    </div>
                </div>
                <input
                    type="range"
                    min="1"
                    max="40"
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1 year</span>
                    <span>40 years</span>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border/50 my-6" />

            {/* Results Section */}
            <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground mb-1">
                    The total value of your investment after {timePeriod} Years will be
                </p>
                <p className="text-2xl md:text-3xl font-bold text-primary">
                    {formatIndianCurrency(calculations.totalValue)}
                </p>
            </div>

            {/* Donut Chart and Legend */}
            <div className="flex items-center gap-6">
                {/* Donut Chart */}
                <div className="relative w-24 h-24 shrink-0">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        {/* Background circle */}
                        <circle
                            cx="18"
                            cy="18"
                            r="14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-orange-500"
                        />
                        {/* Invested amount (teal) */}
                        <circle
                            cx="18"
                            cy="18"
                            r="14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeDasharray={`${investedPercentage} ${100 - investedPercentage}`}
                            strokeDashoffset="0"
                            className="text-primary"
                        />
                    </svg>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-primary shrink-0" />
                        <div className="flex-1">
                            <p className="text-xs text-muted-foreground">Invested amount</p>
                            <p className="font-semibold text-sm">
                                {formatIndianCurrency(calculations.investedAmount)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-orange-500 shrink-0" />
                        <div className="flex-1">
                            <p className="text-xs text-muted-foreground">Est. returns</p>
                            <p className="font-semibold text-sm">
                                {formatIndianCurrency(calculations.estimatedReturns)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
