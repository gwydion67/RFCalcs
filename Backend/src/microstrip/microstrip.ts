import { api } from "encore.dev/api";
import { validateNumber } from "../common/utils/helpers";
import {
  get_width,
  get_eff_e,
  get_phy_length,
  get_char_impedance,
  get_elec_length,
} from "./methods";
import { MicrostripAnalysisData, MicrostripAnalysisResponse, MicrostripSynthesisData, MicrostripSynthesisResponse } from "./types";

export const synthesisMicrostrip = api(
  { method: "POST", path: "/rfcalc/synthesis-microstrip", expose: true },
  async (
    SynthesisData: MicrostripSynthesisData,
  ): Promise<MicrostripSynthesisResponse> => {
    try {
      // Validate input parameters
      validateNumber(
        SynthesisData.char_impedance,
        "input characteristic impedance",
      );
      validateNumber(SynthesisData.dielec_const, "input dielectric constant");
      validateNumber(SynthesisData.frequency, "input frequency");
      validateNumber(SynthesisData.dielect_height, "input dielectric height");
      validateNumber(SynthesisData.elec_length, "input electrical length");
      validateNumber(SynthesisData.metal_thickness, "input metal thickness");

      const width = get_width({
        dielect_height: SynthesisData.dielect_height,
        metal_thickness: SynthesisData.metal_thickness,
        char_impedance: SynthesisData.char_impedance,
        dielec_const: SynthesisData.dielec_const,
      });
      const eff_dielec_const = get_eff_e(
        SynthesisData.dielec_const,
        SynthesisData.dielect_height,
        width,
      );
      const length = get_phy_length(
        SynthesisData.elec_length,
        eff_dielec_const,
        SynthesisData.frequency,
      );

      return {
        result: {
          width: validateNumber(width, "result width"),
          length: validateNumber(length, "result length"),
          eff_dielec_const: validateNumber(
            eff_dielec_const,
            "result effective dielectric constant",
          ),
        },
      };
    } catch (err) {
      return {
        error: {
          message:
            err instanceof Error ? err.message : "An unknown error occurred",
        },
      };
    }
  },
);

export const analysisMicrostrip = api(
  { method: "POST", path: "/rfcalc/analysis-microstrip", expose: true },
  async (
    AnalysisData: MicrostripAnalysisData,
  ): Promise<MicrostripAnalysisResponse> => {
    try {
      // Validate input parameters
      validateNumber(AnalysisData.dielect_height, "input dielectric height");
      validateNumber(AnalysisData.dielec_const, "input dielectric constant");
      validateNumber(AnalysisData.frequency, "input frequency");
      validateNumber(AnalysisData.length, "input length");
      validateNumber(AnalysisData.width, "input width");

      const eff_dielec_const = get_eff_e(
        AnalysisData.dielec_const,
        AnalysisData.dielect_height,
        AnalysisData.width,
      );
      const char_impedance = get_char_impedance(
        eff_dielec_const,
        AnalysisData.dielect_height,
        AnalysisData.width,
      );
      const elec_length = get_elec_length(
        AnalysisData.length,
        eff_dielec_const,
        AnalysisData.frequency,
      );

      return {
        result: {
          char_impedance: validateNumber(
            char_impedance,
            "result characteristic impedance",
          ),
          elec_length: validateNumber(elec_length, "result electrical length"),
          eff_dielec_const: validateNumber(
            eff_dielec_const,
            "result effective dielectric constant",
          ),
        },
      };
    } catch (err) {
      return {
        error: {
          message:
            err instanceof Error ? err.message : "An unknown error occurred",
        },
      };
    }
  },
);
