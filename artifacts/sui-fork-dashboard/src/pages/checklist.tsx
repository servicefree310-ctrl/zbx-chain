import React from "react";
import { useChecklist } from "@/hooks/useChecklist";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Checklist() {
  const { items, toggleItem, progress } = useChecklist();

  // Group items by category
  const categories = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
          Launch Checklist
        </h1>
        <p className="text-lg text-muted-foreground">
          Track your progress towards mainnet launch. State is saved locally.
        </p>
      </div>

      <div className="mb-8 p-6 bg-card border border-border rounded-lg shadow-sm">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-2xl font-bold text-primary">{progress}%</h3>
            <p className="text-sm text-muted-foreground">Overall Readiness</p>
          </div>
        </div>
        <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(categories).map(([category, catItems]) => {
          const catProgress = Math.round((catItems.filter(i => i.completed).length / catItems.length) * 100);
          
          return (
            <div key={category} className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h2 className="text-xl font-semibold">{category}</h2>
                <span className="text-sm font-mono text-muted-foreground">{catProgress}%</span>
              </div>
              <div className="space-y-3">
                {catItems.map((item) => (
                  <div 
                    key={item.id} 
                    className={`flex items-start space-x-3 p-3 rounded-md transition-colors ${
                      item.completed ? "bg-primary/5 border border-primary/20" : "bg-card/30 border border-transparent hover:bg-card/80"
                    }`}
                  >
                    <Checkbox 
                      id={item.id} 
                      checked={item.completed}
                      onCheckedChange={() => toggleItem(item.id)}
                      className="mt-1"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor={item.id}
                        className={`text-base cursor-pointer ${
                          item.completed ? "text-muted-foreground line-through" : "text-foreground font-medium"
                        }`}
                      >
                        {item.text}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
