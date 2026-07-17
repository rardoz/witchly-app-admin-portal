import type { ColorGenInput } from "@rc-component/color-picker";
import ColorPicker, { Color } from "@rc-component/color-picker";
import Trigger from "@rc-component/trigger";
import { useEffect, useRef, useState } from "react";
import FormInput from "../form-input";
import "@rc-component/color-picker/assets/index.css";
import type { BuildInPlacements } from "@rc-component/trigger";

const autoAdjustOverflowTopBottom = {
  shiftX: 64,
  adjustY: 1,
};

const autoAdjustOverflowLeftRight = { adjustX: 1, shiftY: true };

const targetOffset = [0, 0];

export const placements: BuildInPlacements = {
  left: {
    points: ["cr", "cl"],
    overflow: autoAdjustOverflowLeftRight,
    offset: [-4, 0],
    targetOffset,
  },
  right: {
    points: ["cl", "cr"],
    overflow: autoAdjustOverflowLeftRight,
    offset: [4, 0],
    targetOffset,
  },
  top: {
    points: ["bc", "tc"],
    overflow: autoAdjustOverflowTopBottom,
    offset: [0, -4],
    targetOffset,
  },
  bottom: {
    points: ["tc", "bc"],
    overflow: autoAdjustOverflowTopBottom,
    offset: [0, 4],
    targetOffset,
  },
  topLeft: {
    points: ["bl", "tl"],
    overflow: autoAdjustOverflowTopBottom,
    offset: [0, -4],
    targetOffset,
  },
  leftTop: {
    points: ["tr", "tl"],
    overflow: autoAdjustOverflowLeftRight,
    offset: [-4, 0],
    targetOffset,
  },
  topRight: {
    points: ["br", "tr"],
    overflow: autoAdjustOverflowTopBottom,
    offset: [0, -4],
    targetOffset,
  },
  rightTop: {
    points: ["tl", "tr"],
    overflow: autoAdjustOverflowLeftRight,
    offset: [4, 0],
    targetOffset,
  },
  bottomRight: {
    points: ["tr", "br"],
    overflow: autoAdjustOverflowTopBottom,
    offset: [0, 4],
    targetOffset,
  },
  rightBottom: {
    points: ["bl", "br"],
    overflow: autoAdjustOverflowLeftRight,
    offset: [4, 0],
    targetOffset,
  },
  bottomLeft: {
    points: ["tl", "bl"],
    overflow: autoAdjustOverflowTopBottom,
    offset: [0, 4],
    targetOffset,
  },
  leftBottom: {
    points: ["br", "bl"],
    overflow: autoAdjustOverflowLeftRight,
    offset: [-4, 0],
    targetOffset,
  },
};

const rgbToHex = (value?: string): string => {
  if (!value) return "";

  if (value.startsWith("#")) {
    return value.slice(0, 9);
  }

  const rgbMatch = value.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/,
  );

  if (rgbMatch) {
    const r = Number.parseInt(rgbMatch[1], 10);
    const g = Number.parseInt(rgbMatch[2], 10);
    const b = Number.parseInt(rgbMatch[3], 10);
    const a = rgbMatch[4]
      ? Math.round(Number.parseFloat(rgbMatch[4]) * 255)
      : null;

    const toHex = (n: number) => {
      const hex = Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0");
      return hex;
    };

    return a !== null
      ? `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`
      : `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  const hexValue = value.replace(/[^0-9a-fA-F#]/g, "").slice(0, 9);
  return hexValue.startsWith("#") ? hexValue : `#${hexValue}`;
};

const isValidHex = (hex: string) =>
  /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(hex);

const FormColorPicker: React.FC<{
  value: ColorGenInput;
  onChange: (color: Color) => void;
}> = ({ value, onChange }) => {
  const [inputText, setInputText] = useState(() =>
    rgbToHex(value?.toString() ?? ""),
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Don't overwrite what the user is actively typing
    if (document.activeElement !== inputRef.current) {
      setInputText(rgbToHex(value?.toString() ?? ""));
    }
  }, [value]);

  const commit = (text: string) => {
    const hex = text.startsWith("#") ? text : `#${text}`;
    if (isValidHex(hex)) {
      onChange(new Color(hex));
    } else {
      // Revert to last confirmed value
      setInputText(rgbToHex(value?.toString() ?? ""));
    }
  };

  const displayColor = isValidHex(inputText)
    ? inputText
    : rgbToHex(value?.toString() ?? "");

  return (
    <div className="flex items-center gap-1.5">
      <Trigger
        action={["click"]}
        prefixCls="rc-color-picker"
        popup={<ColorPicker disabledAlpha value={value} onChange={onChange} />}
        popupPlacement="bottomLeft"
        builtinPlacements={placements}
      >
        <button
          type="button"
          className="w-7 h-7 rounded border border-zinc-600 flex-shrink-0 cursor-pointer"
          style={{ backgroundColor: displayColor || "#18181b" }}
          aria-label="Open color picker"
        />
      </Trigger>
      <FormInput
        ref={inputRef}
        name=""
        type="text"
        autoComplete="off"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit((e.target as HTMLInputElement).value);
          }
        }}
      />
    </div>
  );
};

export default FormColorPicker;
