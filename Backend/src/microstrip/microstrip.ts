import { api } from "encore.dev/api";

// Helper function to validate number is finite and within safe range
function validateNumber(value: number, name: string): number {
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid ${name}: Result is not a finite number`);
  }
  // Check if number is within safe integer range
  if (Math.abs(value) > Number.MAX_SAFE_INTEGER) {
    throw new Error(`${name} exceeds safe number range`);
  }
  return value;
}

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
const get_H_dash = (char_impedance: number, dielec_const: number): number => {
  let z0 = validateNumber(char_impedance, "characteristic impedance");
  let er = validateNumber(dielec_const, "dielectric constant");
  let H =
    (z0 * Math.sqrt(2 * (er + 1))) / 119.9 +
    0.5 *
      ((er - 1) / (er + 1)) *
      (Math.log(Math.PI / 2) + (1 / er) * Math.log(2 / Math.PI));
  console.log("H ", H);
  return validateNumber(H, "H_dash");
};

const get_d_er = (char_impedance: number, dielec_const: number): number => {
  let d_er =
    (59.95 * Math.pow(Math.PI, 2)) / (char_impedance * Math.sqrt(dielec_const));
  console.log("d_er ", d_er);
  return validateNumber(d_er, "d_er");
};

const get_eff_e = (
  dielec_const: number,
  height: number,
  width: number,
): number => {
  let u = validateNumber(width / height, "width/height ratio");
  let er = validateNumber(dielec_const, "dielectric constant");

  const a =
    1 +
    (1 / 49) *
      Math.log(
        (Math.pow(u, 4) + Math.pow(u / 52, 2)) / (Math.pow(u, 4) + 0.432),
      ) +
    (1 / 18.7) * Math.log(1 + Math.pow(u / 18.1, 3));

  const b = 0.564 * Math.pow((er - 0.9) / (er + 3), 0.053);

  const e_re = (er + 1) / 2 + ((er - 1) / 2) * Math.pow(1 + 10 / u, -a * b);

  return validateNumber(e_re, "effective dielectric constant");
};

const calculate_width_h = (
  char_impedance: number,
  dielec_const: number,
): number => {
  let width_h: number;

  if (char_impedance > 44 - 2 * dielec_const) {
    let H_dash = get_H_dash(char_impedance, dielec_const);
    let exp_H = Math.exp(H_dash);
    width_h = 1 / (exp_H / 8 - 1 / (4 * exp_H));
  } else {
    let d_er = get_d_er(char_impedance, dielec_const);
    let t1 = (2 / Math.PI) * (d_er - 1 - Math.log(2 * d_er - 1));
    let t2 =
      ((dielec_const - 1) / (Math.PI * dielec_const)) *
      (Math.log(d_er - 1) + 0.293 - 0.517 / dielec_const);
    width_h = 1 * (t1 + t2);
  }

  return width_h;
};

const get_width = ({
  dielect_height,
  metal_thickness,
  char_impedance,
  dielec_const,
}: {
  dielect_height: number;
  metal_thickness: number;
  char_impedance: number;
  dielec_const: number;
}): number => {
  let width_h = calculate_width_h(char_impedance, dielec_const);
  let width = width_h * dielect_height;
  console.log("width ", width);
  width = width - 1.25 * metal_thickness;

  return validateNumber(width, "width");
};

const get_phy_length = (
  elec_length: number,
  eff_dielec_const: number,
  frequency: number,
): number => {
  const c = 299792458; // Speed of light in vacuum in m/s
  let phy_length =
    (c / (frequency * Math.sqrt(eff_dielec_const))) * (elec_length / 360);
  return validateNumber(phy_length, "physical length");
};

const get_elec_length = (
  phy_length: number,
  eff_dielec_const: number,
  frequency: number,
): number => {
  const c = 299792458; // Speed of light in vacuum in m/s
  let elec_length =
    (frequency * Math.sqrt(eff_dielec_const) * (phy_length * 360)) / c;
  return validateNumber(elec_length, "electrical length");
};

const get_char_impedance = (
  eff_e: number,
  dielect_height: number,
  width: number,
): number => {
  let r = validateNumber(dielect_height / width, "height/width ratio");
  let F1 = 6 + (2 * Math.PI - 6) * Math.exp(-1 * Math.pow(30.999 * r, 0.7528));
  let z_1 = 60 * Math.log(F1 * r + Math.sqrt(1 + Math.pow(2 * r, 2)));
  let z0 = validateNumber(z_1 / eff_e, "characteristic impedance");
  return z0;
};

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
