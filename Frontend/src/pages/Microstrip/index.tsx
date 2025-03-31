import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

/* 
  ----------------------------------------------------------------------------
  Unit conversion dictionaries 
  ----------------------------------------------------------------------------
*/
const frequencyUnits: Record<string, number> = {
  Hz: 1,
  kHz: 1e3,
  MHz: 1e6,
  GHz: 1e9,
};

const lengthUnits: Record<string, number> = {
  m: 1,
  cm: 1e-2,
  mm: 1e-3,
  um: 1e-6,
  in: 0.0254,
  mil: 2.54e-5,
};

interface MicrostripSynthesisResult {
  width: number;
  length: number;
  eff_dielec_const: number;
}

interface MicrostripAnalysisResult {
  char_impedance: number;
  elec_length: number;
  eff_dielec_const: number;
}

interface ErrorMessage {
  message: any;
}

interface MicrostripSynthesisResponse {
  result?: MicrostripSynthesisResult;
  error?: ErrorMessage;
}

interface MicrostripAnalysisResponse {
  result?: MicrostripAnalysisResult;
  error?: ErrorMessage;
}
const BASE_URL = import.meta.env.VITE_BASE_URL;

function convertToSI(
  value: number,
  unit: string,
  conversionDict: Record<string, number>,
): number {
  const factor = conversionDict[unit];
  return value * factor;
}

