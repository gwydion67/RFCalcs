interface ErrorMessage {
  message: any;
}

interface SubstrateData {
  dielec_const: number;
  dielect_height: number;
  frequency: number;
}

interface MicrostripSynthesisData extends SubstrateData {
  metal_thickness: number;
  char_impedance: number;
  elec_length: number;
}

interface MicrostripAnalysisData extends SubstrateData {
  width: number;
  length: number;
}

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

interface MicrostripSynthesisResponse {
  result?: MicrostripSynthesisResult;
  error?: ErrorMessage;
}

interface MicrostripAnalysisResponse {
  result?: MicrostripAnalysisResult;
  error?: ErrorMessage;
}
