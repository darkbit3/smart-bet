import { X, Trash2 } from "lucide-react";
import { useState } from "react";

interface Bet {
  id: string;
  title: string;
  selection: string;
  odds: string;
  stake: number;
}

interface BetSlipProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BetSlip({ isOpen, onClose }: BetSlipProps) {
  const [bets, setBets] = useState<Bet[]>([
    {
      id: "1",
      title: "Man United vs Liverpool",
      selection: "Man United to Win",
      odds: "2.40",
      stake: 50,
    },
  ]);

  const totalStake = bets.reduce((sum, bet) => sum + bet.stake, 0);
  const potentialWin = bets.reduce((sum, bet) => sum + bet.stake * parseFloat(bet.odds), 0);

  const removeBet = (id: string) => {
    setBets(bets.filter(bet => bet.id !== id));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Bet Slip */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-card border-l border-border z-50 flex flex-col md:relative md:border md:rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">Bet Slip</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bets List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {bets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Your bet slip is empty</p>
              <p className="text-sm text-muted-foreground/70 mt-2">Add selections to get started</p>
            </div>
          ) : (
            bets.map((bet) => (
              <div
                key={bet.id}
                className="bg-secondary border border-border rounded-lg p-3 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">{bet.title}</div>
                    <div className="text-sm font-semibold text-foreground">{bet.selection}</div>
                  </div>
                  <button
                    onClick={() => removeBet(bet.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground block mb-1">Stake</label>
                    <input
                      type="number"
                      value={bet.stake}
                      onChange={(e) => {
                        const newStake = parseFloat(e.target.value) || 0;
                        setBets(bets.map(b => b.id === bet.id ? { ...b, stake: newStake } : b));
                      }}
                      className="w-full bg-card border border-border rounded px-2 py-1 text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                  <div className="ml-3 text-right">
                    <div className="text-xs text-muted-foreground">Odds</div>
                    <div className="text-lg font-bold text-primary">{bet.odds}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        {bets.length > 0 && (
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Stake</span>
              <span className="text-foreground font-semibold">${totalStake.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Potential Win</span>
              <span className="text-primary font-bold text-xl">${potentialWin.toFixed(2)}</span>
            </div>
            <button className="w-full bg-primary hover:bg-primary-dark text-primary-foreground py-3 rounded-lg font-bold transition-colors shadow-md hover:shadow-lg">
              Place Bet
            </button>
          </div>
        )}
      </div>
    </>
  );
}
