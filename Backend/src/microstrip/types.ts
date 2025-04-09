export interface ErrorMessage {
  message: any;
}

export interface SubstrateData {
  dielec_const: number;
  dielect_height: number;
  frequency: number;
}

export interface MicrostripSynthesisData extends SubstrateData {
  metal_thickness: number;
  char_impedance: number;
  elec_length: number;
}

export interface MicrostripAnalysisData extends SubstrateData {
  width: number;
  length: number;
}

export interface MicrostripSynthesisResult {
  width: number;
  length: number;
  eff_dielec_const: number;
}

export interface MicrostripAnalysisResult {
  char_impedance: number;
  elec_length: number;
  eff_dielec_const: number;
}

export interface MicrostripSynthesisResponse {
  result?: MicrostripSynthesisResult;
  error?: ErrorMessage;
}

export interface MicrostripAnalysisResponse {
  result?: MicrostripAnalysisResult;
  error?: ErrorMessage;
}
