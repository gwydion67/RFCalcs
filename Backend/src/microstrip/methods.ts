import { validateNumber } from "../common/utils/helpers";

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

export {
  get_H_dash,
  get_d_er,
  get_eff_e,
  calculate_width_h,
  get_width,
  get_phy_length,
  get_elec_length,
  get_char_impedance,
};
