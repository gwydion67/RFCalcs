import React, { useState, ChangeEvent, FormEvent } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calculator } from "lucide-react";

// Define interfaces for the input states
interface SynthesisInputs {
  char_impedance: string;
  elec_length: string;
  dielec_const: string;
  dielect_height: string;
  frequency: string;
}

interface AnalysisInputs {
  width: string;
  length: string;
  dielec_const: string;
  dielect_height: string;
  frequency: string;
}

// Define the shape of the calculation results
interface CalculationResult {
  [key: string]: number;
}

// Props for the ResultCard component
interface ResultCardProps {
  title: string;
  result: CalculationResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, result }) => (
  <Card className="mt-6">
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid gap-2">
        {Object.entries(result).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center">
            <Label className="capitalize">{key.replace(/_/g, " ")}</Label>
            <span className="font-mono">{Number(value).toFixed(6)}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const MicrostripCalculator: React.FC = () => {
  const [synthesisInputs, setSynthesisInputs] = useState<SynthesisInputs>({
    char_impedance: "",
    elec_length: "",
    dielec_const: "",
    dielect_height: "",
    frequency: ""
  });

  const [analysisInputs, setAnalysisInputs] = useState<AnalysisInputs>({
    width: "",
    length: "",
    dielec_const: "",
    dielect_height: "",
    frequency: ""
  });

  const [synthesisResult, setSynthesisResult] = useState<CalculationResult | null>(null);
  const [analysisResult, setAnalysisResult] = useState<CalculationResult | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSynthesisChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSynthesisInputs((prev) => ({
      ...prev,
      [name]: value
    }));
    setError("");
    setSynthesisResult(null);
  };

  const handleAnalysisChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAnalysisInputs((prev) => ({
      ...prev,
      [name]: value
    }));
    setError("");
    setAnalysisResult(null);
  };

  const handleSynthesisSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = {
        char_impedance: parseFloat(synthesisInputs.char_impedance),
        elec_length: parseFloat(synthesisInputs.elec_length),
        dielec_const: parseFloat(synthesisInputs.dielec_const),
        dielect_height: parseFloat(synthesisInputs.dielect_height),
        frequency: parseFloat(synthesisInputs.frequency)
      };

      const response = await fetch("/rfcalc/synthesis-microstrip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Calculation failed");
      }

      const result: CalculationResult = await response.json();
      setSynthesisResult(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalysisSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = {
        width: parseFloat(analysisInputs.width),
        length: parseFloat(analysisInputs.length),
        dielec_const: parseFloat(analysisInputs.dielec_const),
        dielect_height: parseFloat(analysisInputs.dielect_height),
        frequency: parseFloat(analysisInputs.frequency)
      };

      const response = await fetch("/rfcalc/analysis-microstrip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Calculation failed");
      }

      const result: CalculationResult = await response.json();
      setAnalysisResult(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            Microstrip Calculator
          </CardTitle>
          <CardDescription>
            Calculate microstrip transmission line parameters using synthesis or analysis methods
          </CardDescription>
        </CardHeader>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="synthesis">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="synthesis">Synthesis</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="synthesis">
          <Card>
            <CardHeader>
              <CardTitle>Synthesis Calculator</CardTitle>
              <CardDescription>
                Calculate physical dimensions from electrical parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSynthesisSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="char_impedance">Characteristic Impedance (Ω)</Label>
                  <Input
                    id="char_impedance"
                    name="char_impedance"
                    type="number"
                    step="any"
                    required
                    value={synthesisInputs.char_impedance}
                    onChange={handleSynthesisChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="elec_length">Electrical Length (degrees)</Label>
                  <Input
                    id="elec_length"
                    name="elec_length"
                    type="number"
                    step="any"
                    required
                    value={synthesisInputs.elec_length}
                    onChange={handleSynthesisChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dielec_const">Dielectric Constant</Label>
                  <Input
                    id="dielec_const"
                    name="dielec_const"
                    type="number"
                    step="any"
                    required
                    value={synthesisInputs.dielec_const}
                    onChange={handleSynthesisChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dielect_height">Substrate Height (mm)</Label>
                  <Input
                    id="dielect_height"
                    name="dielect_height"
                    type="number"
                    step="any"
                    required
                    value={synthesisInputs.dielect_height}
                    onChange={handleSynthesisChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="frequency">Frequency (Hz)</Label>
                  <Input
                    id="frequency"
                    name="frequency"
                    type="number"
                    step="any"
                    required
                    value={synthesisInputs.frequency}
                    onChange={handleSynthesisChange}
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Calculating..." : "Calculate"}
                </Button>
              </form>
            </CardContent>
          </Card>
          {synthesisResult && (
            <ResultCard title="Synthesis Results" result={synthesisResult} />
          )}
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Calculator</CardTitle>
              <CardDescription>
                Calculate electrical parameters from physical dimensions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAnalysisSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="width">Width (mm)</Label>
                  <Input
                    id="width"
                    name="width"
                    type="number"
                    step="any"
                    required
                    value={analysisInputs.width}
                    onChange={handleAnalysisChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="length">Length (mm)</Label>
                  <Input
                    id="length"
                    name="length"
                    type="number"
                    step="any"
                    required
                    value={analysisInputs.length}
                    onChange={handleAnalysisChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dielec_const">Dielectric Constant</Label>
                  <Input
                    id="dielec_const"
                    name="dielec_const"
                    type="number"
                    step="any"
                    required
                    value={analysisInputs.dielec_const}
                    onChange={handleAnalysisChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dielect_height">Substrate Height (mm)</Label>
                  <Input
                    id="dielect_height"
                    name="dielect_height"
                    type="number"
                    step="any"
                    required
                    value={analysisInputs.dielect_height}
                    onChange={handleAnalysisChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="frequency">Frequency (Hz)</Label>
                  <Input
                    id="frequency"
                    name="frequency"
                    type="number"
                    step="any"
                    required
                    value={analysisInputs.frequency}
                    onChange={handleAnalysisChange}
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Calculating..." : "Calculate"}
                </Button>
              </form>
            </CardContent>
          </Card>
          {analysisResult && (
            <ResultCard title="Analysis Results" result={analysisResult} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MicrostripCalculator;
