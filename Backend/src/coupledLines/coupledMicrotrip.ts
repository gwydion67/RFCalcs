import { api } from "encore.dev/api";
import { ErrorMessage, SubstrateData } from "../microstrip/types";
import { calculate_width_h } from "../microstrip/methods";
import { validateNumber } from "../common/utils/helpers";

interface CMSynthesisData extends SubstrateData {
  char_impedance: number;
  coupling_coefficient: number;
  metal_thickness: number;
}

interface CMSynthesisResult {
  separation: number;
}

interface CMSynthesisRespose {
  result?: CMSynthesisResult;
  error?: ErrorMessage;
}

// Z0e = Z0 * sqrt((1 + C) / (1 - C))
// Z0o = Z0 * sqrt((1 - C) / (1 + C))
// A = Z0 / 60 * sqrt((er + 1) / 2 + (er - 1) / (er + 1) * (0.23 + 0.11 / er))
// Z0se = Z0e / 2
// Z0so = Z0o / 2
// Ase = Z0se / 60 * sqrt((er + 1) / 2 + (er - 1) * (er + 1) * (0.23 + 0.11 / er))
// Aso = Z0so / 60 * sqrt((er + 1) / 2 + (er - 1) * (er + 1) * (0.23 + 0.11 / er))
// W_hse = (8 * exp(Ase)) / (exp(2 * Ase) - 2)
// W_hso = (8 * exp(Aso)) / (exp(2 * Aso) - 2)
// S_h = 1 / pi * acosh((cosh(pi / 2 * W_hse) + cosh(pi / 2 * W_hso) - 2) / (cosh(pi / 2 * W_hso) - cosh(pi / 2 * W_hse)))
// g = cosh(pi * S_h)

export const SynthesisCoupledMicrostrip = api(
  {
    method: "POST",
    path: "/rfcalc/synthesis-coupled-microstrip",
    expose: true,
  },
  async (data: CMSynthesisData): Promise<CMSynthesisRespose> => {
    try {
      let Zoe =
        data.char_impedance *
        Math.sqrt(
          (1 + data.coupling_coefficient) / (1 - data.coupling_coefficient),
        );

      let Zoo =
        data.char_impedance *
        Math.sqrt(
          (1 - data.coupling_coefficient) / (1 + data.coupling_coefficient),
        );
      let Zose = Zoe / 2;
      let Zoso = Zoo / 2;
      let width_hse = calculate_width_h({
        dielec_const: data.dielec_const,
        char_impedance: Zose,
        metal_thickness: data.metal_thickness,
        dielect_height: data.dielect_height,
      });
      let width_hso = calculate_width_h({
        dielec_const: data.dielec_const,
        char_impedance: Zoso,
        metal_thickness: data.metal_thickness,
        dielect_height: data.dielect_height,
      });

      let S_h =
        Math.acosh(
          (Math.cosh((Math.PI / 2) * width_hse) +
            Math.cosh((Math.PI / 2) * width_hso) -
            2) /
            (Math.cosh((Math.PI / 2) * width_hso) -
              Math.cosh((Math.PI / 2) * width_hse)),
        ) / Math.PI;

      let separation = data.dielect_height * S_h;

      return {
        result: {
          separation: validateNumber(separation, "result separation"),
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
