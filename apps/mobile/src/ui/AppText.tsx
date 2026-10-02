import { StyleSheet, Text as RNText, TextInput as RNTextInput, type TextInputProps, type TextProps } from 'react-native';

/**
 * Vazirmatn (SoT §27.2). Android needs one font family per weight, so we map
 * fontWeight -> family and neutralise the synthetic weight. Falls back to the
 * system font automatically if the family failed to load.
 */
export const FONT = { regular: 'Vazirmatn_400Regular', bold: 'Vazirmatn_700Bold', black: 'Vazirmatn_900Black' } as const;

function familyFor(weight: unknown): string {
  const w = Number(weight === 'bold' ? 700 : weight === 'normal' || weight === undefined ? 400 : weight);
  if (w >= 800) return FONT.black;
  if (w >= 600) return FONT.bold;
  return FONT.regular;
}

export function Text({ style, ...rest }: TextProps) {
  const flat = StyleSheet.flatten(style) ?? {};
  return <RNText {...rest} style={[style, { fontFamily: familyFor(flat.fontWeight), fontWeight: 'normal' }]} />;
}

export function TextInput({ style, ...rest }: TextInputProps) {
  const flat = StyleSheet.flatten(style) ?? {};
  return <RNTextInput {...rest} style={[style, { fontFamily: familyFor(flat.fontWeight), fontWeight: 'normal' }]} />;
}