export default function MicrostripCalculatorPage() {
  // ------------------------- Substrate Parameters (Shared) -------------------------
  const [subDielecConst, setSubDielecConst] = useState("");
  const [subDielectHeight, setSubDielectHeight] = useState("");
  const [subDielectHeightUnit, setSubDielectHeightUnit] = useState("mm");
  const [subMetalThickness, setSubMetalThickness] = useState("");
  const [subMetalThicknessUnit, setSubMetalThicknessUnit] = useState("um");

  // ------------------------- Synthesis Form State -------------------------
  const [synthFrequency, setSynthFrequency] = useState("");
  const [synthFrequencyUnit, setSynthFrequencyUnit] = useState("GHz");
  const [synthCharImpedance, setSynthCharImpedance] = useState("");
  const [synthElecLength, setSynthElecLength] = useState("");

  // Synthesis Results
  const [synthWidth, setSynthWidth] = useState<number | undefined>(undefined);
  const [synthLength, setSynthLength] = useState<number | undefined>(undefined);
  const [synthEffDielec, setSynthEffDielec] = useState<number | undefined>(
    undefined,
  );
  const [synthError, setSynthError] = useState<string | undefined>(undefined);

  // ------------------------- Analysis Form State -------------------------
  const [analysisFrequency, setAnalysisFrequency] = useState("");
  const [analysisFrequencyUnit, setAnalysisFrequencyUnit] = useState("GHz");
  const [analysisLength, setAnalysisLength] = useState("");
  const [analysisLengthUnit, setAnalysisLengthUnit] = useState("mm");
  const [analysisWidth, setAnalysisWidth] = useState("");
  const [analysisWidthUnit, setAnalysisWidthUnit] = useState("mm");

  // Analysis Results
  const [analysisCharImpedance, setAnalysisCharImpedance] = useState<
    number | undefined
  >(undefined);
  const [analysisElecLength, setAnalysisElecLength] = useState<
    number | undefined
  >(undefined);
  const [analysisEffDielec, setAnalysisEffDielec] = useState<
    number | undefined
  >(undefined);
  const [analysisError, setAnalysisError] = useState<string | undefined>(
    undefined,
  );

  // ------------------------- Tabs State -------------------------
  const [activeTab, setActiveTab] = useState("synthesis");

  // ----------------------------------------------------------------------------
  // Handler: Synthesis
  // ----------------------------------------------------------------------------
  async function handleSynthesis() {
    try {
      setSynthError(undefined);

      // Convert substrate parameters
      const dielec_const = parseFloat(subDielecConst);
      const dielect_height = convertToSI(
        parseFloat(subDielectHeight),
        subDielectHeightUnit,
        lengthUnits,
      );
      const metal_thickness = convertToSI(
        parseFloat(subMetalThickness),
        subMetalThicknessUnit,
        lengthUnits,
      );

      // Convert synthesis-specific parameters
      const frequency = convertToSI(
        parseFloat(synthFrequency),
        synthFrequencyUnit,
        frequencyUnits,
      );
      const char_impedance = parseFloat(synthCharImpedance);
      const elec_length = parseFloat(synthElecLength);

      const body = {
        dielec_const,
        dielect_height,
        metal_thickness,
        frequency,
        char_impedance,
        elec_length,
      };

      const response = await fetch(BASE_URL + "/rfcalc/synthesis-microstrip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      const result: MicrostripSynthesisResponse = await response.json();
      console.log(result);
      setSynthWidth(result?.result?.width);
      setSynthLength(result?.result?.length);
      setSynthEffDielec(result?.result?.eff_dielec_const);
    } catch (err: any) {
      setSynthError(
        err.message || "An error occurred during synthesis calculation.",
      );
    }
  }

  // ----------------------------------------------------------------------------
  // Handler: Analysis
  // ----------------------------------------------------------------------------
  async function handleAnalysis() {
    try {
      setAnalysisError(undefined);

      // Convert substrate parameters
      const dielec_const = parseFloat(subDielecConst);
      const dielect_height = convertToSI(
        parseFloat(subDielectHeight),
        subDielectHeightUnit,
        lengthUnits,
      );
      const metal_thickness = convertToSI(
        parseFloat(subMetalThickness),
        subMetalThicknessUnit,
        lengthUnits,
      );

      // Convert analysis-specific parameters
      const frequency = convertToSI(
        parseFloat(analysisFrequency),
        analysisFrequencyUnit,
        frequencyUnits,
      );
      const length = convertToSI(
        parseFloat(analysisLength),
        analysisLengthUnit,
        lengthUnits,
      );
      const width = convertToSI(
        parseFloat(analysisWidth),
        analysisWidthUnit,
        lengthUnits,
      );

      const body = {
        dielec_const,
        dielect_height,
        metal_thickness, // can be passed if your analysis requires it
        frequency,
        length,
        width,
      };
      const response = await fetch(BASE_URL + "/rfcalc/analysis-microstrip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const result: MicrostripAnalysisResponse = await response.json();
      setAnalysisCharImpedance(result?.result?.char_impedance);
      setAnalysisElecLength(result?.result?.elec_length);
      setAnalysisEffDielec(result?.result?.eff_dielec_const);
    } catch (err: any) {
      setAnalysisError(
        err.message || "An error occurred during analysis calculation.",
      );
    }
  }

  // ----------------------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------------------
  return (
    <div className="container max-w-3xl mx-auto p-4">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-center">Microstrip Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          {/* ======================== Substrate Parameters ======================== */}
          <div className="mb-6">
            <h2 className="font-semibold mb-4 text-lg">
              Substrate (Dielectric) Parameters
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Dielectric Constant */}
              <div>
                <Label htmlFor="subDielecConst">Dielectric Constant (εr)</Label>
                <Input
                  id="subDielecConst"
                  type="number"
                  step="any"
                  placeholder="e.g. 4.4"
                  value={subDielecConst}
                  onChange={(e) => setSubDielecConst(e.target.value)}
                />
              </div>

              {/* Dielectric Height */}
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Label htmlFor="subDielectHeight">Dielectric Height</Label>
                  <Input
                    id="subDielectHeight"
                    type="number"
                    step="any"
                    placeholder="e.g. 1.6"
                    value={subDielectHeight}
                    onChange={(e) => setSubDielectHeight(e.target.value)}
                  />
                </div>
                <div className="w-28">
                  <Label>Unit</Label>
                  <Select
                    value={subDielectHeightUnit}
                    onValueChange={setSubDielectHeightUnit}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(lengthUnits).map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Metal Thickness */}
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Label htmlFor="subMetalThickness">Metal Thickness</Label>
                  <Input
                    id="subMetalThickness"
                    type="number"
                    step="any"
                    placeholder="e.g. 35"
                    value={subMetalThickness}
                    onChange={(e) => setSubMetalThickness(e.target.value)}
                  />
                </div>
                <div className="w-28">
                  <Label>Unit</Label>
                  <Select
                    value={subMetalThicknessUnit}
                    onValueChange={setSubMetalThicknessUnit}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(lengthUnits).map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* ======================== Tabs for Synthesis / Analysis ======================== */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="synthesis">Synthesis</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            {/* ======================== SYNTHESIS TAB ======================== */}
            <TabsContent value="synthesis">
              <AnimatePresence mode="wait">
                {activeTab === "synthesis" && (
                  <motion.div
                    key="synthesis-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Frequency */}
                      <div className="flex space-x-2">
                        <div className="flex-1">
                          <Label htmlFor="synthFrequency">Frequency</Label>
                          <Input
                            id="synthFrequency"
                            type="number"
                            step="any"
                            placeholder="e.g. 2.45"
                            value={synthFrequency}
                            onChange={(e) => setSynthFrequency(e.target.value)}
                          />
                        </div>
                        <div className="w-28">
                          <Label>Unit</Label>
                          <Select
                            value={synthFrequencyUnit}
                            onValueChange={setSynthFrequencyUnit}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(frequencyUnits).map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Characteristic Impedance */}
                      <div>
                        <Label htmlFor="synthCharImpedance">
                          Characteristic Impedance (Ω)
                        </Label>
                        <Input
                          id="synthCharImpedance"
                          type="number"
                          step="any"
                          placeholder="e.g. 50"
                          value={synthCharImpedance}
                          onChange={(e) =>
                            setSynthCharImpedance(e.target.value)
                          }
                        />
                      </div>

                      {/* Electrical Length */}
                      <div>
                        <Label htmlFor="synthElecLength">
                          Electrical Length (°)
                        </Label>
                        <Input
                          id="synthElecLength"
                          type="number"
                          step="any"
                          placeholder="e.g. 90"
                          value={synthElecLength}
                          onChange={(e) => setSynthElecLength(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button onClick={handleSynthesis}>
                        Calculate Synthesis
                      </Button>
                    </div>

                    {/* Synthesis Results */}
                    {synthError && (
                      <p className="mt-2 text-red-500 text-sm">{synthError}</p>
                    )}
                    {synthWidth !== null &&
                      synthLength !== null &&
                      synthEffDielec !== null && (
                        <div className="mt-4 p-4 rounded-md border">
                          <h3 className="font-semibold mb-2">
                            Synthesis Results
                          </h3>
                          <p>Width: {synthWidth?.toExponential(5)} m</p>
                          <p>Length: {synthLength?.toExponential(5)} m</p>
                          <p>
                            Effective Dielectric Constant:{" "}
                            {synthEffDielec?.toFixed(5)}
                          </p>
                        </div>
                      )}
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>

            {/* ======================== ANALYSIS TAB ======================== */}
            <TabsContent value="analysis">
              <AnimatePresence mode="wait">
                {activeTab === "analysis" && (
                  <motion.div
                    key="analysis-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Frequency */}
                      <div className="flex space-x-2">
                        <div className="flex-1">
                          <Label htmlFor="analysisFrequency">Frequency</Label>
                          <Input
                            id="analysisFrequency"
                            type="number"
                            step="any"
                            placeholder="e.g. 2.45"
                            value={analysisFrequency}
                            onChange={(e) =>
                              setAnalysisFrequency(e.target.value)
                            }
                          />
                        </div>
                        <div className="w-28">
                          <Label>Unit</Label>
                          <Select
                            value={analysisFrequencyUnit}
                            onValueChange={setAnalysisFrequencyUnit}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(frequencyUnits).map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Physical Length */}
                      <div className="flex space-x-2">
                        <div className="flex-1">
                          <Label htmlFor="analysisLength">
                            Physical Length
                          </Label>
                          <Input
                            id="analysisLength"
                            type="number"
                            step="any"
                            placeholder="e.g. 10"
                            value={analysisLength}
                            onChange={(e) => setAnalysisLength(e.target.value)}
                          />
                        </div>
                        <div className="w-28">
                          <Label>Unit</Label>
                          <Select
                            value={analysisLengthUnit}
                            onValueChange={setAnalysisLengthUnit}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(lengthUnits).map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Width */}
                      <div className="flex space-x-2">
                        <div className="flex-1">
                          <Label htmlFor="analysisWidth">Width</Label>
                          <Input
                            id="analysisWidth"
                            type="number"
                            step="any"
                            placeholder="e.g. 3"
                            value={analysisWidth}
                            onChange={(e) => setAnalysisWidth(e.target.value)}
                          />
                        </div>
                        <div className="w-28">
                          <Label>Unit</Label>
                          <Select
                            value={analysisWidthUnit}
                            onValueChange={setAnalysisWidthUnit}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(lengthUnits).map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button onClick={handleAnalysis}>
                        Calculate Analysis
                      </Button>
                    </div>

                    {/* Analysis Results */}
                    {analysisError && (
                      <p className="mt-2 text-red-500 text-sm">
                        {analysisError}
                      </p>
                    )}
                    {analysisCharImpedance !== null &&
                      analysisElecLength !== null &&
                      analysisEffDielec !== null && (
                        <div className="mt-4 p-4 rounded-md border">
                          <h3 className="font-semibold mb-2">
                            Analysis Results
                          </h3>
                          <p>
                            Characteristic Impedance:{" "}
                            {analysisCharImpedance?.toFixed(5)} Ω
                          </p>
                          <p>
                            Electrical Length: {analysisElecLength?.toFixed(5)}{" "}
                            °
                          </p>
                          <p>
                            Effective Dielectric Constant:{" "}
                            {analysisEffDielec?.toFixed(5)}
                          </p>
                        </div>
                      )}
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
