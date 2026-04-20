import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface AICaptionGeneratorProps {
  onApply: (caption: string, hashtags: string[]) => void;
  clubName: string;
}

export function AICaptionGenerator({ onApply, clubName }: AICaptionGeneratorProps) {
  const [input, setInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ caption: string; hashtags: string[] } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!input.trim()) {
      toast.error("Veuillez saisir un texte ou une description pour la génération.");
      return;
    }
    setGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setResult({
        caption: `🎓 ${clubName} présente : ${input.trim().slice(0, 80)}${input.length > 80 ? "…" : ""} — Rejoignez-nous et vivez l'expérience !`,
        hashtags: ["#ISETRades", `#${clubName.replace(/\s+/g, "")}`, "#VieEtudiante", "#ClubsUniversitaires", "#Innovation", "#Tunisie"].slice(0, 7),
      });
      setGenerating(false);
    }, 1500);
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `${result.caption}\n\n${result.hashtags.join(" ")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-accent/20 bg-accent/5 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4.5 h-4.5 text-accent" />
        <h3 className="font-heading font-semibold text-sm text-foreground">Assistant IA — Caption & Hashtags</h3>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="ai-input" className="text-sm">Décrivez votre annonce ou événement</Label>
        <Textarea
          id="ai-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ex : Atelier Arduino pour débutants le 8 mars, venez apprendre à programmer des microcontrôleurs…"
          rows={3}
        />
      </div>

      <Button
        variant="accent"
        size="sm"
        className="gap-2"
        onClick={handleGenerate}
        disabled={generating || !input.trim()}
      >
        {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {generating ? "Génération en cours…" : "Générer avec IA"}
      </Button>

      {result && (
        <div className="mt-4 space-y-3 border-t border-accent/10 pt-4">
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Caption générée</Label>
            <p className="text-sm text-foreground mt-1 bg-card p-3 rounded-lg border border-border">{result.caption}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Hashtags suggérés</Label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {result.hashtags.map((tag) => (
                <span key={tag} className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-md font-medium">{tag}</span>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button size="sm" variant="accent" onClick={() => onApply(result.caption, result.hashtags)}>
              Utiliser cette suggestion
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={handleCopy}>
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copié" : "Copier"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
